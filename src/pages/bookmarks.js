import React, { useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './bookmarks.module.css';

// 书签数据 - 可以根据需要修改
const bookmarksData = [
  // 各种开源网站
  {
    name: '图拉丁CLUB',
    description: 'DIY垃圾佬的网站',
    url: 'https://tualatin.club/',
    category: '各种开源网站',
    icon: '💻',
    isPinned: false,
    isStarred: false
  },
  {
    name: "Power's Wiki",
    description: '个人技术知识库',
    url: 'https://wiki-power.com/',
    category: '各种开源网站',
    icon: '📖',
    isPinned: true,
    isStarred: true
  },
  {
    name: '立创开源硬件平台',
    description: '开源硬件项目分享平台',
    url: 'https://oshwhub.com/',
    category: '各种开源网站',
    icon: '🔧',
    isPinned: false,
    isStarred: false
  },
  {
    name: 'EIDE社区',
    description: 'EIDE开发环境社区',
    url: 'https://discuss.em-ide.com/?q=stc32',
    category: '各种开源网站',
    icon: '⚙️',
    isPinned: false,
    isStarred: false
  },
  {
    name: '电子工程世界',
    description: '电子工程技术社区',
    url: 'https://bbs.eeworld.com.cn/forum-72-1.html',
    category: '各种开源网站',
    icon: '🔬',
    isPinned: false,
    isStarred: false
  },
  {
    name: '51黑电子',
    description: '单片机学习交流论坛',
    url: 'http://www.51hei.com/bbs/',
    category: '各种开源网站',
    icon: '🔌',
    isPinned: false,
    isStarred: false
  },
  {
    name: 'PCB联盟网',
    description: 'PCB设计与制造资源',
    url: 'https://www.pcbbar.com/',
    category: '各种开源网站',
    icon: '📋',
    isPinned: false,
    isStarred: false
  },
  {
    name: '电子发烧友',
    description: '电子工程师学习交流社区',
    url: 'https://www.elecfans.com/',
    category: '各种开源网站',
    icon: '⚡',
    isPinned: true,
    isStarred: true
  },
  {
    name: '恩山无线论坛',
    description: '无线网络技术论坛',
    url: 'https://www.right.com.cn/forum/',
    category: '各种开源网站',
    icon: '📶',
    isPinned: false,
    isStarred: false
  },
  {
    name: '嘉立创领券专区',
    description: 'PCB打样优惠领取',
    url: 'https://www.jlc.com/newOrder/#/collectCoupons',
    category: '各种开源网站',
    icon: '🎟️',
    isPinned: false,
    isStarred: false
  },
  {
    name: 'Gitee',
    description: '国内代码托管平台',
    url: 'https://gitee.com/',
    category: '各种开源网站',
    icon: '🐯',
    isPinned: false,
    isStarred: false
  },
  {
    name: '吾爱破解',
    description: '软件安全与逆向分析论坛',
    url: 'https://www.52pojie.cn/index.php',
    category: '各种开源网站',
    icon: '🔓',
    isPinned: false,
    isStarred: false
  },
  {
    name: 'Sipeed资料站',
    description: 'Sipeed官方技术文档',
    url: 'https://wiki.sipeed.com/',
    category: '各种开源网站',
    icon: '📚',
    isPinned: false,
    isStarred: false
  },
  {
    name: '浏览器脚本下载',
    description: 'GreasyFork用户脚本',
    url: 'https://greasyfork.org/zh-CN',
    category: '各种开源网站',
    icon: '📜',
    isPinned: false,
    isStarred: false
  },
  {
    name: '半岛小芯',
    description: '芯片查询与采购平台',
    url: 'https://www.semiee.com/search?searchModel=bl3085',
    category: '各种开源网站',
    icon: '💾',
    isPinned: false,
    isStarred: false
  },
  {
    name: 'PT种子库',
    description: 'PT资源种子分享',
    url: 'https://cc.mypt.cc/ok.php?type=confirm',
    category: '各种开源网站',
    icon: '🌱',
    isPinned: false,
    isStarred: false
  },
  {
    name: '少数派',
    description: '高效工具与数字生活',
    url: 'https://sspai.com/',
    category: '各种开源网站',
    icon: '💡',
    isPinned: false,
    isStarred: true
  },
  {
    name: 'LINUX DO',
    description: 'Linux技术社区',
    url: 'https://connect.linux.do/',
    category: '各种开源网站',
    icon: '🐧',
    isPinned: false,
    isStarred: true
  },
  {
    name: 'ST中文论坛',
    description: '意法半导体中文社区',
    url: 'https://shequ.stmicroelectronics.cn/portal.php',
    category: '各种开源网站',
    icon: '🏭',
    isPinned: false,
    isStarred: false
  },
  {
    name: 'CSDN文章解锁',
    description: 'CSDN文章免登录查看',
    url: 'http://101.42.252.35:5173/',
    category: '各种开源网站',
    icon: '🔑',
    isPinned: false,
    isStarred: false
  },
  {
    name: 'S.H.I.T Journal',
    description: '学术期刊平台',
    url: 'https://shitjournal.org/dashboard',
    category: '各种开源网站',
    icon: '📔',
    isPinned: false,
    isStarred: false
  },
  
  // 大学相关
  {
    name: '浙江理工大学',
    description: '浙江理工大学官方网站',
    url: 'https://www.zstu.edu.cn/',
    category: '大学相关',
    icon: '🏛️',
    isPinned: true,
    isStarred: false
  },
  {
    name: '个人中心',
    description: '浙江理工大学学生个人中心',
    url: 'https://zstuedu.woczx.com/#/app/student/myproject',
    category: '大学相关',
    icon: '👤',
    isPinned: true,
    isStarred: false
  },
  {
    name: '图书馆',
    description: '浙江理工大学图书馆',
    url: 'https://lib.zstu.edu.cn/',
    category: '大学相关',
    icon: '📚',
    isPinned: false,
    isStarred: false
  },
  {
    name: '图书馆智能资源网关',
    description: '浙江理工大学图书馆资源导航',
    url: 'https://elib.zstu.edu.cn/next/resource/databases/navigation',
    category: '大学相关',
    icon: '🔐',
    isPinned: false,
    isStarred: false
  },
  {
    name: '教务处公告',
    description: '浙江理工大学教务处学生公告',
    url: 'https://jwc.zstu.edu.cn/list.jsp?urltype=tree.TreeTempUrl&wbtreeid=1192',
    category: '大学相关',
    icon: '📢',
    isPinned: false,
    isStarred: false
  },
  {
    name: '邮件系统',
    description: '浙江理工大学邮件系统',
    url: 'http://webmail.zstu.edu.cn/',
    category: '大学相关',
    icon: '📧',
    isPinned: false,
    isStarred: false
  },
  {
    name: '数字学工入口',
    description: '浙江理工大学数字学工系统',
    url: 'https://xgxt.zstu.edu.cn/',
    category: '大学相关',
    icon: '🎓',
    isPinned: false,
    isStarred: true
  },
  {
    name: '信息学院官网',
    description: '信息科学与工程学院官方网站',
    url: 'https://sise.zstu.edu.cn/content.jsp?urltype=news.NewsContentUrl&wbtreeid=1141&wbnewsid=6299',
    category: '大学相关',
    icon: '💻',
    isPinned: false,
    isStarred: false
  },
  {
    name: '统一身份认证',
    description: '浙江理工大学统一身份认证平台',
    url: 'https://sso.zstu.edu.cn/login?service=https:%2F%2Fjwglxt.zstu.edu.cn%2Fsso%2Fjasiglogin',
    category: '大学相关',
    icon: '🔑',
    isPinned: true,
    isStarred: true
  },
  {
    name: '工程电磁场纠正',
    description: '课程资源纠正文档',
    url: 'http://wiki.zstu.tech/index.php?title=ElectromagneticsErrata',
    category: '大学相关',
    icon: '📝',
    isPinned: false,
    isStarred: false
  },
  {
    name: '采购中心公示',
    description: '浙江理工大学采购中心校外公示',
    url: 'https://cgzx.zstu.edu.cn/gggs/jggs/xwgs.htm',
    category: '大学相关',
    icon: '📋',
    isPinned: false,
    isStarred: false
  },
  
  // 学术
  {
    name: '谷歌学术',
    description: 'Google 的学术搜索平台',
    url: 'http://www.xueshuwang.top/',
    category: '学术',
    icon: '🎓',
    isPinned: true,
    isStarred: true
  },
  {
    name: '谷粉学术',
    description: '谷歌学术镜像站',
    url: 'https://gfsoso.99lb.net/',
    category: '学术',
    icon: '🔍',
    isPinned: false,
    isStarred: true
  },
  {
    name: '中国知网',
    description: '中国学术期刊全文数据库',
    url: 'https://www.cnki.net/old/',
    category: '学术',
    icon: '📚',
    isPinned: true,
    isStarred: false
  },
  {
    name: 'SciHub',
    description: '学术文献下载工具',
    url: 'https://www.scihub.net.cn/sci-hub/',
    category: '学术',
    icon: '📖',
    isPinned: false,
    isStarred: true
  },
  {
    name: '巨人学术文献',
    description: '学术文献检索平台',
    url: 'https://xs.typicalgame.com/',
    category: '学术',
    icon: '📄',
    isPinned: false,
    isStarred: false
  },
  {
    name: 'DeepL 翻译',
    description: '高质量学术翻译工具',
    url: 'https://www.deepl.com/en/translator',
    category: '学术',
    icon: '🌐',
    isPinned: false,
    isStarred: true
  },
  
  // AI 工具
  {
    name: '豆包',
    description: '字节跳动的智能对话助手',
    url: 'https://www.doubao.com/chat/',
    category: 'AI 工具',
    icon: '🫘',
    isPinned: false,
    isStarred: false
  },
  {
    name: 'Gemini',
    description: 'Google 的多模态 AI 助手',
    url: 'https://gemini.google.com/app?pli=1',
    category: 'AI 工具',
    icon: '♊',
    isPinned: false,
    isStarred: true
  },
  {
    name: '智谱AI开放平台',
    description: '智谱 AI 的 AI 服务平台',
    url: 'https://www.bigmodel.cn/console/overview',
    category: 'AI 工具',
    icon: '🎯',
    isPinned: false,
    isStarred: false
  },
  {
    name: 'Grok',
    description: 'X (Twitter) 的 AI 助手',
    url: 'https://grok.com/',
    category: 'AI 工具',
    icon: '⚡',
    isPinned: false,
    isStarred: true
  },
  {
    name: 'ChatGPT',
    description: 'OpenAI 的智能对话助手',
    url: 'https://chatgpt.com/',
    category: 'AI 工具',
    icon: '🤖',
    isPinned: true,
    isStarred: true
  },
  {
    name: '通义千问',
    description: '阿里云的 AI 大模型服务',
    url: 'https://www.qianwen.com/',
    category: 'AI 工具',
    icon: '💫',
    isPinned: false,
    isStarred: true
  },
  {
    name: 'Kimi',
    description: '月之暗面的智能助手',
    url: 'https://www.kimi.com/',
    category: 'AI 工具',
    icon: '🌙',
    isPinned: false,
    isStarred: true
  },
  {
    name: 'Xiaomi MiMo Studio',
    description: '小米的 AI 创作平台',
    url: 'https://aistudio.xiaomimimo.com/#/',
    category: 'AI 工具',
    icon: '🏠',
    isPinned: false,
    isStarred: false
  },
  {
    name: 'Claude',
    description: 'Anthropic 的 AI 助手',
    url: 'https://claude.ai/',
    category: 'AI 工具',
    icon: '🧠',
    isPinned: true,
    isStarred: true
  },
];

function sortBookmarksByPriority(bookmarksList) {
  return [...bookmarksList].sort((leftBookmark, rightBookmark) => {
    if (leftBookmark.isPinned !== rightBookmark.isPinned) {
      return Number(rightBookmark.isPinned) - Number(leftBookmark.isPinned);
    }

    if (leftBookmark.isStarred !== rightBookmark.isStarred) {
      return Number(rightBookmark.isStarred) - Number(leftBookmark.isStarred);
    }

    return 0;
  });
}

// 获取所有分类
const categories = ['全部', ...Array.from(new Set(bookmarksData.map(item => item.category)))];

export default function BookmarksPage() {
  const [activeCategory, setActiveCategory] = useState('全部');

  // 过滤书签数据
  const filteredBookmarks = useMemo(() => {
    const currentBookmarks = activeCategory === '全部'
      ? bookmarksData
      : bookmarksData.filter(item => item.category === activeCategory);

    return sortBookmarksByPriority(currentBookmarks);
  }, [activeCategory]);

  return (
    <Layout title="网站导航" description="常用网站导航和书签收藏">
      <div className={styles.bookmarksContainer}>
        {/* 页面头部 */}
        <header className={styles.header}>
          <div className={styles.headerWithAvatar}>
            <img 
              src={useBaseUrl('/person/touxiang.jpg')} 
              alt="头像" 
              className={styles.avatar}
            />
            <h1 className={styles.title}>网站导航</h1>
          </div>
          <p className={styles.subtitle}>收藏常用网站，提高工作效率</p>
        </header>

        {/* 分类标签 */}
        <div className={styles.categoryTabs}>
          {categories.map(category => (
            <button
              key={category}
              className={`${styles.tab} ${activeCategory === category ? styles.activeTab : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 书签列表 */}
        <div className={styles.bookmarksGrid}>
          {filteredBookmarks.length > 0 ? (
            filteredBookmarks.map((bookmark) => {
              const cardClassName = [
                styles.bookmarkCard,
                bookmark.isPinned ? styles.pinnedCard : '',
                bookmark.isStarred ? styles.starredCard : ''
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <a
                  key={bookmark.url}
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cardClassName}
                >
                  <div className={styles.cardIcon}>{bookmark.icon}</div>
                  <div className={styles.cardContent}>
                    <div className={styles.bookmarkNameRow}>
                      <h3 className={styles.bookmarkName}>{bookmark.name}</h3>
                      {bookmark.isStarred && (
                        <span className={styles.starBadge} aria-label="星标推荐" title="星标推荐">
                          ★
                        </span>
                      )}
                    </div>
                    <p className={styles.bookmarkDescription}>{bookmark.description}</p>
                    <span className={styles.bookmarkCategory}>{bookmark.category}</span>
                  </div>
                  <div className={styles.cardArrow}>→</div>
                </a>
              );
            })
          ) : (
            <div className={styles.emptyState}>
              该分类下暂无书签
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
