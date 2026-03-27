import React from 'react'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'
import styles from './index.module.css'

function MyHero() {
  return (
    <section className={styles.myHeroContainer}>
      <div className={styles.leftContainer}>
        <h1 className={styles.leftContainer_h1}>
          Hellow，我是 0.9，
          <br />
          一个三分钟热度的大三学生 👋
        </h1>
        <p className={styles.leftContainer_p}>
          叹隙中驹，石中火，梦中身。
          <br />
          欢迎来到我的博客。
          <br />
          爱好整点摄影和羽毛球玩玩，是一个不卷绩点的理想主义者。
          <br />
          浙江某所“冲击双一流”高校在读，通信工程专业，殊途同归走向计算机。
        </p>
        <div className={styles.buttonContainer}>
          <button className={styles.button}>
            <Link className={styles.hero_a} to='/'>
              进入首页
            </Link>
          </button>
          <span className={styles.buttonLeftText}>
            ZERO_POINT_NINE
            <br />
            记录学习、生活与思考。
          </span>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <Layout title='Home' description='ZeroPointNine 个人网站首页'>
      <main>
        <MyHero />
      </main>
    </Layout>
  )
}
