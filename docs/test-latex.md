---
sidebar_position: 999
title: LaTeX 公式测试
---

# LaTeX 公式渲染测试

本文档用于测试网站是否支持 Markdown 中的 LaTeX 公式渲染。

## 行内公式

行内公式使用单个美元符号包围，例如：$E = mc^2$。

当 $x \to 0$ 时，$\frac{\sin x}{x} \to 1$。

## 块级公式

块级公式使用双美元符号包围：

$$
f(x) = \int_{-\infty}^{\infty} \hat{f}(\xi)\,e^{2\pi i \xi x} \,d\xi
$$

## 常用数学符号

### 希腊字母

- $\alpha, \beta, \gamma, \delta, \epsilon, \theta, \lambda, \mu, \pi, \sigma, \phi, \omega$
- $\Gamma, \Delta, \Theta, \Lambda, \Pi, \Sigma, \Phi, \Omega$

### 运算符

- 加减乘除：$a + b - c \times d \div e$
- 上下标：$x_1, x_2, y^{2n}$
- 分数：$\frac{a}{b}, \frac{x + y}{x - y}$
- 根号：$\sqrt{2}, \sqrt[n]{x}$
- 求和：$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$
- 积分：$\int_{a}^{b} f(x) dx$

### 矩阵

$$
\begin{bmatrix}
a_{11} & a_{12} & \cdots & a_{1n} \\
a_{21} & a_{22} & \cdots & a_{2n} \\
\vdots & \vdots & \ddots & \vdots \\
a_{m1} & a_{m2} & \cdots & a_{mn}
\end{bmatrix}
$$

### 复杂公式

欧拉公式：
$$
e^{i\pi} + 1 = 0
$$

薛定谔方程：
$$
i\hbar\frac{\partial}{\partial t}\Psi(\mathbf{r},t) = \left[-\frac{\hbar^2}{2m}\nabla^2 + V(\mathbf{r},t)\right]\Psi(\mathbf{r},t)
$$

傅里叶变换：
$$
\mathcal{F}\{f(t)\} = \int_{-\infty}^{\infty} f(t)e^{-i\omega t}dt = F(\omega)
$$

## 多行公式

$$
\begin{aligned}
(a + b)^2 &= a^2 + 2ab + b^2 \\
(a + b)^3 &= a^3 + 3a^2b + 3ab^2 + b^3 \\
(a + b)^n &= \sum_{k=0}^{n} \binom{n}{k}a^{n-k}b^k
\end{aligned}
$$

## 定理示例

**勾股定理**：

$$
a^2 + b^2 = c^2
$$

其中 $a$ 和 $b$ 是直角三角形的两条直角边，$c$ 是斜边。

---

> **注意**：如果公式显示不正常，请检查：
> 1. KaTeX 相关依赖是否正确安装
> 2. docusaurus.config.js 中的配置是否正确
> 3. 浏览器控制台是否有错误信息
