---
title: 编程语言介绍之Latex
description: 写论文的话还是使用Latex吧，以美赛为例
date: 2026-03-30
tags:
  - 编程语言
---

>[!Main]
>
>description: 写论文的话还是使用Latex吧，以美赛为例
>date: 2026-03-30

## Latex 入门教程

1. 打开 Overleaf
2. `new project` 里面可以新建项目、选择模板
3. 点击右侧 `Recompile` 可以得到预览，此时就算保存了

一般把 `begin{document}` 和 `end{document}` 之间的称为正文区，在这之前的是导言区。

空白模版已经默认提供了一个大标题，我们可以加 `sub` 来获得小节和小小节。

```
\subsection{这是一个小节}
\subsubsection{这是一个小小节}
```

### 文档类型与包

文档类型：
一般 LaTeX 提供三种基本文档，`article`、`report` 和 `book`，分别用来写小篇幅的文章、中篇幅的报告和长篇幅的书籍。

宏包：

- amsmath：latex 数学公式支持
- graphicx：插入图片
- algorithm 和 algorithmic：算法排版
- listings：插入代码块

::: tip [如何使用中文]

更改编译设置：Menu -> Settings -> Compiler 选择 XeLaTex
更改文档类型：

```
\documentclass{ctexart} 
```

或者引用宏包：

```
\usepackage[UTF8]{ctex}
```

:::

### 摘要与目录

已默认生成的代码

```
\maketitle	% 显示标题等信息
```

以下部分放在正文当中，即 `/begin{document}` 后。

```
% 生成目录设置
\renewcommand{\contentsname}{目录} %将content转为目录
\tableofcontents

% 摘要开始部分
\begin{abstract}
该部分内容是放置摘要信息的。
\end{abstract}
```

### 公式

```
\usepackage{amsmath} %引用宏包

这是一个行内公式（$a=2b$）的写法，用两个\$夹住。
```

这是一个行间公式的写法：

```
\begin{equation}
    x = \frac{b^2}{2n} + \sqrt{n^2}
\end{equation}
```

### 图片

```
\usepackage{graphicx} %导入宏包
```

把你的图片上传到项目当中（拖入左侧栏目中）

```
%开始插入图片
\begin{figure}[htbp] % htbp代表图片插入位置的设置
\centering %图片居中
%添加图片；[]中为可选参数，可以设置图片的宽高；{}中为图片的相对位置
\includegraphics[width=12cm]{image.jpg}
\caption{红猪} % 图片标题
\label{pic1} % 图片标签
\end{figure}
```

- h(here): 当前位置；将图形放置在 正文文本中给出该图形环境的地方。如果本页所剩的页面不够， 这一参数将不起作用。
- t(top): 顶部；将图形放置在页面的顶部。
- b(bottom): 底部；将图形放置在页面的底部。
- p(page): 浮动页；将图形放置在允许有浮动对象的页面上。

此外关于图片插入的还有两个包：

```
\usepackage{subfigure}
\usepackage[graphicx]{realboxes}
```

### 布局与分段

现在我想给这张图片进行文字说明，我想文字居中怎么做呢？

```
\begin{center}
此段文字居中
\end{center}

\begin{flushright}
此段文字居右
\end{flushright}

\begin{flushleft}
此段文字居左
\end{flushleft}
```

此时，我们发现我们的文字跑到图片上方（上一页去了），是因为上一页图片放不下了。不妨用下面的语句，让文字放到图片之后。

```
\newpage  %分出新页
```

但是一段一段用 begin 有点麻烦，在同一个 begin 范围内我们也可以分段，换行两次或者用 `\par`。

```
%无序列表
\begin{itemize}
	\item 会显示一个小圆点
	\item[2*] 会用方括号内文字代替小圆点
\end{itemize}
```

```
%有序列表
\begin{enumerate}
	\item 第一点
	\item 第二点
\end{enumerate}
```

```
%表格
\begin{table}[h] % htbp代表表格浮动位置
% 表格居中
\centering
% 添加表头
\caption{变量表}
% 创建table环境
\begin{tabular}{|cc|c|} % 3个c代表3列都居中，也可以设置l或r，|代表竖线位置
% 表格的输入
\hline  % 一条水平线
x & y & z \\ % \\为换行符
\hline
11 & 22 & 33 \\
\hline
\end{tabular}
\end{table}
```

插入表格可以用 [生成Latex表格](https://tablesgenerator.com/) 来获得 Latex 语句。

::: tip [如何设置双栏]

```
\documentclass[twocolumn]{article}
```

:::