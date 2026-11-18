#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo 'Usage: bash deploy/publish.sh [--setup-caddy]'
}
case "${1:-}" in
  '') setup_caddy=0 ;;
  --setup-caddy) setup_caddy=1 ;;
  *) usage >&2; exit 2 ;;
esac
if (( $# > 1 || EUID == 0 )); then
  echo 'Run this script as the Ubuntu checkout owner, without sudo.' >&2
  exit 2
fi

cd "$(dirname "${BASH_SOURCE[0]}")/.."
domain=coreeyegroup.com
site_dir=/var/www/$domain
current=$site_dir/current
config=/etc/caddy/Caddyfile
root_prefix='^([[:blank:]]*)(root[[:blank:]]+(\*[[:blank:]]+)?)'
root_suffix='([[:blank:]]*(#.*)?)$'
site_pattern='/var/www/coreeyegroup\.com'
old_root="$root_prefix$site_pattern/(public|releases/[[:alnum:]_.-]+)$root_suffix"
stable_root="$root_prefix$site_pattern/current$root_suffix"
commit=$(git rev-parse HEAD)

fail() {
  printf '%s\n' "$*" >&2
  exit 1
}

check_checkout() {
  [[ $(git rev-parse HEAD) == "$commit" &&
     $(git rev-parse refs/remotes/origin/main) == "$commit" ]] ||
    fail 'The checkout must match origin/main.'
  git diff --quiet HEAD -- || fail 'Resolve tracked local changes before publishing.'
}

check_checkout
exec 9>"$(git rev-parse --git-path coreeye-publish.lock)"
flock -n 9 || fail 'A website publish is already running from this checkout.'

sudo -v
root_count=$(sudo -n grep -Ec "$stable_root" "$config" || true)
if (( setup_caddy )); then
  [[ "$root_count" == 0 ]] ||
    fail 'The stable Caddy root is already configured. Run without --setup-caddy.'
  matches=$(sudo -n grep -Ec "$old_root" "$config" || true)
  [[ "$matches" == 1 ]] ||
    fail "Expected one existing corporate static root in $config. Found ${matches:-none}."
else
  [[ "$root_count" == 1 ]] ||
    fail 'The stable Caddy root is missing. Run once with --setup-caddy.'
fi
if [[ -e "$current" && ! -L "$current" ]]; then
  fail "$current already exists and is not a symlink."
fi

npm ci
npm run build
check_checkout
test -s dist/index.html

sudo -v
response=$(mktemp)
link_stage=''
candidate=''
backup=''
previous=''
link_changed=0
config_changed=0

finish() {
  local status=$?
  local rollback_failed=0
  trap - EXIT
  if (( status != 0 )); then
    if (( link_changed )); then
      if [[ -n "$previous" ]]; then
        sudo -n ln -s "$previous" "$link_stage/previous" &&
          sudo -n mv -Tf "$link_stage/previous" "$current" || rollback_failed=1
      else
        sudo -n rm -f -- "$current" || rollback_failed=1
      fi
    fi
    if (( config_changed )); then
      sudo -n cp -p -- "$backup" "$config" &&
        sudo -n systemctl reload caddy || rollback_failed=1
    fi
    if (( rollback_failed )); then
      printf 'Automatic rollback failed. Previous release link: %s. Caddy backup: %s\n' \
        "${previous:-none}" "${backup:-none}" >&2
    elif (( link_changed || config_changed )); then
      echo 'Previous website configuration restored.' >&2
    fi
  fi
  rm -f -- "$response"
  if [[ -n "$candidate" ]]; then
    sudo -n rm -f -- "$candidate"
  fi
  if [[ -n "$link_stage" ]]; then
    sudo -n rm -f -- "$link_stage/current" "$link_stage/previous"
    sudo -n rmdir -- "$link_stage"
  fi
  exit "$status"
}
trap finish EXIT

if [[ -L "$current" ]]; then
  previous=$(readlink -- "$current")
fi

sudo -n install -d -m 0755 "$site_dir/releases"
release=$(sudo -n mktemp -d "$site_dir/releases/${commit:0:12}-XXXXXXXX")
sudo -n cp -R -- dist/. "$release/"
sudo -n chmod -R a+rX "$release"
sudo -n -u caddy test -r "$release/index.html"

if (( setup_caddy )); then
  sudo -n install -d -m 0700 /var/backups/coreeyegroup
  backup=$(sudo -n mktemp /var/backups/coreeyegroup/Caddyfile.XXXXXXXX)
  sudo -n cp -p -- "$config" "$backup"
  candidate=$(sudo -n mktemp /etc/caddy/.coreeye-Caddyfile.XXXXXXXX)
  sudo -n cp -p -- "$config" "$candidate"
  sudo -n cmp -s "$candidate" "$backup" || fail 'Caddy configuration changed during setup.'
  sudo -n sed -Ei "s~$old_root~\1\2$current\5\n\1rewrite /expertise/* /index.html~" "$candidate"
  sudo -n grep -Eq "$stable_root" "$candidate" || fail 'The candidate Caddy root was not updated.'
  sudo -n caddy validate --config "$candidate" --adapter caddyfile
  echo "Caddy backup: $backup"
fi

link_stage=$(sudo -n mktemp -d "$site_dir/.publish-XXXXXXXX")
sudo -n ln -s "$release" "$link_stage/current"
sudo -n mv -Tf "$link_stage/current" "$current"
link_changed=1

if (( setup_caddy )); then
  sudo -n cmp -s "$config" "$backup" || fail 'Caddy configuration changed before activation.'
  sudo -n mv -Tf "$candidate" "$config"
  config_changed=1
  sudo -n systemctl reload caddy
fi

origin=(--resolve "$domain:443:127.0.0.1" --max-time 10)
for path in / /expertise/finance /expertise/it /expertise/cyber /expertise/digital; do
  curl -fsS "${origin[@]}" -o "$response" "https://$domain$path"
  cmp -s "$response" "$release/index.html" || fail "Unexpected HTML for $path."
  printf 'OK %s\n' "$path"
done

api_status=$(curl -sS "${origin[@]}" -o "$response" -w '%{http_code}' "https://$domain/api/enquiries")
if [[ "$api_status" != 405 ]] || ! grep -qF 'Method not allowed.' "$response"; then
  fail "Unexpected enquiry API response (HTTP $api_status)."
fi
echo 'OK /api/enquiries (no enquiry sent)'
printf 'Published %s from %s\n' "$commit" "$release"
