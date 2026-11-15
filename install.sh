#!/usr/bin/env bash
# Installs the skill as a symlink at ~/.claude/skills/krimi-dinner.
#   ./install.sh                     create the link
#   ./install.sh --output-dir PATH   also set the output folder for games
set -euo pipefail
repo="$(cd "$(dirname "$0")" && pwd)"
target="$HOME/.claude/skills/krimi-dinner"

mkdir -p "$HOME/.claude/skills"
if [ -e "$target" ] && [ ! -L "$target" ]; then
  echo "$target already exists and is not a symlink. Please check it yourself." >&2
  exit 1
fi
ln -sfn "$repo/krimi-dinner" "$target"
echo "Skill linked: $target -> $repo/krimi-dinner"

if [ "${1:-}" = "--output-dir" ] && [ -n "${2:-}" ]; then
  mkdir -p "$HOME/.krimi-dinner"
  printf '{\n  "output_dir": "%s"\n}\n' "$2" > "$HOME/.krimi-dinner/config.json"
  echo "Output folder: $2"
fi

command -v typst >/dev/null || echo "Note: typst is missing (brew install typst), no PDFs can be built without it."
command -v node >/dev/null || echo "Note: Node.js is missing."
