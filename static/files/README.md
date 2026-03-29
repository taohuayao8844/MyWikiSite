# 文件板块目录说明

这个目录用于存放网站“文件板块”需要展示的静态文件。

## 推荐目录结构

```text
static/files/
├─ study/
│  ├─ course/
│  │  ├─ example.pdf
│  │  └─ example.docx
│  └─ report/
│     └─ report-template.docx
└─ project/
   └─ hardware/
      └─ project-introduction.pdf
```

## 使用方式

### 1. 把文件放进这个目录
例如：

- `static/files/study/course/example.pdf`
- `static/files/study/course/example.docx`
- `static/files/project/hardware/project-introduction.pdf`

构建后，它们会被映射成站点静态资源：

- `/files/study/course/example.pdf`
- `/files/study/course/example.docx`
- `/files/project/hardware/project-introduction.pdf`

### 2. 在页面数据中登记文件
对应文件板块页面：

- `src/pages/files.js`

在 `fileLibraryData` 中增加你的文件配置即可。

示例：

```js
{
  category: '学习资料',
  sections: [
    {
      folderName: '课程讲义',
      folderDescription: '这里放课程相关资料',
      items: [
        {
          name: '模电复习资料',
          filePath: '/files/study/course/analog-review.pdf',
          fileType: 'pdf',
          description: '模电课程复习资料汇总。',
          isPinned: true,
          isRecommended: true
        }
      ]
    }
  ]
}
```

## 支持情况说明

### PDF
- 浏览器通常可以直接在线打开
- 适合做资料阅读、手册查看、讲义浏览

### Word
- `.doc` / `.docx` 在纯静态站点中通常不能稳定解析成网页正文
- 当前实现方式为：
  - 新标签页打开
  - 若浏览器不支持，则自动下载或调用本地关联软件

## 如果你想实现“自动扫描服务器文件夹”
当前网站是静态站点，默认不具备后端文件扫描能力。

如果后续想做到以下效果：

- 自动读取服务器指定目录
- 自动显示新增文件
- 自动识别多层文件夹
- 在线解析 Word 为网页内容

则需要增加以下其中一种方案：

1. 新增后端服务（Node.js / Java / Python）
2. 构建前扫描脚本，自动生成 `files.js` 所需的数据文件
3. 接入第三方在线预览服务（如 OnlyOffice、Microsoft Office Online 等）

当前版本已经支持：
- 多分类
- 多文件夹分组
- PDF 直接打开
- Word 打开或下载
- 通过静态目录长期托管文件
