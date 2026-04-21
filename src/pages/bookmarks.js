import React, { useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './bookmarks.module.css';
import { 
  FaRobot, FaBrain, FaLanguage, FaLightbulb, FaBook, FaUniversity,
  FaKey, FaTicketAlt, FaSearch, FaDesktop, FaCog, FaFlask,
  FaMicrochip, FaPlug, FaWifi, FaLock, FaUnlock, FaDatabase,
  FaScroll, FaLinux, FaIndustry, FaGraduationCap, FaUser,
  FaBullhorn, FaEnvelope, FaEdit, FaArrowRight, FaStar,
  FaGem, FaRocket, FaBolt, FaFile, FaCertificate, FaGlobe
} from 'react-icons/fa';

// 提取网站域名的函数
const extractDomain = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return '';
  }
};

// 构建 Favicon URL - 使用 Google Favicon 服务
const getFaviconUrl = (url) => {
  const domain = extractDomain(url);
  if (!domain) return null;
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
};

/* 书签数据 - 推荐网站已标记为星标，使用专业SVG简笔画图标 */
const bookmarksData = [
  // ⭐ 推荐/常用网站
  {
    name: 'ChatGPT',
    description: 'OpenAI 的智能对话助手',
    url: 'https://chatgpt.com/',
    category: '⭐ 推荐网站',
    icon: 'robot',
    isPinned: true,
    isStarred: true
  },
  {
    name: 'Claude',
    description: 'Anthropic 的 AI 助手',
    url: 'https://claude.ai/',
    category: '⭐ 推荐网站',
    icon: 'brain',
    isPinned: true,
    isStarred: true
  },
  {
    name: '豆包',
    description: '字节跳动的智能对话助手',
    url: 'https://www.doubao.com/chat/',
    category: '⭐ 推荐网站',
    icon: 'gem',
    isPinned: true,
    isStarred: true
  },
  {
    name: 'Kimi',
    description: '月之暗面的智能助手',
    url: 'https://www.kimi.com/',
    category: '⭐ 推荐网站',
    icon: 'rocket',
    isPinned: true,
    isStarred: true
  },
  {
    name: 'DeepL 翻译',
    description: '高质量学术翻译工具',
    url: 'https://www.deepl.com/en/translator',
    category: '⭐ 推荐网站',
    icon: 'language',
    isPinned: true,
    isStarred: true
  },
  {
    name: '少数派',
    description: '高效工具与数字生活',
    url: 'https://sspai.com/',
    category: '⭐ 推荐网站',
    icon: 'lightbulb',
    isPinned: true,
    isStarred: true
  },
  {
    name: '立创开源硬件平台',
    description: '开源硬件项目分享平台',
    url: 'https://oshwhub.com/',
    category: '⭐ 推荐网站',
    icon: 'microchip',
    isPinned: true,
    isStarred: true
  },
  {
    name: 'Sipeed资料站',
    description: 'Sipeed官方技术文档',
    url: 'https://wiki.sipeed.com/',
    category: '⭐ 推荐网站',
    icon: 'book',
    isPinned: true,
    isStarred: true
  },
  {
    name: '浙江理工大学',
    description: '浙江理工大学官方网站',
    url: 'https://www.zstu.edu.cn/',
    category: '⭐ 推荐网站',
    icon: 'university',
    isPinned: true,
    isStarred: true
  },
  {
    name: '统一身份认证',
    description: '浙江理工大学统一身份认证平台',
    url: 'https://sso.zstu.edu.cn/login?service=https:%2F%2Fjwglxt.zstu.edu.cn%2Fsso%2Fjasiglogin',
    category: '⭐ 推荐网站',
    icon: 'key',
    isPinned: true,
    isStarred: true
  },
  {
    name: '嘉立创领券专区',
    description: 'PCB打样优惠领取',
    url: 'https://www.jlc.com/newOrder/#/collectCoupons',
    category: '⭐ 推荐网站',
    icon: 'ticket',
    isPinned: true,
    isStarred: true
  },
  {
    name: 'Gitee',
    description: '国内代码托管平台',
    url: 'https://gitee.com/',
    category: '⭐ 推荐网站',
    icon: 'database',
    isPinned: true,
    isStarred: true
  },
  {
    name: '谷粉学术',
    description: '谷歌学术镜像站',
    url: 'https://gfsoso.99lb.net/',
    category: '⭐ 推荐网站',
    icon: 'search',
    isPinned: true,
    isStarred: true
  },

  // 各种开源网站
  {
    name: '图拉丁CLUB',
    description: 'DIY垃圾佬的网站',
    url: 'https://tualatin.club/',
    category: '各种开源网站',
    icon: 'desktop',
    isPinned: false,
    isStarred: false
  },
  {
    name: "Power's Wiki",
    description: '个人技术知识库',
    url: 'https://wiki-power.com/',
    category: '各种开源网站',
    icon: 'book',
    isPinned: false,
    isStarred: false
  },
  {
    name: 'EIDE社区',
    description: 'EIDE开发环境社区',
    url: 'https://discuss.em-ide.com/?q=stc32',
    category: '各种开源网站',
    icon: 'cog',
    isPinned: false,
    isStarred: false
  },
  {
    name: '电子工程世界',
    description: '电子工程技术社区',
    url: 'https://bbs.eeworld.com.cn/forum-72-1.html',
    category: '各种开源网站',
    icon: 'flask',
    isPinned: false,
    isStarred: false
  },
  {
    name: '51黑电子',
    description: '单片机学习交流论坛',
    url: 'http://www.51hei.com/bbs/',
    category: '各种开源网站',
    icon: 'microchip',
    isPinned: false,
    isStarred: false
  },
  {
    name: 'PCB联盟网',
    description: 'PCB设计与制造资源',
    url: 'https://www.pcbbar.com/',
    category: '各种开源网站',
    icon: 'plug',
    isPinned: false,
    isStarred: false
  },
  {
    name: '电子发烧友',
    description: '电子工程师学习交流社区',
    url: 'https://www.elecfans.com/',
    category: '各种开源网站',
    icon: 'bolt',
    isPinned: false,
    isStarred: false
  },
  {
    name: '恩山无线论坛',
    description: '无线网络技术论坛',
    url: 'https://www.right.com.cn/forum/',
    category: '各种开源网站',
    icon: 'wifi',
    isPinned: false,
    isStarred: false
  },
  {
    name: '嘉立创领券专区',
    description: 'PCB打样优惠领取',
    url: 'https://www.jlc.com/newOrder/#/collectCoupons',
    category: '各种开源网站',
    icon: 'ticket',
    isPinned: false,
    isStarred: false
  },
  {
    name: 'Gitee',
    description: '国内代码托管平台',
    url: 'https://gitee.com/',
    category: '各种开源网站',
    icon: 'database',
    isPinned: false,
    isStarred: false
  },
  {
    name: '吾爱破解',
    description: '软件安全与逆向分析论坛',
    url: 'https://www.52pojie.cn/index.php',
    category: '各种开源网站',
    icon: 'unlock',
    isPinned: false,
    isStarred: false
  },
  {
    name: 'Sipeed资料站',
    description: 'Sipeed官方技术文档',
    url: 'https://wiki.sipeed.com/',
    category: '各种开源网站',
    icon: 'book',
    isPinned: false,
    isStarred: false
  },
  {
    name: '浏览器脚本下载',
    description: 'GreasyFork用户脚本',
    url: 'https://greasyfork.org/zh-CN',
    category: '各种开源网站',
    icon: 'scroll',
    isPinned: false,
    isStarred: false
  },
  {
    name: '半岛小芯',
    description: '芯片查询与采购平台',
    url: 'https://www.semiee.com/search?searchModel=bl3085',
    category: '各种开源网站',
    icon: 'microchip',
    isPinned: false,
    isStarred: false
  },
  {
    name: 'PT种子库',
    description: 'PT资源种子分享',
    url: 'https://cc.mypt.cc/ok.php?type=confirm',
    category: '各种开源网站',
    icon: 'database',
    isPinned: false,
    isStarred: false
  },
  {
    name: '少数派',
    description: '高效工具与数字生活',
    url: 'https://sspai.com/',
    category: '各种开源网站',
    icon: 'lightbulb',
    isPinned: false,
    isStarred: false
  },
  {
    name: 'LINUX DO',
    description: 'Linux技术社区',
    url: 'https://connect.linux.do/',
    category: '各种开源网站',
    icon: 'linux',
    isPinned: false,
    isStarred: false
  },
  {
    name: 'ST中文论坛',
    description: '意法半导体中文社区',
    url: 'https://shequ.stmicroelectronics.cn/portal.php',
    category: '各种开源网站',
    icon: 'industry',
    isPinned: false,
    isStarred: false
  },
  {
    name: 'CSDN文章解锁',
    description: 'CSDN文章免登录查看',
    url: 'http://101.42.252.35:5173/',
    category: '各种开源网站',
    icon: 'key',
    isPinned: false,
    isStarred: false
  },
  {
    name: 'S.H.I.T Journal',
    description: '学术期刊平台',
    url: 'https://shitjournal.org/dashboard',
    category: '各种开源网站',
    icon: 'scroll',
    isPinned: false,
    isStarred: false
  },

  // 大学相关
  {
    name: '浙江理工大学',
    description: '浙江理工大学官方网站',
    url: 'https://www.zstu.edu.cn/',
    category: '大学相关',
    icon: 'university',
    isPinned: false,
    isStarred: false
  },
  {
    name: '个人中心',
    description: '浙江理工大学学生个人中心',
    url: 'https://zstuedu.woczx.com/#/app/student/myproject',
    category: '大学相关',
    icon: 'user',
    isPinned: false,
    isStarred: false
  },
  {
    name: '图书馆',
    description: '浙江理工大学图书馆',
    url: 'https://lib.zstu.edu.cn/',
    category: '大学相关',
    icon: 'book',
    isPinned: false,
    isStarred: false
  },
  {
    name: '图书馆智能资源网关',
    description: '浙江理工大学图书馆资源导航',
    url: 'https://elib.zstu.edu.cn/next/resource/databases/navigation',
    category: '大学相关',
    icon: 'lock',
    isPinned: false,
    isStarred: false
  },
  {
    name: '教务处公告',
    description: '浙江理工大学教务处学生公告',
    url: 'https://jwc.zstu.edu.cn/list.jsp?urltype=tree.TreeTempUrl&wbtreeid=1192',
    category: '大学相关',
    icon: 'bullhorn',
    isPinned: false,
    isStarred: false
  },
  {
    name: '邮件系统',
    description: '浙江理工大学邮件系统',
    url: 'http://webmail.zstu.edu.cn/',
    category: '大学相关',
    icon: 'envelope',
    isPinned: false,
    isStarred: false
  },
  {
    name: '数字学工入口',
    description: '浙江理工大学数字学工系统',
    url: 'https://xgxt.zstu.edu.cn/',
    category: '大学相关',
    icon: 'graduationcap',
    isPinned: false,
    isStarred: false
  },
  {
    name: '信息学院官网',
    description: '信息科学与工程学院官方网站',
    url: 'https://sise.zstu.edu.cn/content.jsp?urltype=news.NewsContentUrl&wbtreeid=1141&wbnewsid=6299',
    category: '大学相关',
    icon: 'desktop',
    isPinned: false,
    isStarred: false
  },
  {
    name: '统一身份认证',
    description: '浙江理工大学统一身份认证平台',
    url: 'https://sso.zstu.edu.cn/login?service=https:%2F%2Fjwglxt.zstu.edu.cn%2Fsso%2Fjasiglogin',
    category: '大学相关',
    icon: 'key',
    isPinned: false,
    isStarred: false
  },
  {
    name: '工程电磁场纠正',
    description: '课程资源纠正文档',
    url: 'http://wiki.zstu.tech/index.php?title=ElectromagneticsErrata',
    category: '大学相关',
    icon: 'edit',
    isPinned: false,
    isStarred: false
  },
  {
    name: '采购中心公示',
    description: '浙江理工大学采购中心校外公示',
    url: 'https://cgzx.zstu.edu.cn/gggs/jggs/xwgs.htm',
    category: '大学相关',
    icon: 'file',
    isPinned: false,
    isStarred: false
  },

  // 学术
  {
    name: '谷歌学术',
    description: 'Google 的学术搜索平台',
    url: 'http://www.xueshuwang.top/',
    category: '学术',
    icon: 'graduationcap',
    isPinned: false,
    isStarred: false
  },
  {
    name: '谷粉学术',
    description: '谷歌学术镜像站',
    url: 'https://gfsoso.99lb.net/',
    category: '学术',
    icon: 'search',
    isPinned: false,
    isStarred: false
  },
  {
    name: '中国知网',
    description: '中国学术期刊全文数据库',
    url: 'https://www.cnki.net/old/',
    category: '学术',
    icon: 'book',
    isPinned: false,
    isStarred: false
  },
  {
    name: 'SciHub',
    description: '学术文献下载工具',
    url: 'https://www.scihub.net.cn/sci-hub/',
    category: '学术',
    icon: 'certificate',
    isPinned: false,
    isStarred: false
  },
  {
    name: '巨人学术文献',
    description: '学术文献检索平台',
    url: 'https://xs.typicalgame.com/',
    category: '学术',
    icon: 'file',
    isPinned: false,
    isStarred: false
  },
  {
    name: 'DeepL 翻译',
    description: '高质量学术翻译工具',
    url: 'https://www.deepl.com/en/translator',
    category: '学术',
    icon: 'language',
    isPinned: false,
    isStarred: false
  },

  // AI 工具
  {
    name: '豆包',
    description: '字节跳动的智能对话助手',
    url: 'https://www.doubao.com/chat/',
    category: 'AI 工具',
    icon: 'gem',
    isPinned: false,
    isStarred: false
  },
  {
    name: 'Gemini',
    description: 'Google 的多模态 AI 助手',
    url: 'https://gemini.google.com/app?pli=1',
    category: 'AI 工具',
    icon: 'brain',
    isPinned: false,
    isStarred: false
  },
  {
    name: '智谱AI开放平台',
    description: '智谱 AI 的 AI 服务平台',
    url: 'https://www.bigmodel.cn/console/overview',
    category: 'AI 工具',
    icon: 'gem',
    isPinned: false,
    isStarred: false
  },
  {
    name: 'Grok',
    description: 'X (Twitter) 的 AI 助手',
    url: 'https://grok.com/',
    category: 'AI 工具',
    icon: 'bolt',
    isPinned: false,
    isStarred: false
  },
  {
    name: 'ChatGPT',
    description: 'OpenAI 的智能对话助手',
    url: 'https://chatgpt.com/',
    category: 'AI 工具',
    icon: 'robot',
    isPinned: false,
    isStarred: false
  },
  {
    name: '通义千问',
    description: '阿里云的 AI 大模型服务',
    url: 'https://www.qianwen.com/',
    category: 'AI 工具',
    icon: 'gem',
    isPinned: false,
    isStarred: false
  },
  {
    name: 'Kimi',
    description: '月之暗面的智能助手',
    url: 'https://www.kimi.com/',
    category: 'AI 工具',
    icon: 'rocket',
    isPinned: false,
    isStarred: false
  },
  {
    name: 'Xiaomi MiMo Studio',
    description: '小米的 AI 创作平台',
    url: 'https://aistudio.xiaomimimo.com/#/',
    category: 'AI 工具',
    icon: 'rocket',
    isPinned: false,
    isStarred: false
  },
  {
    name: 'Claude',
    description: 'Anthropic 的 AI 助手',
    url: 'https://claude.ai/',
    category: 'AI 工具',
    icon: 'brain',
    isPinned: false,
    isStarred: false
  },
];

