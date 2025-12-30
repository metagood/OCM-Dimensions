#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

run_make() {
  local dir="$1"
  echo "==> Building ${dir}"
  (cd "${repo_root}/${dir}" && make clean && make)
  if [ ! -f "${repo_root}/${dir}/index.html" ]; then
    echo "ERROR: ${dir}/index.html not created"
    exit 1
  fi
}

run_make "tools/compress-html"
run_make "tools/threejs"
run_make "tools/p5js"

echo "Smoke tests completed successfully."
