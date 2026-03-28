import React, { useState } from 'react'
import Layout from '@theme/Layout'
import styles from './friends.module.css'

// 友链数据
const friendsData = [
  {
    category: '技术博客',
    links: [
      {
        name: '阮一峰的网络日志',
        url: 'https://www.ruanyifeng.com/blog/',
        description: '知名技术博客，涵盖编程、网络技术、科技趋势等内容'
      },
      {
        name: 'Hexo',
        url: 'https://hexo.io/',
        description: '快速、简洁且高效的博客框架'
      },
      {
        name: 'Vue.js',
        url: 'https://vuejs.org/',
        description: '渐进式 JavaScript 框架'
      },
      {
        name: 'React',
        url: 'https://react.dev/',
        description: '用于构建用户界面的 JavaScript 库'
      },
    ]
  },
  {
    category: '生活分享',
    links: [
      {
        name: '知乎',
        url: 'https://www.zhihu.com/',
        description: '中文互联网高质量的问答社区'
      },
      {
        name: '豆瓣',
        url: 'https://www.douban.com/',
        description: '发现更多好书、电影、音乐'
      },
      {
        name: '小红书',
        url: 'https://www.xiaohongshu.com/',
        description: '生活方式分享平台'
      },
    ]
  },
  {
    category: '工具资源',
    links: [
      {
        name: 'GitHub',
        url: 'https://github.com/',
        description: '全球最大的代码托管平台'
      },
      {
        name: 'Stack Overflow',
        url: 'https://stackoverflow.com/',
        description: '程序员问答社区'
      },
      {
        name: 'MDN Web Docs',
        url: 'https://developer.mozilla.org/',
        description: 'Web 开发者的权威文档'
      },
      {
        name: 'Canva',
        url: 'https://www.canva.com/',
        description: '在线设计工具，简单易用'
      },
    ]
  },
  {
    category: '其他',
    links: [
      {
        name: 'Bilibili',
        url: 'https://www.bilibili.com/',
        description: '国内知名的视频分享网站'
      },
      {
        name: '网易云音乐',
        url: 'https://music.163.com/',
        description: '发现好音乐，享受音乐生活'
      },
    ]
  }
]

export default function Friends() {
  const [activeCategory, setActiveCategory] = useState('全部')

  // 获取所有分类
  const categories = ['全部', ...friendsData.map(item => item.category)]

  // 根据分类筛选友链
  const filteredLinks = activeCategory === '全部'
    ? friendsData.flatMap(item => item.links)
    : friendsData.find(item => item.category === activeCategory)?.links || []

  return (
    <Layout title='友链' description='我的友链列表'>
      <main className={styles.friendsContainer}>
        <div className={styles.header}>
          <h1 className={styles.title}>友链</h1>
          <p className={styles.subtitle}>发现更多精彩内容</p>
        </div>

        {/* 分类标签 */}
        <div className={styles.categoryTabs}>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.tab} ${activeCategory === category ? styles.activeTab : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 友链卡片网格 */}
        <div className={styles.linksGrid}>
          {filteredLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target='_blank'
              rel='noopener noreferrer'
              className={styles.linkCard}
            >
              <div className={styles.cardContent}>
                <h3 className={styles.linkName}>{link.name}</h3>
                <p className={styles.linkDescription}>{link.description}</p>
              </div>
              <div className={styles.cardArrow}>→</div>
            </a>
          ))}
        </div>

        {filteredLinks.length === 0 && (
          <div className={styles.emptyState}>
            <p>该分类下暂无友链</p>
          </div>
        )}
      </main>
    </Layout>
  )
}
