#!/usr/bin/env node
/**
 * 保存即部署 - 监听 docs/ blog/ src/ 配置文件变化,触发 build + 增量同步
 * 用法:npm run deploy:bt:watch
 * 退出:Ctrl+C
 */

const fs = require('fs');
const path = require('path');
const { spawnSync, execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const cfg = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'deploy.config.json'), 'utf8')
);

const WATCH_DIRS = ['docs', 'blog', 'src'];
const WATCH_FILES = ['docusaurus.config.js', 'sidebars.js', 'package.json'];
const IGNORE_PATTERNS = (cfg.watch?.ignore || []).map((p) =>
  p.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*')
);
const IGNORE_REGEX = new RegExp(
  `^(${IGNORE_PATTERNS.join('|')})$`,
  'i'
);
const DEBOUNCE_MS = cfg.watch?.debounceMs || 3000;

let timer = null;
let isDeploying = false;

const color = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
};

function log(colorName, prefix, msg) {
  console.log(`${color[colorName]}${prefix}${color.reset} ${msg}`);
}

function shouldIgnore(filePath) {
  const rel = path.relative(ROOT, filePath).replace(/\\/g, '/');
  return IGNORE_REGEX.test(rel);
}

function triggerDeploy(changedFile) {
  if (isDeploying) {
    log('yellow', '⟳', `部署进行中,忽略本次触发(${path.basename(changedFile)})`);
    return;
  }

  log('cyan', '==> 检测到变化', path.relative(ROOT, changedFile));

  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    isDeploying = true;
    log('cyan', '==> 开始构建 + 部署', new Date().toLocaleTimeString());

    // 1. 构建
    const buildResult = spawnSync(
      cfg.build.command,
      { stdio: 'inherit', shell: true }
    );
    if (buildResult.status !== 0) {
      log('red', '[ERR]', '构建失败,跳过部署');
      isDeploying = false;
      return;
    }

    // 2. 调用 PowerShell 部署脚本
    const deployScript = path.join(__dirname, 'deploy-to-bt.ps1');
    const deployResult = spawnSync(
      'pwsh',
      ['-ExecutionPolicy', 'Bypass', '-File', deployScript],
      { stdio: 'inherit' }
    );

    if (deployResult.status === 0) {
      log('green', '[OK]', `部署完成 ${new Date().toLocaleTimeString()}`);
    } else {
      log('red', '[ERR]', '部署失败');
    }
    isDeploying = false;
  }, DEBOUNCE_MS);
}

function watchRecursive(dir) {
  if (!fs.existsSync(dir)) return;
  try {
    fs.watch(dir, { recursive: true }, (eventType, filename) => {
      if (!filename) return;
      const fullPath = path.join(dir, filename);
      if (shouldIgnore(fullPath)) return;
      triggerDeploy(fullPath);
    });
  } catch (err) {
    log('red', '[ERR]', `监听 ${dir} 失败:${err.message}`);
  }
}

console.log('');
log('cyan', '🟢', '保存即部署 - 启动监听');
console.log('');
log('gray', '   监听目录:', WATCH_DIRS.join(' / '));
log('gray', '   监听文件:', WATCH_FILES.join(' / '));
log('gray', '   防抖时长:', `${DEBOUNCE_MS}ms`);
log('gray', '   退出方式:', 'Ctrl+C');
console.log('');

WATCH_DIRS.forEach(watchRecursive);
WATCH_FILES.forEach((file) => {
  const fullPath = path.join(ROOT, file);
  if (!fs.existsSync(fullPath)) return;
  fs.watch(fullPath, () => triggerDeploy(fullPath));
});

log('gray', '💡', '现在修改 docs/ blog/ src/ 下的任意文件,保存后会自动部署');
console.log('');