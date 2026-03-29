import React, { useMemo, useState } from 'react'
import Layout from '@theme/Layout'
import useBaseUrl from '@docusaurus/useBaseUrl'
import styles from './files.module.css'

const fileLibraryData = [
  {
    category: '学习资料',
    sections: [
      {
        folderName: '校园资料',
        folderDescription: '收录学校办事说明、使用指南和校园服务相关资料。',
        items: [
          {
            name: '浙江理工大学下沙校区图书馆打印介绍与使用流程',
            filePath: '/files/study/浙江理工大学下沙校区图书馆打印介绍与使用流程.pdf',
            fileType: 'pdf',
            description: '浙江理工大学下沙校区图书馆打印服务介绍与使用流程说明，可直接在线打开查看。',
            isPinned: true,
            isRecommended: true
          }
        ]
      }
    ]
  },
  {
    category: '项目文档',
    sections: [
      {
        folderName: '硬件项目',
        folderDescription: '收录硬件开发板原理图和 STM32 相关参考手册。',
        items: [
          {
            name: 'F407魔女开发板原理图',
            filePath: '/files/hardware/F407魔女开发板原理图.pdf',
            fileType: 'pdf',
            description: 'F407 魔女开发板原理图资料，可直接在线打开查看。',
            isPinned: true,
            isRecommended: true
          },
          {
            name: 'F407实验室开发板原理图',
            filePath: '/files/hardware/F407实验室开发板原理图.pdf',
            fileType: 'pdf',
            description: 'F407 实验室开发板原理图资料，适合硬件排查与接线参考。',
            isPinned: true,
            isRecommended: false
          },
          {
            name: 'STM32F4xx 参考手册',
            filePath: '/files/hardware/STM32F4xx_参考手册.pdf',
            fileType: 'pdf',
            description: 'STM32F4xx 系列参考手册，适合查阅寄存器、外设和底层说明。',
            isPinned: false,
            isRecommended: true
          }
        ]
      }
    ]
  }
]

const fileTypeConfig = {
  pdf: {
    icon: '📄',
    label: 'PDF',
    openHint: '在线打开'
  },
  doc: {
    icon: '📝',
    label: 'Word',
    openHint: '打开或下载'
  },
  docx: {
    icon: '📝',
    label: 'Word',
    openHint: '打开或下载'
  }
}

function sortFileItems(fileItemList) {
  return [...fileItemList].sort((leftFileItem, rightFileItem) => {
    if (leftFileItem.isPinned !== rightFileItem.isPinned) {
      return Number(rightFileItem.isPinned) - Number(leftFileItem.isPinned)
    }

    if (leftFileItem.isRecommended !== rightFileItem.isRecommended) {
      return Number(rightFileItem.isRecommended) - Number(leftFileItem.isRecommended)
    }

    return leftFileItem.name.localeCompare(rightFileItem.name, 'zh-CN')
  })
}

export default function FilesPage() {
  const [activeCategory, setActiveCategory] = useState('全部')
  const categories = ['全部', ...fileLibraryData.map((item) => item.category)]

  const filteredSections = useMemo(() => {
    const selectedData = activeCategory === '全部'
      ? fileLibraryData
      : fileLibraryData.filter((item) => item.category === activeCategory)

    return selectedData.flatMap((item) =>
      item.sections.map((section) => ({
        ...section,
        category: item.category,
        items: sortFileItems(section.items)
      }))
    )
  }, [activeCategory])

  return (
    <Layout title='文件板块' description='集中展示可在线打开或下载的 PDF、Word 等资料文件'>
      <main className={styles.filesContainer}>
        <header className={styles.header}>
          <div className={styles.headerWithAvatar}>
            <img
              src={useBaseUrl('/person/touxiang.jpg')}
              alt='头像'
              className={styles.avatar}
            />
            <h1 className={styles.title}>文件板块</h1>
          </div>
          <p className={styles.subtitle}>
            使用静态资源目录管理文件，支持多文件夹归类，PDF 可直接打开，Word 文档可打开或下载。
          </p>
        </header>

        

        <div className={styles.categoryTabs}>
          {categories.map((category) => (
            <button
              key={category}
              type='button'
              className={`${styles.tab} ${activeCategory === category ? styles.activeTab : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <section className={styles.sectionList}>
          {filteredSections.length > 0 ? (
            filteredSections.map((section) => (
              <article key={`${section.category}-${section.folderName}`} className={styles.folderSection}>
                <div className={styles.folderHeader}>
                  <div>
                    <div className={styles.folderMetaRow}>
                      <span className={styles.folderCategory}>{section.category}</span>
                      <span className={styles.folderPath}>/{section.folderName}</span>
                    </div>
                    <h2 className={styles.folderTitle}>📁 {section.folderName}</h2>
                    <p className={styles.folderDescription}>{section.folderDescription}</p>
                  </div>
                </div>

                <div className={styles.fileGrid}>
                  {section.items.map((fileItem) => {
                    const currentFileTypeConfig = fileTypeConfig[fileItem.fileType] || {
                      icon: '📦',
                      label: '文件',
                      openHint: '打开'
                    }

                    const cardClassName = [
                      styles.fileCard,
                      fileItem.isPinned ? styles.pinnedCard : '',
                      fileItem.isRecommended ? styles.recommendedCard : ''
                    ]
                      .filter(Boolean)
                      .join(' ')

                    return (
                      <a
                        key={fileItem.filePath}
                        href={useBaseUrl(fileItem.filePath)}
                        target='_blank'
                        rel='noopener noreferrer'
                        className={cardClassName}
                      >
                        <div className={styles.fileIcon}>{currentFileTypeConfig.icon}</div>
                        <div className={styles.fileContent}>
                          <div className={styles.fileNameRow}>
                            <h3 className={styles.fileName}>{fileItem.name}</h3>
                            {fileItem.isRecommended && (
                              <span className={styles.recommendedBadge} aria-label='推荐文件' title='推荐文件'>
                                推荐
                              </span>
                            )}
                          </div>
                          <p className={styles.fileDescription}>{fileItem.description}</p>
                          <div className={styles.fileMetaRow}>
                            <span className={styles.fileTypeTag}>{currentFileTypeConfig.label}</span>
                            <span className={styles.fileHint}>{currentFileTypeConfig.openHint}</span>
                          </div>
                        </div>
                        <div className={styles.cardArrow}>→</div>
                      </a>
                    )
                  })}
                </div>
              </article>
            ))
          ) : (
            <div className={styles.emptyState}>当前分类下暂无文件</div>
          )}
        </section>
      </main>
    </Layout>
  )
}
