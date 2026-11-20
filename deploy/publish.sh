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
public_site='^[[:blank:]]*(https://)?coreeyegroup\.com(:443)?[[:blank:]]*\{[[:blank:]]*(#.*)?$'
public_pages='^[[:blank:]]*@coreeyePublicPages path / /index\.html /expertise/\* /contact /contact/\* /privacy /privacy/\* /sitemap\.xml[[:blank:]]*$'
legacy_pages='^[[:blank:]]*@coreeyePublicPages path / /index\.html /expertise/\*[[:blank:]]*$'
legacy_rewrite='^([[:blank:]]*)rewrite[[:blank:]]+/expertise/\*[[:blank:]]+/index\.html[[:blank:]]*$'
static_routes='^[[:blank:]]*# coreeye-static-routes[[:blank:]]*$'
public_robots='^[[:blank:]]*header[[:blank:]]+@coreeyePublicPages[[:blank:]]+-X-Robots-Tag[[:blank:]]*$'
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
update_caddy=$setup_caddy
if ! sudo -n grep -Eq "$static_routes" "$config" ||
   ! sudo -n grep -Eq "$public_pages" "$config" ||
   ! sudo -n grep -Eq "$public_robots" "$config"; then
  matches=$(sudo -n grep -Ec "$public_site" "$config" || true)
  [[ "$matches" == 1 ]] || fail 'Expected one coreeyegroup.com site block in the Caddyfile.'
  update_caddy=1
fi

service_health=$(curl -fsS --max-time 5 http://127.0.0.1:3107/health) ||
  fail 'The enquiry service is unavailable on 127.0.0.1:3107.'
printf '%s' "$service_health" | node -e '
  const health = JSON.parse(require("node:fs").readFileSync(0, "utf8"))
  if (health.status !== "ok" || !health.interests?.includes("Strategic Partnerships")) process.exit(1)
' || fail 'Update and restart the enquiry service before publishing. See README.md.'

if [[ -e "$current" && ! -L "$current" ]]; then
  fail "$current already exists and is not a symlink."
fi

npm ci
npm run build
check_checkout
test -s dist/index.html

sudo -v
probe_dir=$(mktemp -d)
response=$probe_dir/body
headers=$probe_dir/headers
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
  rm -f -- "$response" "$headers"
  rmdir -- "$probe_dir"
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

if (( update_caddy )); then
  sudo -n install -d -m 0700 /var/backups/coreeyegroup
  backup=$(sudo -n mktemp /var/backups/coreeyegroup/Caddyfile.XXXXXXXX)
  sudo -n cp -p -- "$config" "$backup"
  candidate=$(sudo -n mktemp /etc/caddy/.coreeye-Caddyfile.XXXXXXXX)
  sudo -n cp -p -- "$config" "$candidate"
  sudo -n cmp -s "$candidate" "$backup" || fail 'Caddy configuration changed during setup.'
  if (( setup_caddy )); then
    sudo -n sed -Ei "s~$old_root~\1\2$current\5~" "$candidate"
  fi
  if ! sudo -n grep -Eq "$static_routes" "$candidate"; then
    if (( ! setup_caddy )); then
      matches=$(sudo -n grep -Ec "$legacy_rewrite" "$candidate" || true)
      [[ "$matches" == 1 ]] || fail 'Expected the existing expertise rewrite to appear once.'
      sudo -n sed -Ei "s~$legacy_rewrite~~" "$candidate"
    fi
    sudo -n sed -Ei "\~$public_site~a\  # coreeye-static-routes\n  handle_errors 404 {\n    rewrite * /404.html\n    file_server\n  }" "$candidate"
    sudo -n grep -Eq "$static_routes" "$candidate" || fail 'The static route marker was not added.'
  fi
  matcher='@coreeyePublicPages path / /index.html /expertise/* /contact /contact/* /privacy /privacy/* /sitemap.xml'
  if ! sudo -n grep -Eq "$public_robots" "$candidate"; then
    sudo -n sed -Ei "\~$public_site~a\  $matcher\n  header @coreeyePublicPages -X-Robots-Tag" "$candidate"
  elif ! sudo -n grep -Eq "$public_pages" "$candidate"; then
    matches=$(sudo -n grep -Ec "$legacy_pages" "$candidate" || true)
    [[ "$matches" == 1 ]] || fail 'Expected the existing public index matcher to appear once.'
    sudo -n sed -Ei "s~$legacy_pages~  $matcher~" "$candidate"
  fi
  sudo -n grep -Eq "$public_pages" "$candidate" || fail 'The public index matcher was not updated.'
  sudo -n grep -Eq "$public_robots" "$candidate" || fail 'The public robots header rule is missing.'
  sudo -n grep -Eq "$stable_root" "$candidate" || fail 'The candidate Caddy root was not updated.'
  sudo -n caddy validate --config "$candidate" --adapter caddyfile
  echo "Caddy backup: $backup"
fi

link_stage=$(sudo -n mktemp -d "$site_dir/.publish-XXXXXXXX")
sudo -n ln -s "$release" "$link_stage/current"
sudo -n mv -Tf "$link_stage/current" "$current"
link_changed=1

if (( update_caddy )); then
  sudo -n cmp -s "$config" "$backup" || fail 'Caddy configuration changed before activation.'
  sudo -n mv -Tf "$candidate" "$config"
  config_changed=1
  sudo -n systemctl reload caddy
fi

origin=(--resolve "$domain:443:127.0.0.1" --max-time 10)
for path in / /expertise/finance/ /expertise/it/ /expertise/cyber/ /expertise/digital/ /contact/ /privacy/; do
  curl -fsS "${origin[@]}" -D "$headers" -o "$response" "https://$domain$path"
  cmp -s "$response" "$release${path}index.html" || fail "Unexpected HTML for $path."
  if grep -Eiq '^x-robots-tag:.*\b(noindex|nofollow|none)\b' "$headers"; then
    fail "Indexing is still blocked by the HTTP header for $path."
  fi
  printf 'OK %s\n' "$path"
done

curl -fsS "${origin[@]}" -o "$response" "https://$domain/sitemap.xml"
cmp -s "$response" "$release/sitemap.xml" || fail 'Unexpected sitemap.'
echo 'OK /sitemap.xml'
curl -fsS "${origin[@]}" -o "$response" "https://$domain/robots.txt"
grep -qFx "Sitemap: https://$domain/sitemap.xml" "$response" || fail 'The robots file does not advertise the sitemap.'
echo 'OK /robots.txt'

missing_status=$(curl -sS "${origin[@]}" -o "$response" -w '%{http_code}' "https://$domain/expertise/coreeye-missing-page")
if [[ "$missing_status" != 404 ]] || ! cmp -s "$response" "$release/404.html"; then
  fail "Unexpected not-found response (HTTP $missing_status)."
fi
echo 'OK custom 404'

api_status=$(curl -sS "${origin[@]}" -o "$response" -w '%{http_code}' "https://$domain/api/enquiries")
if [[ "$api_status" != 405 ]] || ! grep -qF 'Method not allowed.' "$response"; then
  fail "Unexpected enquiry API response (HTTP $api_status)."
fi
echo 'OK /api/enquiries (no enquiry sent)'
printf 'Published %s from %s\n' "$commit" "$release"
