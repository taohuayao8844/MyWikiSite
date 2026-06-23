# ============================================================
# 部署脚本 - 将 build 文件夹增量同步到阿里云宝塔服务器
# 用法:在项目根目录执行  npm run deploy:bt
#      或直接执行          .\scripts\deploy-to-bt.ps1
#
# 前置条件:
#   1. 已配置 SSH 密钥认证(公钥已加到服务器的 ~/.ssh/authorized_keys)
#   2. 修改 scripts/deploy.config.json 填入真实服务器信息
#
# 实现原理(代替 rsync):
#   - Windows Git Bash 不一定带 rsync,所以用 Windows 自带的 OpenSSH(sc.exe + ssh.exe)
#   - 保留目录(在服务器 sitePath 下但不在 build/ 中)用"服务器端移走→清理→scp 上传→移回"
# ============================================================

$ErrorActionPreference = "Stop"

function Write-Step($msg) { Write-Host "==> $msg" -ForegroundColor Cyan }
function Write-OK($msg)   { Write-Host "[OK] $msg" -ForegroundColor Green }
function Write-Err($msg)  { Write-Host "[ERR] $msg" -ForegroundColor Red; exit 1 }

# 切到项目根目录
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot
Write-Step "项目目录:$ProjectRoot"

# 读取配置(deploy.config.json)
$configPath = Join-Path $PSScriptRoot "deploy.config.json"
if (-not (Test-Path $configPath)) {
    Write-Err "未找到配置文件:$configPath"
}
$cfg = Get-Content $configPath -Raw -Encoding UTF8 | ConvertFrom-Json

$BT_HOST = $cfg.server.host
$BT_USER = $cfg.server.user
$BT_PORT = 22
if ($cfg.server.port) { $BT_PORT = $cfg.server.port }
$BT_PATH = $cfg.server.sitePath

# 校验必填项
if ($BT_HOST -eq "your.server.ip" -or $BT_PATH -eq "/www/wwwroot/yourblog.com/") {
    Write-Err "请先编辑 scripts/deploy.config.json,填入真实的服务器 host 和 sitePath"
}

# SSH 鉴权参数(仅支持密钥,密码方式 rsync/scp 都不友好)
if ($cfg.ssh.privateKeyPath) {
    $keyPath = $cfg.ssh.privateKeyPath
    if (-not (Test-Path $keyPath)) {
        Write-Err "SSH 私钥不存在:$keyPath"
    }
    # 注意:不要在 PowerShell 数组里给路径加引号 —— "..." 会被当成字面量传给 ssh,
    # ssh 会把整段(含引号)当文件名,报 "Identity file not accessible"
    $sshArgs = @("-i", $keyPath, "-p", "$BT_PORT", "-o", "StrictHostKeyChecking=no")
    $scpArgs = @("-i", $keyPath, "-P", "$BT_PORT", "-o", "StrictHostKeyChecking=no", "-r")
} else {
    Write-Err "未配置 ssh.privateKeyPath。本脚本仅支持 SSH 密钥方式部署"
}

# 检查 build 目录,不存在则构建
if (-not (Test-Path $cfg.build.outputDir)) {
    Write-Step "未找到 $($cfg.build.outputDir)/ 目录,先执行 $($cfg.build.command)"
    Invoke-Expression $cfg.build.command
    if ($LASTEXITCODE -ne 0) { Write-Err "构建失败,请检查上方输出" }
    Write-OK "构建完成"
} else {
    Write-OK "检测到已存在的 $($cfg.build.outputDir)/ 目录,跳过构建(若需重新构建请先删除该目录)"
    $ans = Read-Host "  是否跳过构建直接同步现有 build/?[Y/n]"
    if ($ans -eq "n" -or $ans -eq "N") {
        Write-Step "重新执行 $($cfg.build.command)"
        Invoke-Expression $cfg.build.command
        if ($LASTEXITCODE -ne 0) { Write-Err "构建失败" }
        Write-OK "构建完成"
    }
}

$buildDir = $cfg.build.outputDir

# ─────────────────────────────────────────────────────────────
# 1. 服务器端:把保留目录临时移走,清空部署目录
# ─────────────────────────────────────────────────────────────
$preserveNames = @()
if ($cfg.exclude -and $cfg.exclude.Count -gt 0) {
    $preserveNames = $cfg.exclude
    Write-OK "保留目录(不会被覆盖):$($preserveNames -join ', ')"
}

$moveCmds = @()
$restoreCmds = @()
foreach ($name in $preserveNames) {
    $tmpName = "__preserve_$([guid]::NewGuid().ToString('N').Substring(0,8))__$name"
    $moveCmds += "if [ -d '$BT_PATH/$name' ]; then mv '$BT_PATH/$name' '/tmp/$tmpName' && echo '[remote] moved: $name -> /tmp/$tmpName'; fi"
    $restoreCmds += "if [ -d '/tmp/$tmpName' ]; then mv '/tmp/$tmpName' '$BT_PATH/$name' && echo '[remote] restored: $name'; fi"
}

$cleanAndMoveCmd = @"
set -e
cd '$BT_PATH' || exit 1
echo '[remote] cleaning sitePath contents (keeping directory itself)...'
find '$BT_PATH' -mindepth 1 -maxdepth 1 -not -name '$(($preserveNames -join '" -not -name "'))' -exec rm -rf {} +
$($moveCmds -join "`n")
echo '[remote] cleanup done'
"@

Write-Step "服务器端:移走保留目录 + 清空 sitePath 内容"
Write-Host "  执行 ssh $BT_USER@${BT_HOST} ..." -ForegroundColor DarkGray
& ssh.exe @sshArgs "$BT_USER@${BT_HOST}" $cleanAndMoveCmd
if ($LASTEXITCODE -ne 0) { Write-Err "服务器端清理失败" }

# ─────────────────────────────────────────────────────────────
# 2. 本地 scp 上传 build 内容
# ─────────────────────────────────────────────────────────────
Write-Step "上传 build/ -> $BT_USER@${BT_HOST}:$BT_PATH/"
$sourcePath = (Resolve-Path $buildDir).Path
Write-Host "  源:$sourcePath" -ForegroundColor DarkGray
Write-Host "  目标:$BT_USER@${BT_HOST}:$BT_PATH/" -ForegroundColor DarkGray
& scp.exe @scpArgs "$sourcePath/*" "$BT_USER@${BT_HOST}:$BT_PATH/"
if ($LASTEXITCODE -ne 0) { Write-Err "scp 上传失败" }
Write-OK "上传完成"

# ─────────────────────────────────────────────────────────────
# 3. 服务器端:把保留目录移回原位
# ─────────────────────────────────────────────────────────────
if ($restoreCmds.Count -gt 0) {
    Write-Step "服务器端:恢复保留目录"
    $restoreCmd = @"
set -e
$($restoreCmds -join "`n")
echo '[remote] restore done'
"@
    & ssh.exe @sshArgs "$BT_USER@${BT_HOST}" $restoreCmd
    if ($LASTEXITCODE -ne 0) { Write-Err "保留目录恢复失败" }
}

Write-OK "部署完成!"
Write-Host "  访问站点查看效果:" -ForegroundColor Yellow
Write-Host "    http://39.108.181.47" -ForegroundColor Yellow
Write-Host "    https://www.zeropointnine.top" -ForegroundColor Yellow
if ($preserveNames -contains "39.108.181.47_5555") {
    Write-Host "    http://39.108.181.47:5555  (保留的 5555 服务)" -ForegroundColor Yellow
}