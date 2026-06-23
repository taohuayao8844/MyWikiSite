# 博客部署命令调用指南

> 本文档涵盖本仓库博客(`E:\Doc_Log\BlogBok`)部署到阿里云宝塔服务器 `39.108.181.47` 的全部命令和故障排查。

---

## 1. 快速开始

| 你想做的事 | 命令 |
|---|---|
| 一键部署(构建 + 上传) | `npm run deploy:bt` |
| 自动监听保存并部署 | `npm run deploy:bt:watch` |
| 启动本地开发服务器 | `npm run start` |
| 手动构建 | `npm run build` |
| 清空 build/ | `npm run clear` |

> ⚠️ 所有命令都在 `E:\Doc_Log\BlogBok` 目录下执行。

---

## 2. 部署流程图

```
本地编辑 .md / 组件
        │
        ▼
npm run deploy:bt:watch     ← 启动监听(自动)
        │
        ▼ (保存文件)
        │
  3 秒防抖 → npm run build → scp 上传 → 服务器端恢复保留目录
        │
        ▼
  站点生效(浏览器可能要 Ctrl+Shift+R 强刷)
```

---

## 3. 配置说明

配置文件:`scripts/deploy.config.json`

```jsonc
{
  "server": {
    "host": "39.108.181.47",        // 服务器 IP
    "user": "root",                 // SSH 用户
    "port": 22,                     // SSH 端口
    "sitePath": "/www/wwwroot/dist/" // 部署目录
  },
  "ssh": {
    "privateKeyPath": "C:\\Users\\27486\\.ssh\\id_rsa_main" // 私钥路径
  },
  "exclude": ["39.108.181.47_5555"], // 保留目录(不被覆盖)
  "build": {
    "command": "npm run build",     // 构建命令
    "outputDir": "build"            // 构建产物目录
  },
  "watch": {
    "enabled": false,               // watch 是否启用(脚本里未用,保留)
    "debounceMs": 3000,             // watch 防抖时间
    "ignore": [/* 监听忽略路径 */]
  }
}
```

修改后保存即可,无需重启任何东西,下次 `deploy:bt` 自动生效。

---

## 4. SSH 密钥配置(已完成)

服务器 `~/.ssh/authorized_keys` 已包含本机 RSA 公钥。

| 项 | 值 |
|---|---|
| 本机私钥 | `C:\Users\27486\.ssh\id_rsa_main` |
| 本机公钥 | `C:\Users\27486\.ssh\id_rsa_main.pub` |
| 服务器 authorized_keys | `/root/.ssh/authorized_keys`(两行:ed25519 + rsa) |

手动测试 SSH 登录:

```bash
ssh -i ~/.ssh/id_rsa_main root@39.108.181.47
```

不输密码直接进 = 正常。

---

## 5. 服务器端目录结构

```
/www/wwwroot/dist/                  ← 部署根目录(nginx root 指向这里)
├── 404.html
├── index.html
├── A_写在前面/                      ← 博客分类(docusaurus build 输出)
├── A_工科入门基础篇/
├── B_AI使用篇/
├── B_找工作实习篇/
├── B_硬件学习篇/
├── B_软件学习篇/
├── C_我在用什么系列/
└── 39.108.181.47_5555/              ← 【保留目录】部署时不会被覆盖
```

**重要**:`39.108.181.47_5555/` 是独立的旧站点(走 5555 端口),跟主博客无关,部署逻辑会自动保护它。

---

## 6. 常见操作命令清单

### 6.1 查看部署状态

```bash
# 服务器端
ssh -i ~/.ssh/id_rsa_main root@39.108.181.47 "ls /www/wwwroot/dist/ | wc -l"
# 输出应该是 10(8 个博客分类 + 404/index 等 + 保留目录)

# 本地构建产物大小
powershell -c "(Get-ChildItem E:\Doc_Log\BlogBok\build -Recurse | Measure-Object Length -Sum).Sum / 1MB"
```

### 6.2 强制重新部署(忽略现有 build)

```powershell
Remove-Item E:\Doc_Log\BlogBok\build -Recurse -Force
npm run deploy:bt
```

### 6.3 部署时只同步不构建

如果 `build/` 已有,`deploy:bt` 会提示:

```
是否跳过构建直接同步现有 build/?[Y/n]
```

