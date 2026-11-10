#!/usr/bin/env bash
# Cmd+Shift+B 단축: 로컬 dev 서버가 없으면 띄우고, 있으면 그 포트로 브라우저를 연다.
# 반복해서 눌러도 안전(중복 서버 안 띄움). 서버는 백그라운드로 유지된다.
set -u

# 스크립트 위치 기준으로 프로젝트 루트 계산 (경로 이동에도 견고)
PROJECT="$(cd "$(dirname "$0")/.." && pwd)"
PAGE="/quarrel" # 기본으로 열 페이지 (원하면 "" 로 바꾸면 홈)

# ⚠️ parkdohhan 전용 포트. 3000 등은 다른 프로젝트(예: GANA-COSMETICS)와
# 충돌하므로 절대 재사용하지 않는다. 이 포트가 응답하면 우리 서버로 간주.
PORT=3939

# 전용 포트가 비어 있으면 백그라운드 기동 후 준비될 때까지 대기 (최대 ~30s)
if ! curl -s -o /dev/null "http://localhost:$PORT"; then
  cd "$PROJECT" || exit 1
  nohup npm run dev -- -p "$PORT" >/tmp/parkdohhan-dev.log 2>&1 &
  echo "dev 서버 시작 (포트 $PORT) — 로그: /tmp/parkdohhan-dev.log"
  for _ in $(seq 1 60); do
    curl -s -o /dev/null "http://localhost:$PORT" && break
    sleep 0.5
  done
fi

open "http://localhost:$PORT$PAGE"
echo "→ 브라우저 열림: http://localhost:$PORT$PAGE"
