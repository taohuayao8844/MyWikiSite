---
title: Git操作完全指南
description: 从入门到进阶，全面掌握Git版本控制的核心操作
tags:
  - 工具链
  - Git
  - 版本控制
---

# Git操作完全指南

> 版本控制是程序员必须掌握的核心技能之一，本文将带你从基础操作到高级技巧，全面掌握Git的使用。

## 一、Git基础概念

在开始动手之前，我们需要先理解几个核心概念：

### 1.1 什么是Git

Git是一个分布式版本控制系统，由Linux之父Linus Torvalds于2005年创建。与传统的集中式版本控制系统（如SVN）不同，Git的每个开发者都拥有完整的代码仓库副本，这使得Git具有以下优势：

- **本地即可提交**：不需要网络连接就能进行版本控制
- **分支操作轻量**：创建和合并分支非常快速
- **安全性高**：每个副本都是完整的备份

### 1.2 核心区域划分

Git有三个主要区域：

```
工作区(Working Directory)  →  暂存区(Stage/Index)  →  版本库(Repository)
       ↓                            ↓                      ↓
   实际编辑的文件              即将提交的文件           已提交的快照
```

- **工作区（Working Directory）**：你正在编辑的文件目录
- **暂存区（Stage）**：通过`git add`命令将修改放入暂存区
- **版本库（Repository）**：通过`git commit`将暂存区内容提交到本地仓库

### 1.3 文件状态

Git中的文件有两种状态：

- **已跟踪（Tracked）**：已被纳入版本控制的文件
- **未跟踪（Untracked）**：Git不知道的新文件

已跟踪的文件又有三种状态：

| 状态 | 说明 |
|------|------|
| Modified | 文件有修改但未放入暂存区 |
| Staged | 已放入暂存区，等待提交 |
| Committed | 已提交到本地仓库 |

## 二、Git安装与配置

### 2.1 安装Git

**Windows用户**：