// 图标映射函数
const IconComponent = ({ iconName, className }) => {
  const iconProps = { className };
  
  const icons = {
    robot: <FaRobot {...iconProps} />,
    brain: <FaBrain {...iconProps} />,
    language: <FaLanguage {...iconProps} />,
    lightbulb: <FaLightbulb {...iconProps} />,
    book: <FaBook {...iconProps} />,
    university: <FaUniversity {...iconProps} />,
    key: <FaKey {...iconProps} />,
    ticket: <FaTicketAlt {...iconProps} />,
    search: <FaSearch {...iconProps} />,
    desktop: <FaDesktop {...iconProps} />,
    cog: <FaCog {...iconProps} />,
    flask: <FaFlask {...iconProps} />,
    microchip: <FaMicrochip {...iconProps} />,
    plug: <FaPlug {...iconProps} />,
    wifi: <FaWifi {...iconProps} />,
    lock: <FaLock {...iconProps} />,
    unlock: <FaUnlock {...iconProps} />,
    database: <FaDatabase {...iconProps} />,
    scroll: <FaScroll {...iconProps} />,
    linux: <FaLinux {...iconProps} />,
    industry: <FaIndustry {...iconProps} />,
    graduationcap: <FaGraduationCap {...iconProps} />,
    user: <FaUser {...iconProps} />,
    bullhorn: <FaBullhorn {...iconProps} />,
    envelope: <FaEnvelope {...iconProps} />,
    edit: <FaEdit {...iconProps} />,
    gem: <FaGem {...iconProps} />,
    rocket: <FaRocket {...iconProps} />,
    bolt: <FaBolt {...iconProps} />,
    file: <FaFile {...iconProps} />,
    certificate: <FaCertificate {...iconProps} />,
  };

  return icons[iconName] || <FaBook {...iconProps} />;
};

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
  const [activeCategory, setActiveCategory] = useState('⭐ 推荐网站');

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

              const faviconUrl = getFaviconUrl(bookmark.url);
              
              return (
                <a
                  key={bookmark.url}
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cardClassName}
                >
                  {faviconUrl ? (
                    <img 
                      src={faviconUrl} 
                      alt="" 
                      className={styles.favicon}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={styles.cardIcon} style={faviconUrl ? {display: 'none'} : undefined}>
                    <IconComponent iconName={bookmark.icon} className={styles.cardIconSvg} />
                  </div>
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
