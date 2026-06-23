# 部署到阿里云宝塔服务器

> 本项目使用本地构建 + `rsync` 增量同步到自家阿里云服务器(宝塔面板)的方式部署。

## 目录

1. [前置准备](#前置准备)
2. [方案 A · 本地一键部署](#方案-a--本地一键部署一键构建并上传)
3. [方案 B · 保存即部署(自动)](#方案-b--保存即部署监听文件变化自动部署)
4. [常见问题排查](#常见问题排查)

---

## 前置准备

### 1. 安装 Git for Windows

rsync 通过 Git Bash 调用,所以需要先装 Git for Windows(自带 bash + rsync)。

下载地址:<https://git-scm.com/download/win>

装完之后,打开 PowerShell 输入 `bash --version` 应该能正常输出。

### 2. 生成 SSH 密钥对

打开 PowerShell 或 Git Bash:

```bash
ssh-keygen -t ed25519 -C "blogbok-deploy"
# 提示输入文件名直接回车(默认 ~/.ssh/id_ed25519)
# 提示输入密码直接回车(免密部署)
```

生成的密钥对:
- 私钥:`~/.ssh/id_ed25519`(留在本地,不能泄露)
- 公钥:`~/.ssh/id_ed25519.pub`

### 3. 把公钥加到服务器

把公钥内容复制到阿里云服务器的 `~/.ssh/authorized_keys`:

```bash
# 方式 A:在 PowerShell 里直接 ssh-copy-id(如果有的话)
ssh-copy-id -i ~/.ssh/id_ed25519.pub root@your.server.ip

# 方式 B:手动复制
cat ~/.ssh/id_ed25519.pub
# 复制输出的整段内容,粘贴到服务器上的 ~/.ssh/authorized_keys 末尾
```

测试连接(应免密登录):

```bash
ssh -i ~/.ssh/id_ed25519 root@your.server.ip
```

### 4. 确认宝塔站点目录

宝塔建站时一般会创建类似 `/www/wwwroot/yourblog.com/` 的目录,记下来填到配置里。

---

## 方案 A · 本地一键部署(构建 + 上传)

### 配置

编辑 `scripts/deploy.config.json`:

```jsonc
{
  "server": {
    "host": "8.129.xxx.xxx",                    // ← 你的服务器 IP
    "user": "root",
    "port": 22,
    "sitePath": "/www/wwwroot/yourblog.com/"    // ← 宝塔站点目录
  },
  "ssh": {
    "privateKeyPath": "C:\\Users\\27486\\.ssh\\id_ed25519",  // ← 私钥路径
    "usePassword": false,
    "password": ""
  }
}
```

> **Windows 路径里的反斜杠要写两个** `\\`,JSON 里 `\` 是转义字符。

### 使用

```bash
npm run deploy:bt
```

执行流程:

1. 检查 `build/` 是否存在,不存在则自动 `npm run build`
2. 增量同步 `build/` 到服务器(只传变化的文件,删除目标端多出的)
3. 提示部署完成 + 访问链接

### 想强制重新构建

如果 `build/` 已存在但你想重新生成,跑脚本时它会问你:

```
是否跳过构建直接同步现有 build/?[Y/n]
```

输入 `n` 重新构建。

---

## 方案 B · 保存即部署(监听文件变化自动部署)

> 写完文章保存一下,自动触发 build + 上传,真正"无感"部署。

### 启用

1. 编辑 `scripts/deploy.config.json`,把 `"watch": { "enabled": false }` 改成 `true`(可选,只是为了表明意图)
2. 跑:

```bash
npm run deploy:bt:watch
```

启动后控制台会显示监听目录,然后你正常写博客就行:

```
🟢 保存即部署 - 启动监听

   监听目录:docs / blog / src
   防抖时长:3000ms
   退出方式:Ctrl+C

💡 现在修改 docs/ blog/ src/ 下的任意文件,保存后会自动部署

==> 检测到变化 docs/我的新文章.md
==> 开始构建 + 部署 09:32:15
[OK] 部署完成 09:32:48
```

**防抖**:3 秒内连续保存只触发一次,避免编辑过程中重复部署。

**退出**:`Ctrl + C` 结束监听。

### 进阶:同时跑本地预览 + 自动部署

开两个终端:

```bash
# 终端 1:本地预览(改了立刻看到效果)
npm start

# 终端 2:保存即部署(确保线上同步)
npm run deploy:bt:watch
```

或者更省事,在 VSCode 里装一个 `npm-run-all` 扩展可以一键并发跑两个。

---

## 常见问题排查

### `bash: 未找到命令`

没装 Git for Windows,或 PowerShell 没刷新 PATH。装完 Git 之后**新开一个 PowerShell 窗口**再跑。

### `Permission denied (publickey)`

SSH 公钥没加到服务器。重新做"前置准备 - 步骤 3"。

### `rsync: connection unexpectedly closed`

通常是防火墙挡住了 22 端口。检查:
- 阿里云安全组是否放行了 22 端口
- 宝塔面板里"安全"页是否放行 SSH

### `rsync: failed to set times ... Operation not permitted`

权限问题。给宝塔站点目录授权(在服务器上跑):

```bash
chown -R www:www /www/wwwroot/yourblog.com/
```

### 部署成功但访问还是旧内容

宝塔的 nginx 可能会缓存。强制刷新:`Ctrl + Shift + R`,或检查宝塔站点配置里 `open_file_cache` 是否关闭。

### 想部署到多个站点

复制 `scripts/deploy.config.json` 为 `deploy.config.production.json`,然后在脚本里读指定文件。或者写成函数接收参数。需要的话告诉我,我帮你改。

---

## 文件清单

| 文件 | 用途 |
|---|---|
| `scripts/deploy.config.json` | 部署配置(服务器地址、SSH、构建命令) |
| `scripts/deploy-to-bt.ps1` | 一键部署脚本(Windows PowerShell) |
| `scripts/deploy-watch.js` | 保存即部署监听器(可选,Node.js 零依赖) |
| `scripts/deploy.README.md` | 本说明文档 |

---

## 后续可考虑(进阶)

- **服务器端裸 Git 仓库 + post-receive hook**:push 到服务器仓库就自动拉取 + 构建 + 部署,完全无本地参与。但需要服务器有 Node 环境。
- **rsync 改为基于 SSH config 的别名**:把服务器信息写到 `~/.ssh/config`,脚本里只写 `BT_HOST=blog`。
- **失败回滚**:rsync 上传前先 `cp -r` 一份旧版本,失败时一键回滚。

需要其中任何一项,跟我说一声就给你接上。