- 回车 / `Y` → 直接同步(快)
- `N` → 先 `npm run build` 再同步

### 6.4 看部署日志 / 调试

部署脚本所有输出都在终端,无需查日志文件。如果出问题,直接看终端报错。

### 6.5 服务器端手动清理(紧急情况)

如果部署中断导致 `dist/` 半空:

```bash
ssh -i ~/.ssh/id_rsa_main root@39.108.181.47
```

```bash
# 在服务器上:
ls /tmp/ | grep preserve           # 看有没有飘着的保留目录
ls /www/wwwroot/dist/ | wc -l       # 看部署目录文件数(应该 10 左右)

# 如果保留目录飘着,移回去:
mv /tmp/__preserve_*__39.108.181.47_5555 /www/wwwroot/dist/

# 如果 dist 半空,先清空再重跑部署:
rm -rf /www/wwwroot/dist/*
# 然后回本地: npm run deploy:bt
```

---

## 7. 常见故障排查

### 7.1 `Permission denied (publickey)`

**症状**:SSH 登录失败,提示 `publickey` 认证被拒。

**排查**:
```bash
# 本地测试
ssh -i ~/.ssh/id_rsa_main -v root@39.108.181.47 2>&1 | grep -i "auth\|key"
```

**常见原因**:
- 服务器端改了 SSH 端口 → 修改 `deploy.config.json` 的 `port`
- 服务器端 `~/.ssh/authorized_keys` 被清空 → 用宝塔面板"文件"功能重新粘贴公钥(参考历史对话)
- 服务器端 `PasswordAuthentication no` 且没配密钥 → 必须走密钥方案

### 7.2 `Warning: Identity file "..." not accessible`

**症状**:脚本说找不到私钥。

**排查**:
```powershell
Test-Path C:\Users\27486\.ssh\id_rsa_main
# 应该返回 True
```

**修复**:在 `deploy.config.json` 里改对 `privateKeyPath`(用 `\\\\` 转义反斜杠)。

### 7.3 `WSL (11) ERROR: CreateProcessCommon`

**症状**:脚本里 `bash` 解析到了 WSL 启动器而不是 Git Bash。

**修复**:新版脚本已用 Windows 自带 OpenSSH(`scp.exe` / `ssh.exe`),不依赖 Git Bash。如果还出现这个错误,说明跑的是旧脚本 — 重新保存 `deploy-to-bt.ps1`。

### 7.4 scp 上传很慢 / 卡住

**症状**:上传大文件时停在那里不动。

**说明**:
- 第一次部署会比较久(几百 MB,几分钟到十几分钟)
- 不要 Ctrl+C 中断 —— 中断会让 `dist/` 处于半空状态

**如果必须中断**:
- 中断后先 SSH 进去把 `39.108.181.47_5555` 从 `/tmp/` 移回 `dist/`
- 然后重跑 `npm run deploy:bt`

### 7.5 浏览器看 404 / 样式丢失

**大概率是浏览器缓存**,强刷一下:
- Windows: `Ctrl + Shift + R`
- 或开 DevTools(F12)→ Network → Disable cache

---

## 8. 安全建议(有空就处理)

| 风险 | 现状 | 建议 |
|---|---|---|
| SSH root 密码泄露 | 已暴露 2-3 次 | 改 SSH 密码(宝塔"安全"页面) |
| 宝塔面板密码泄露 | 已暴露 | 改宝塔登录密码 |
| 密码登录开启 | 已禁用(只剩密钥) | ✓ 当前安全 |
| 宝塔面板端口 `14507` | 默认端口易扫 | 改成自定义 |
| SSH 端口 22 | 默认端口易扫 | 改成 5 位数随机 |

---

## 9. 相关文件位置

| 文件 | 作用 |
|---|---|
| `scripts/deploy.config.json` | 部署配置(服务器信息、密钥路径等) |
| `scripts/deploy-to-bt.ps1` | 部署主脚本(构建 + 上传) |
| `scripts/deploy-watch.js` | watch 监听脚本(Node.js 零依赖) |
| `scripts/deploy.README.md` | 部署详细说明(历史版本) |
| `package.json` | npm scripts 定义 |

---

## 10. 一句话总结

**改完文件 → `npm run deploy:bt:watch` → 保持终端开着 → 自动部署 → 浏览器强刷看效果。**

完事了就这么用,卡了回看本指南第 7 节。