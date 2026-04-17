---
title: 编程语言介绍之Markdown
description: Markdown是世界上最无敌的一种语言。
date: 2026-03-29
tags:
  - 编程语言
---

>[!Main]
>
>description: Markdown是世界上最无敌的一种语言。
>date: 2026-03-29

# 关于 Markdown

Markdown 是用来编写结构化文档的一种纯文本格式，它使我们在双手不离开键盘的情况下，可以对文本进行一定程度的格式排版。你可以在 [这篇文章](https://sspai.com/post/36610) 中快速入门 Markdown。

由于目前还没有一个权威机构对 Markdown 的语法进行规范，各应用厂商制作时遵循的 Markdown 语法也是不尽相同的。其中比较受到认可的是 [GFM 标准](https://sspai.com/link?target=https%3A%2F%2Fgithub.github.com%2Fgfm%2F)，它是由著名代码托管网站 [GitHub](https://sspai.com/link?target=https%3A%2F%2Fgithub.com%2F) 所制定的。Typora 主要使用的也是 GFM 标准。同时，你还可以在 `文件 - 偏好设置 - Markdown 语法偏好 - 严格模式` 中将标准设置为「更严格地遵循 GFM 标准」。具体内容你可以在官方的 [这篇文档](https://sspai.com/link?target=http%3A%2F%2Fsupport.typora.io%2FStrict-Mode%2F) 中查看。

---

## Markdown 介绍与使用

### 简介

Markdown 是一种轻量级标记语言。

:::note[为什么要用 Markdown 呢？]
- 用途广泛：各种网站写博客、写文章，Github 项目说明等
- 只需键盘：例如 word 文档给字体加粗、斜体需要用鼠标，MD 只需加 * 很方便

这是[官网](https://www.markdownguide.org/getting-started/)
:::

### 编辑器

如果在上一周的教程中开始学习使用 Obsidian ，可以直接用它来尝试写一些 Markdown 语句。

如果没有安装，可以先尝试在知乎、CSDN 或者 CC98 用 Markdown 写一些文字。

### 通用语法演示

我会先在 Obsidian 中演示，再在**本网页**中展示。

```
这是**加粗**，这是*斜体*，这是***加粗+斜体***。

↑按两次 Enter 才是换行。

# 这是一级标题

## 这是二级标题

### 三级标题

#### 四级标题

---

↑水平分割线

- 分级的内容
	- tab
		- 次次级
	- shift tab
- 就是这样

1. 这有空格
2. 换行自动生成编号

> 引用或是什么

| 1 | 这是表格 |
---|---
| 2 | 白天 |
| 3 | 晚上 |

[百度](baidu.com)

```

Markdown 的图片一般有路径，因编辑地方不同而异。

一般在知乎、CSDN 等网页直接粘贴即可。在项目中写 Markdown 需要用相对路径来写。

### 更多彩的语法

Obsidian 的 note、caution 等。

```
>[!note]- 你好
>啊啊啊

>[!caution]+ 你好
>啊啊啊
```

对比我这里使用的 note、caution 等。


:::note[你好]
啊啊啊
:::

:::caution[你好]
啊啊啊
:::


这些语法是非通用的，一般各个平台都会说明特殊的 Markdown 语法，比如[Astro Starlight](https://starlight.astro.build/zh-cn/guides/authoring-content/)

Markdown 有很好的扩展性，插件很多，比如本网页使用的[rehype](https://github.com/rehypejs/rehype)、[remark](https://github.com/remarkjs) 插件，他也能让我缩放图片，他能让我的 Markdown 文档支持 Mathjax 数学公式输入。例如：

| $\frac{R_1R_2}{R_1+R_2}$ | `$\frac{R_1R_2}{R_1+R_2}$` |
| ------------------------ | -------------------------- |

插件相关各平台、框架也会有所说明，比如[Astro](https://docs.astro.build/en/guides/markdown-content/)。

### MDX 

参见 [MDX 文档](https://mdxjs.com/docs/what-is-mdx) 

MDX 可以解释为一种结合 Markdown 与 JSX 的格式，允许在你在 Markdown 文档中使用前端三大件。主要是 JavaScript 相关的组件可以导入。例如，下面这个：

<details>
<summary>展开↓</summary>
你好
</details>

```
<details>
<summary>展开↓</summary>
你好
</details>
```

## Latex 介绍

### 简介

LaTex是一款开源免费，并且应用相当广泛的排版工具，它对能对文字，公式，图片进行精确而复杂的排版，并且能保证全文各个章节格式的一致性，并且还能保证全文各个章节格式的一致性。

- 排版精细化
- 支持数学公式的优雅展现

**特别美观！名人推荐！科研必备！**

### 编辑器

除了以下列举的三种编辑器外，还有[Tex Maker](https://www.xm1math.net/texmaker/)、[Miktex](https://miktex.org/)、[lyx](https://www.lyx.org/) 等等。我不建议你每种都去尝试，然后找自己喜欢的编辑器，因为差别不太大，而且可能比较费时间（下载时间长）。最建议的方式是去 B站 找教程，你认为哪个国内资源丰富些，你觉得你会比较喜欢用，你就用哪种。

[TexLive、TeXstudio 安装配置](https://blog.csdn.net/zywhehe/article/details/83113214)

#### Overleaf

> 个人认为这个很够用了，还方便。

[国内版地址](https://cn.overleaf.com/)，海外版地址

- 易于使用，支持模版；
- **支持协作**；
- 支持文档历史；
- 离线使用，支持 Dropbox 和 GitHub 同步；

#### TeX Live

[官方（无须翻墙）](https://www.tug.org/texlive/)

- 开源免费；
- 全平台；

#### TeXstudio

[官网（须翻墙）](https://www.texstudio.org/)

- 强大的编辑性能，内置丰富的数学符号，支持表格格式，强大的图像处理能力
- 预览方便，内置结构视图，支持代码折叠、高级语法高亮、拼写检查、错误和警告提示
- 内置 PDF 阅读器、支持公式和代码段的实时更新及预览、支持图像等内容的提示预览
- 内置支持各种 LaTeX 编译器、索引、参考书目和词汇表工具

### 学习和使用

相比 Markdown ，Latex 有更庞大的语法内容需要学习，不建议一次性学完，而是采取用什么学什么的方式，比如`β`符号不会打，就去查，今天的教程会简单展示一些常规的使用语句。

我搜集了 Latex 的一些学习资源：

1. [一站式 LaTex 资源库](https://flowus.cn/latex/share/66110e84-b24a-4cd5-b8a7-2ba2afb35a30)：内有入门教程、各种排版设计之类的。**别去买什么什么课程**，完全没有必要，不过下载教程可以看一下。
2. [通用 LaTeX 数学公式语法手册](http://www.uinio.com/Math/LaTex/)：用于查找不会的符号等的打法。

其他遇到问题去 CSDN 等搜，一般都有。

写论文、写报告通常都是找一套模板，很少像这样从零开始纯手写的，我这里也提供一套模板，供下载使用。

