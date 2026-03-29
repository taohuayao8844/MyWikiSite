import React from 'react'
import Layout from '@theme/Layout'
import siteStatistics from '../data/site-statistics.json'
import styles from './index.module.css'

const socialPlatformList = [
  {
    label: 'GitHub',
    href: 'https://github.com/taohuayao8844',
    icon: '📱',
  },
  {
    label: 'Bilibili',
    href: 'https://space.bilibili.com/396104992',
    icon: '📺',
  },
  {
    label: '微博',
    href: 'https://weibo.com/u/5920416195',
    icon: '📡',
  },
]

const profileHighlightList = [
  {
    label: '身份',
    value: '已摆烂的折腾爱好者',
  },
  {
    label: '状态',
    value: '理想主义在线',
  },
]

const siteStatisticsList = [
  {
    label: '文章总数',
    value: `${siteStatistics.articleCount}`,
  },
  {
    label: '运行时长',
    value: siteStatistics.runtime,
  },
  {
    label: '总字数',
    value: siteStatistics.totalCount,
  },
  {
    label: '最近更新',
    value: siteStatistics.lastUpdate,
  },
]

export default function Home() {
  return (
    <Layout title='ZeroPointNine' description='个人主页'>
      <main className={styles.homeContainer}>
        <div className={styles.backgroundBlur}></div>
        <div className={styles.backgroundGlow}></div>

        <section className={styles.heroShell}>
          <div className={styles.heroPanel}>
            <div className={styles.identityBlock}>
              <div className={styles.identityProfile}>
                <div className={styles.avatarWrapper}>
                  <div className={styles.avatarHalo}></div>
                  <img
                    src='/person/touxiang.jpg'
                    alt='头像'
                    className={styles.avatar}
                  />
                </div>

                <div className={styles.identityText}>
                  <h1 className={styles.name}>ZERO_POINT_NINE</h1>
                  <p className={styles.tagline}>叹隙中驹，石中火，梦中身</p>
                </div>
              </div>

              <div className={styles.welcomePanel}>
                <span className={styles.welcomeLabel}>WELCOME</span>
                <h2 className={styles.welcomeTitle}>欢迎来到 0.9 的个人博客</h2>
                <p className={styles.welcomeSubtitle}>
                  记录学习、折腾、生活与一些仍然发光的想法。
                </p>
              </div>
            </div>

            <div className={styles.contentGrid}>
              <article className={styles.introductionCard}>
                <div className={styles.cardLabel}>关于我</div>
                <div className={styles.description}>
                  <p>你好，我是 0.9，一个三分钟热度的大三学生 👋</p>
                  <p>爱好整点摄影和羽毛球玩玩，是一个不卷绩点的理想主义者。</p>
                  <p>浙江某所“冲击双一流”高校在读，通信工程专业，殊途同归走向计算机。</p>
                </div>

                <div className={styles.aboutImageSection}>
                  <img
                    src='/person/back2.jpg'
                    alt='关于我的展示图片'
                    className={styles.aboutImage}
                  />
                </div>

                <div className={styles.socialLinks}>
                  {socialPlatformList.map((socialPlatform) => (
                    <a
                      key={socialPlatform.label}
                      href={socialPlatform.href}
                      target='_blank'
                      rel='noopener noreferrer'
                      className={styles.socialLink}
                    >
                      <span className={styles.socialIcon}>
                        {socialPlatform.icon}
                      </span>
                      <span>{socialPlatform.label}</span>
                    </a>
                  ))}
                </div>
              </article>

              <aside className={styles.infoColumn}>
                <div className={styles.profileCard}>
                  <div className={styles.cardLabel}>个人信息</div>
                  <div className={styles.profileList}>
                    {profileHighlightList.map((profileHighlight) => (
                      <div
                        key={profileHighlight.label}
                        className={styles.profileItem}
                      >
                        <span className={styles.profileItemLabel}>
                          {profileHighlight.label}
                        </span>
                        <strong className={styles.profileItemValue}>
                          {profileHighlight.value}
                        </strong>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.statsCard}>
                  <div className={styles.cardLabel}>站点统计</div>
                  <div className={styles.statsList}>
                    {siteStatisticsList.map((siteStatistic) => (
                      <div
                        key={siteStatistic.label}
                        className={styles.statsItem}
                      >
                        <span className={styles.statsItemLabel}>
                          {siteStatistic.label}
                        </span>
                        <strong className={styles.statsItemValue}>
                          {siteStatistic.value}
                        </strong>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>

            </div>
          </div>
        </section>
      </main>
    </Layout>
  )
}
