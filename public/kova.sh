#!/usr/bin/env bash
# kova.sh - a small command-line client for the Kova API.
# Works on Linux and macOS. Needs curl; uses jq for nicer output if it's installed.
#
#   export KOVA_URL=https://your-kova-site.example
#   ./kova.sh new you@example.com     # create a sandbox (email optional)
#   ./kova.sh score                   # current health score and reasons
#   ./kova.sh send contact.left role=champion
#   ./kova.sh send usage.weekly active_users=12 logins=28
#   ./kova.sh events                  # the last 10 events
#   ./kova.sh reset                   # back to the starting point
#
# Your sandbox key is kept in ~/.kova_key (override with KOVA_KEY).

set -euo pipefail

KOVA_URL="${KOVA_URL:-}"
KEY_FILE="${KOVA_KEY_FILE:-$HOME/.kova_key}"

die()  { printf 'kova: %s\n' "$*" >&2; exit 1; }
have() { command -v "$1" >/dev/null 2>&1; }

[ -n "$KOVA_URL" ] || die "set KOVA_URL first, e.g. export KOVA_URL=https://your-kova-site.example"
KOVA_URL="${KOVA_URL%/}"
have curl || die "curl is required"

key() {
  if [ -n "${KOVA_KEY:-}" ]; then printf '%s' "$KOVA_KEY"; return; fi
  [ -s "$KEY_FILE" ] || die "no sandbox yet. Run: $0 new"
  cat "$KEY_FILE"
}

# call METHOD PATH [JSON_BODY]  -> prints the body, fails on HTTP errors with the API's message
call() {
  local method="$1" path="$2" body="${3:-}" out code
  local args=(-sS -X "$method" "$KOVA_URL$path" -H "Accept: application/json" -w $'\n%{http_code}')
  [ "$path" = "/api/sandbox" ] || args+=(-H "Authorization: Bearer $(key)")
  [ -z "$body" ] || args+=(-H "Content-Type: application/json" --data "$body")
  out="$(curl "${args[@]}")" || die "could not reach $KOVA_URL"
  code="${out##*$'\n'}"; out="${out%$'\n'*}"
  if [ "$code" -ge 400 ]; then
    if have jq; then die "HTTP $code: $(printf '%s' "$out" | jq -r '.error.message // .')"; fi
    die "HTTP $code: $out"
  fi
  printf '%s' "$out"
}

pretty() { if have jq; then jq "$@"; else cat; echo; fi; }

# Turn key=value pairs into a JSON object. Numbers stay numbers.
to_json() {
  local first=1 pair k v out="{"
  for pair in "$@"; do
    [[ "$pair" == *=* ]] || die "expected key=value, got '$pair'"
    k="${pair%%=*}"; v="${pair#*=}"
    [[ "$k" =~ ^[a-z_]+$ ]] || die "bad field name '$k'"
    if [[ "$v" =~ ^-?[0-9]+$ ]]; then out+="$([ $first = 1 ] || echo ,)\"$k\":$v"
    else v="${v//\\/\\\\}"; v="${v//\"/\\\"}"; out+="$([ $first = 1 ] || echo ,)\"$k\":\"$v\""; fi
    first=0
  done
  printf '%s}' "$out"
}

cmd="${1:-help}"; shift || true
case "$cmd" in
  new)
    email="${1:-}"
    body="{}"; [ -z "$email" ] || body="{\"email\":\"$email\"}"
    res="$(call POST /api/sandbox "$body")"
    k="$(printf '%s' "$res" | sed -n 's/.*"api_key": *"\([^"]*\)".*/\1/p')"
    [ -n "$k" ] || die "unexpected response: $res"
    umask 077; printf '%s' "$k" > "$KEY_FILE"
    echo "Sandbox created. Key saved to $KEY_FILE"
    echo "Brightline Logistics is ready. Try: $0 score" ;;
  score)
    res="$(call GET /api/v1/account)"
    if have jq; then
      printf '%s' "$res" | jq -r '"\(.account.name): \(.health.score) (\(.health.band_label))",
        (.health.components[] | "  \(.label): \(.score|floor)/\(.max)  \(.reason)"),
        "Next step: \(.next_action)"'
    else printf '%s\n' "$res"; fi ;;
  send)
    type="${1:-}"; [ -n "$type" ] || die "usage: $0 send TYPE [key=value ...]"; shift
    data="$(to_json "$@")"
    res="$(call POST /api/v1/events "{\"type\":\"$type\",\"data\":$data}")"
    if have jq; then
      printf '%s' "$res" | jq -r '"\(.event.description)",
        "Health: \(.health.previous) -> \(.health.score) (\(.health.band))",
        (if .alert_triggered then "Alert raised: the account dropped a band" else empty end)'
    else printf '%s\n' "$res"; fi ;;
  events)
    call GET /api/v1/events | pretty -r '.data[:10][] | "\(.created_at[0:16])  [\(.source)]  \(.description)"' ;;
  reset)
    call POST /api/v1/reset >/dev/null && echo "Reset. Brightline is back to its starting point." ;;
  help|-h|--help)
    sed -n '2,15p' "$0" | sed 's/^# \{0,1\}//' ;;
  *) die "unknown command '$cmd'. Try: $0 help" ;;
esac
