import React from 'react'
import clsx from 'clsx'
import styles from './HomepageFeatures.module.css'

const featureList = [
  {
    title: '个人博客',
    description: '记录学习、生活与思考，保留更贴近当前站点定位的内容表达。',
  },
  {
    title: 'Wiki 知识整理',
    description: '将文档内容作为主要信息入口，便于持续沉淀和检索。',
  },
  {
    title: '轻量展示',
    description: '移除模板默认插画资源，减少无关依赖，避免残留静态资源引用。',
  },
]

function Feature({ title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className='text--center padding-horiz--md'>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className='container'>
        <div className='row'>
          {featureList.map((featureItem) => (
            <Feature
              key={featureItem.title}
              title={featureItem.title}
              description={featureItem.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