访问 [Git官网](https://git-scm.com/download/win) 下载安装包，一路Next即可。

**验证安装**：

```bash
git --version
# 输出类似：git version 2.40.0
```

### 2.2 基础配置

安装完成后，需要进行一些基础配置：

```bash
# 设置用户名（必需）
git config --global user.name "你的用户名"

# 设置邮箱（必需）
git config --global user.email "你的邮箱@example.com"

# 设置默认编辑器
git config --global core.editor vim

# 设置默认分支名
git config --global init.defaultBranch main
```

### 2.3 查看配置

```bash
# 查看所有配置
git config --list

# 查看某个配置项
git config user.name
```

## 三、基础操作

### 3.1 创建仓库

**方式一：在当前目录初始化**

```bash
git init
```

这会在当前目录创建一个`.git`子目录，用于存储所有版本信息。

**方式二：克隆远程仓库**

```bash
git clone https://github.com/username/repo.git
```

### 3.2 添加文件到暂存区

```bash
# 添加单个文件
git add filename.txt

# 添加所有修改的文件
git add .

# 添加所有已跟踪文件的修改（不包括新文件）
git add -u

# 交互式添加
git add -i
```

### 3.3 提交到本地仓库

```bash
# 基本提交
git commit -m "提交信息"

# 同时提交已跟踪但未暂存的文件（跳过git add步骤）
git commit -am "提交信息"

# 修改最后一次提交（通常用于修正提交信息）
git commit --amend
```

### 3.4 查看状态和历史

```bash
# 查看工作区状态
git status

# 简洁模式
git status -s
# M file.txt  (Modified, staged)
#  M file.txt (Modified, not staged)
# ?? file.txt (Untracked)

# 查看提交历史
git log

# 简洁单行显示
git log --oneline

# 显示最近3次提交
git log -3

# 图形化显示分支
git log --graph --oneline --all
```

### 3.5 撤销操作

```bash
# 撤销工作区的修改（恢复到最近一次提交的状态）
git checkout -- filename
# 或者（新版本推荐）
git restore filename

# 取消暂存（从暂存区移回工作区）
git reset HEAD filename
# 或者
git restore --staged filename

# 回退到指定版本（保留工作区修改）
git reset --soft HEAD~1

# 回退到指定版本（保留工作区修改，取消暂存）
git reset --mixed HEAD~1

# 回退到指定版本（丢弃所有修改，危险操作）
git reset --hard HEAD~1
```

:::warning 注意
`git reset --hard`会丢弃所有未提交的修改，操作前请三思！
:::

## 四、分支操作

分支是Git最强大的功能之一，它允许你在不影响主线的情况下开发新功能。

### 4.1 查看分支

```bash
# 查看本地分支
git branch

# 查看所有分支（包括远程）
git branch -a

# 查看分支详细信息
git branch -v
```

### 4.2 创建与切换分支

```bash
# 创建新分支
git branch feature-branch

# 切换分支
git checkout feature-branch

# 创建并切换（新版本推荐）
git switch feature-branch

# 创建并切换（一步到位）
git checkout -b feature-branch
# 或者
git switch -c feature-branch
```

### 4.3 合并分支

```bash
# 将指定分支合并到当前分支
git merge feature-branch

# 取消合并（当合并出现冲突时）
git merge --abort
```

### 4.4 删除分支

```bash
# 删除已合并的分支
git branch -d feature-branch

# 强制删除分支（即使未合并）
git branch -D feature-branch
```

### 4.5 常见合并问题

**快进合并（Fast Forward）**：当目标分支没有新的提交时，Git会直接移动指针。

**三方合并（Three-way merge）**：当两个分支都有新提交时，Git会创建一个新的合并提交。

**冲突处理**：当两个分支修改了同一文件的同一部分时，需要手动解决冲突：

```bash
# 查看冲突文件
git status

# 解决冲突后
git add filename
git commit -m "resolve conflict"
```

## 五、远程仓库操作

### 5.1 添加远程仓库

```bash
# 添加远程仓库
git remote add origin https://github.com/username/repo.git

# 查看远程仓库
git remote -v

# 重命名远程仓库
git remote rename origin upstream
```

### 5.2 推送与拉取

```bash
# 推送到远程仓库（首次推送需要设置上游分支）
git push -u origin main

# 普通推送
git push

# 强制推送（谨慎使用）
git push --force

# 拉取远程更新
git pull

# 只拉取不合并
git fetch
```

### 5.3 克隆远程仓库

```bash
# 克隆最新版本
git clone https://github.com/username/repo.git

# 克隆指定分支
git clone -b develop https://github.com/username/repo.git

# 克隆到指定目录
git clone https://github.com/username/repo.git my-folder
```

### 5.4 同步远程分支

```bash
# 查看远程分支
git branch -r

# 切换到远程分支（会自动创建本地分支）
git checkout --track origin/feature

# 删除远程分支
git push origin --delete feature-branch
```

## 六、进阶操作

### 6.1 贮藏工作（Stash）

当你需要临时切换分支，但又不想提交当前的修改时，可以使用stash：

```bash
# 贮藏当前修改
git stash

# 给stash起个名字
git stash save "未完成的功能开发"

# 查看stash列表
git stash list
# stash@{0}: On main: 未完成的功能开发

# 恢复最近的stash
git stash apply

# 恢复指定的stash
git stash apply stash@{0}

# 恢复并删除stash
git stash pop

# 删除stash
git stash drop stash@{0}

# 清空所有stash
git stash clear
```

### 6.2 标签（Tag）

标签用于标记特定的提交，通常用于版本发布：

```bash
# 创建轻量标签
git tag v1.0.0

# 创建附注标签（推荐，包含更多信息）
git tag -a v1.0.0 -m "版本1.0.0发布"

# 查看所有标签
git tag

# 查看标签详细信息
git show v1.0.0

# 推送标签到远程
git push origin v1.0.0

# 推送所有标签
git push origin --tags

# 删除本地标签
git tag -d v1.0.0

# 删除远程标签
git push origin --delete v1.0.0
```

### 6.3 变基（Rebase）

变基是另一种合并分支的方式，它会改变提交历史：

```bash
# 将当前分支变基到目标分支
git rebase main

# 中断变基
git rebase --abort

# 继续变基（解决冲突后）
git rebase --continue

# 交互式变基（修改提交历史）
git rebase -i HEAD~3
```

:::warning 注意
不要对已推送到远程仓库的提交进行变基！
:::

### 6.4 查找问题

```bash
# 查看是谁修改了某一行
git blame filename

# 查看两个版本的差异
git diff commit1 commit2

# 查看工作区与暂存区的差异
git diff

# 查看暂存区与最新提交的差异
git diff --cached
```

## 七、Git工作流

### 7.1 Git Flow

经典的Git Flow工作流包含以下分支：

- **main/master**：主分支，始终保持可发布状态
- **develop**：开发分支，汇总下一个发布的功能
- **feature/**：功能分支，从develop创建
- **release/**：发布分支，从develop创建
- **hotfix/**：热修复分支，从main创建

### 7.2 常用的简洁工作流

对于小型团队或个人项目：

```bash
# 1. 从main创建功能分支
git checkout -b feature/new-feature

# 2. 开发并提交
git add .
git commit -m "feat: 完成新功能"

# 3. 切换回main并更新
git checkout main
git pull

# 4. 合并功能分支
git merge feature/new-feature

# 5. 推送
git push origin main

# 6. 删除功能分支
git branch -d feature/new-feature
```

## 八、实用技巧

### 8.1 配置别名

为常用命令设置简短的别名：

```bash
# 设置别名
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status

# 设置更复杂的别名
git config --global alias.lg "log --graph --oneline --all"
```

### 8.2 忽略文件

创建`.gitignore`文件来排除不需要纳入版本控制的文件：

```
# 忽略所有.log文件
*.log

# 忽略node_modules目录
node_modules/

# 忽略特定文件
.env

# 忽略所有缓存目录
.cache/
```

### 8.3 清理仓库

```bash
# 删除所有未跟踪文件（清理工作区）
git clean -f

# 删除未跟踪文件和目录
git clean -fd

# 查看将要删除的内容（预览）
git clean -n
```

### 8.4 找回丢失的提交

```bash
# 查看所有操作记录
git reflog

# 恢复到指定操作
git reset --hard HEAD@{5}
```

### 8.5 暂存部分文件

```bash
# 交互式暂存
git add -p
# 输入 y 暂存该部分
# 输入 n 跳过该部分
# 输入 s 分割成更小的块
```

## 九、常见问题处理

### 9.1 SSH Key配置

```bash
# 1. 生成SSH Key
ssh-keygen -t ed25519 -C "your_email@example.com"

# 2. 查看公钥
cat ~/.ssh/id_ed25519.pub

# 3. 复制公钥到GitHub/Gitee的SSH Keys设置

# 4. 测试连接
ssh -T git@github.com
```

### 9.2 修改远程仓库地址

```bash
# 方法一：使用set-url
git remote set-url origin new-git-url

# 方法二：删除后重新添加
git remote remove origin
git remote add origin new-git-url
```

### 9.3 解决中文文件名乱码

```bash
git config --global core.quotepath false
```

### 9.4 撤销已推送的提交

```bash
# 创建新的提交来撤销之前的更改
git revert HEAD

# 推送新提交
git push
```

### 9.5 将单个文件恢复到指定版本

```bash
# 查看文件历史
git log filename

# 恢复到指定版本
git checkout commit-hash -- filename
```

## 十、常用命令速查表

| 场景 | 命令 |
|------|------|
| 初始化仓库 | `git init` |
| 克隆仓库 | `git clone url` |
| 添加文件 | `git add .` |
| 提交 | `git commit -m "message"` |
| 推送 | `git push` |
| 拉取 | `git pull` |
| 查看状态 | `git status` |
| 查看历史 | `git log --oneline` |
| 创建分支 | `git branch name` |
| 切换分支 | `git checkout name` |
| 合并分支 | `git merge name` |
| 贮藏修改 | `git stash` |
| 创建标签 | `git tag v1.0` |

## 结语

Git是现代软件开发不可或缺的工具，掌握好这些基础操作和常用技巧，能够让你的开发效率大大提升。建议大家多多实践，在实际项目中不断加深对Git的理解。

如果本文对你有帮助，欢迎收藏转发！

---

**相关推荐**：

- [Markdown学习笔记](./markdown学习.md)
- [VSCode插件推荐](../我在用什么系列/Vscode插件推荐.md)
