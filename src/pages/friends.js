import React, { useMemo, useState } from 'react'
import Layout from '@theme/Layout'
import styles from './friends.module.css'
import { FaStar, FaArrowRight } from 'react-icons/fa'

// 友链数据
const friendsData = [
  {
    category: '强推友链博客',
    links: [
      {
        name: 'Wiki Power博客',
        url: 'https://wiki-power.com/',
        description: '一个RMer的网站,里面有很完整的电子类的知识和发展路径',
        isPinned: true,
        isStarred: true,
        isFeatured: true
      },
      {
        name: '碳烤鱼的博客',
        url: 'https://www.indratang.top/s1/zero2hero',
        description: '这个是一个浙大的工科学长,给了我很多的启发,如果大一就看了这个博客,可能会少走很多弯路,强推！',
        isPinned: true,
        isStarred: true,
        isFeatured: true
      },
      {
        name: 'CS自学指南',
        url: 'https://csdiy.wiki/#cs61a',
        description: '一份完整的CS自学指南',
        isPinned: true,
        isStarred: true,
        isFeatured: true
      }
    ]
  },
  {
    category: '好友博客',
    links: [
      {
        name: 'SysNow的博客',
        url: 'https://sysnow.xyz/',
        description: '理工的PWM_King的博客',
        isPinned: false,
        isStarred: true,
        isFeatured: false
      }
    ]
  }
]

function sortLinksByPriority(linkList) {
  return [...linkList].sort((leftLink, rightLink) => {
    if (leftLink.isPinned !== rightLink.isPinned) {
      return Number(rightLink.isPinned) - Number(leftLink.isPinned)
    }

    if (leftLink.isStarred !== rightLink.isStarred) {
      return Number(rightLink.isStarred) - Number(leftLink.isStarred)
    }

    if (leftLink.isFeatured !== rightLink.isFeatured) {
      return Number(rightLink.isFeatured) - Number(leftLink.isFeatured)
    }

    return 0
  })
}

export default function Friends() {
  const [activeCategory, setActiveCategory] = useState('全部')

  // 获取所有分类
  const categories = ['全部', ...friendsData.map((item) => item.category)]

  // 根据分类筛选友链，并统一按优先级排序
  const filteredLinks = useMemo(() => {
    const currentLinks = activeCategory === '全部'
      ? friendsData.flatMap((item) => item.links)
      : friendsData.find((item) => item.category === activeCategory)?.links || []

    return sortLinksByPriority(currentLinks)
  }, [activeCategory])

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
          {filteredLinks.map((link) => {
            const cardClassName = [
              styles.linkCard,
              link.isPinned ? styles.pinnedCard : '',
              link.isFeatured ? styles.featuredCard : '',
              link.isStarred ? styles.starredCard : ''
            ]
              .filter(Boolean)
              .join(' ')

            return (
              <a
                key={link.url}
                href={link.url}
                target='_blank'
                rel='noopener noreferrer'
                className={cardClassName}
              >
                <div className={styles.cardContent}>
                  <div className={styles.linkNameRow}>
                    <h3 className={styles.linkName}>{link.name}</h3>
                    {link.isStarred && (
                      <span className={styles.starBadge} aria-label='星标推荐' title='星标推荐'>
                        <FaStar />
                      </span>
                    )}
                  </div>
                  <p className={styles.linkDescription}>{link.description}</p>
                </div>
                <div className={styles.cardArrow}><FaArrowRight /></div>
              </a>
            )
          })}
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
