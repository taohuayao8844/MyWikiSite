# 项目构建和启动指南

## 项目说明
这是一个基于 Docusaurus 2.2.0 的静态网站生成器项目。

## 环境要求
- Node.js v14 或更高版本
- npm 或 pnpm 包管理器

## 安装依赖

在项目根目录执行以下命令安装所有依赖：

```bash
npm install
```

或使用 pnpm（如果已安装）：

```bash
pnpm install
```

**注意**：第一次安装可能需要几分钟，请耐心等待。

## 启动开发服务器

安装依赖完成后，执行以下命令启动开发服务器：

```bash
npm start
```

服务器将在 http://localhost:3000 启动。

开发服务器会实时监听文件变化，修改文档后浏览器会自动刷新。

## 构建用于生产的静态文件

```bash
npm run build
```

构建完成后，生成的静态文件将位于 `build/` 目录。

## 其他常用命令

- **清除缓存**：`npm run clear`
- **预览生产构建**：`npm run serve`
- **修复审计问题**：`npm audit fix`
- **完整检查**：`npm audit`

## 常见问题

### 问题 1：scripts 配置错误
如果启动时出现 `"scripts[0]" is invalid` 错误，这是因为 `docusaurus.config.js` 中的追踪脚本环境变量未定义。

**解决方案**：已在配置中修改为条件判断，只在环境变量存在时加载追踪脚本。

### 问题 2：端口已被占用
如果 3000 端口已被占用，Docusaurus 会自动尝试使用下一个可用端口。

### 问题 3：npm install 卡住
如果安装过程卡住，可以：
1. 按 `Ctrl+C` 中断
2. 清除 node_modules：`npm run clear` 或 `rm -r node_modules package-lock.json`
3. 重新执行 `npm install`

## 项目结构

```
├── docs/              # 博客/文档内容
├── blog/              # 博客文章
├── src/               # React 组件和自定义页面
├── static/            # 静态资源
├── docusaurus.config.js  # Docusaurus 配置文件
├── sidebars.js        # 侧边栏配置
├── babel.config.js    # Babel 配置
└── package.json       # 项目依赖配置
```

## 部署

项目可以部署到任何支持静态网站的服务器，例如：
- GitHub Pages
- Netlify
- Vercel
- 自有服务器

详见 Docusaurus 官方文档：https://docusaurus.io/docs/deployment
