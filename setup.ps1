#  いっぽ 試作版の準備と起動
#  1回目：必要な部品を入れて起動します（数分かかります）
#  2回目以降：起動だけします
$ErrorActionPreference = 'Continue'
Set-Location -Path $PSScriptRoot
$log = Join-Path $PSScriptRoot 'setup_log.txt'
"=== $(Get-Date) ===" | Out-File -FilePath $log -Append -Encoding utf8

function Step($msg) {
  Write-Host ""
  Write-Host "==> $msg" -ForegroundColor Cyan
  "==> $msg" | Out-File -FilePath $log -Append -Encoding utf8
}
function Run($cmd) {
  "> $cmd" | Out-File -FilePath $log -Append -Encoding utf8
  cmd /c "$cmd 2>&1" | Tee-Object -FilePath $log -Append | Out-Host
  return $LASTEXITCODE
}

Step "Node.js を確認しています"
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
  Write-Host "Node.js が見つかりません。" -ForegroundColor Yellow
  "NODE_MISSING" | Out-File -FilePath $log -Append -Encoding utf8
  $ans = Read-Host "今から Node.js をインストールしますか？ (y/n)"
  if ($ans -eq 'y') {
    Run "winget install -e --id OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements" | Out-Null
    Write-Host ""
    Write-Host "インストールが終わったら、このウィンドウを閉じて、もう一度 setup.bat をダブルクリックしてください。" -ForegroundColor Green
  } else {
    Write-Host "https://nodejs.org から LTS 版を入れてから、もう一度ダブルクリックしてください。"
  }
  Read-Host "Enter で閉じます"
  exit 1
}
Run "node -v" | Out-Null
Run "npm -v" | Out-Null

if (-not (Test-Path (Join-Path $PSScriptRoot 'package.json'))) {
  Step "Expo の土台を作っています（初回のみ）"
  if (Test-Path '_tmp') { Remove-Item -Recurse -Force '_tmp' }
  $code = Run "npx --yes create-expo-app@latest _tmp --template blank-typescript --no-install"
  if (-not (Test-Path '_tmp\package.json')) {
    Write-Host "土台を作れませんでした。setup_log.txt を Claude に見せてください。" -ForegroundColor Red
    "CREATE_FAILED" | Out-File -FilePath $log -Append -Encoding utf8
    Read-Host "Enter で閉じます"; exit 1
  }
  # 土台のファイルをコピー（Claude が書いた App.tsx は上書きしない）
  Get-ChildItem -Path '_tmp' -Force | Where-Object { $_.Name -ne 'App.tsx' -and $_.Name -ne 'node_modules' } | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination $PSScriptRoot -Recurse -Force
  }
  Remove-Item -Recurse -Force '_tmp'

  Step "部品をインストールしています（数分かかります）"
  Run "npm install" | Out-Null
  Run "npx expo install react-dom react-native-web @expo/metro-runtime @react-native-async-storage/async-storage react-native-svg" | Out-Null
}

if (-not (Test-Path (Join-Path $PSScriptRoot 'node_modules'))) {
  Step "部品をインストールしています"
  Run "npm install" | Out-Null
}

Step "コードの型チェック"
$tsc = Run "npx tsc --noEmit"
if ($tsc -eq 0) { "TSC_OK" | Out-File -FilePath $log -Append -Encoding utf8 } else { "TSC_ERRORS" | Out-File -FilePath $log -Append -Encoding utf8 }

Step "Web版を起動します。ブラウザが開くまで少し待ってください（このウィンドウは閉じないでください）"
"STARTING_WEB" | Out-File -FilePath $log -Append -Encoding utf8
cmd /c "npx expo start --web --port 8081"
