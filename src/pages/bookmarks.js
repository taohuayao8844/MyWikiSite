import React, { useMemo, useState, useEffect, useRef } from 'react';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './bookmarks.module.css';
import {
  FaRobot, FaBrain, FaLanguage, FaLightbulb, FaBook, FaUniversity,
  FaKey, FaTicketAlt, FaSearch, FaDesktop, FaCog, FaFlask,
  FaMicrochip, FaPlug, FaWifi, FaLock, FaUnlock, FaDatabase,
  FaScroll, FaLinux, FaIndustry, FaGraduationCap, FaUser,
  FaBullhorn, FaEnvelope, FaEdit, FaStar, FaGem, FaRocket,
  FaBolt, FaFile, FaCertificate, FaExternalLinkAlt,
} from 'react-icons/fa';
import HorizontalCard from '../components/HorizontalCard';
import { upMastersData, sortUpMastersByPriority } from '../data/upMasters';
import { friendsData, sortFriendsByPriority } from '../data/friends';

/* ----------------------------- 通用工具 ----------------------------- */

const extractDomain = (url) => {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
};

// B站 UP 主头像优先从空间 ID 解出官方头像,失败回退到 favicon 服务
const getBiliFaceUrl = (url) => {
  try {
    const m = url.match(/space\.bilibili\.com\/(\d+)/);
    if (!m) return null;
    const mid = m[1];
    return `https://api.bilibili.com/x/web-interface/card?mid=${mid}`; // 浏览器若跨域则降级
  } catch {
    return null;
  }
};

const getFaviconUrl = (url) => {
  const domain = extractDomain(url);
  if (!domain) return null;
  return `https://api.iowen.cn/favicon/${domain}.png`;
};

const getFallbackFaviconUrls = (url) => {
  const domain = extractDomain(url);
  if (!domain) return [];
  return [
    `https://q1.qlogo.cn/g?b=qq&nk=${domain}&s=64`,
    `https://${domain}/favicon.ico`,
  ];
};

/* ----------------------------- 图标映射 ----------------------------- */

const IconComponent = ({ iconName, className }) => {
  const iconProps = { className };
  const map = {
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
  return map[iconName] || <FaBook {...iconProps} />;
};

/* ----------------------------- 数据 ----------------------------- */

const bookmarksData = [
  // ⭐ 推荐/常用网站
  { name: 'ChatGPT', description: 'OpenAI 的智能对话助手', url: 'https://chatgpt.com/', category: '推荐', icon: 'robot', isPinned: true, isStarred: true },
  { name: 'Claude', description: 'Anthropic 的 AI 助手', url: 'https://claude.ai/', category: '推荐', icon: 'brain', isPinned: true, isStarred: true },
  { name: '豆包', description: '字节跳动的智能对话助手', url: 'https://www.doubao.com/chat/', category: '推荐', icon: 'gem', isPinned: true, isStarred: true },
  { name: 'Kimi', description: '月之暗面的智能助手', url: 'https://www.kimi.com/', category: '推荐', icon: 'rocket', isPinned: true, isStarred: true },
  { name: 'DeepL 翻译', description: '高质量学术翻译工具', url: 'https://www.deepl.com/en/translator', category: '推荐', icon: 'language', isPinned: true, isStarred: true },
  { name: '少数派', description: '高效工具与数字生活', url: 'https://sspai.com/', category: '推荐', icon: 'lightbulb', isPinned: true, isStarred: true },
  { name: '立创开源硬件平台', description: '开源硬件项目分享平台', url: 'https://oshwhub.com/', category: '推荐', icon: 'microchip', isPinned: true, isStarred: true },
  { name: 'Sipeed资料站', description: 'Sipeed官方技术文档', url: 'https://wiki.sipeed.com/', category: '推荐', icon: 'book', isPinned: true, isStarred: true },
  { name: '浙江理工大学', description: '浙江理工大学官方网站', url: 'https://www.zstu.edu.cn/', category: '推荐', icon: 'university', isPinned: true, isStarred: true },
  { name: '统一身份认证', description: '浙江理工大学统一身份认证平台', url: 'https://sso.zstu.edu.cn/login?service=https:%2F%2Fjwglxt.zstu.edu.cn%2Fsso%2Fjasiglogin', category: '推荐', icon: 'key', isPinned: true, isStarred: true },
  { name: '嘉立创领券专区', description: 'PCB打样优惠领取', url: 'https://www.jlc.com/newOrder/#/collectCoupons', category: '推荐', icon: 'ticket', isPinned: true, isStarred: true },
  { name: 'Gitee', description: '国内代码托管平台', url: 'https://gitee.com/', category: '推荐', icon: 'database', isPinned: true, isStarred: true },
  { name: '谷粉学术', description: '谷歌学术镜像站', url: 'https://gfsoso.99lb.net/', category: '推荐', icon: 'search', isPinned: true, isStarred: true },

  // 开源 / 技术社区
  { name: '图拉丁CLUB', description: 'DIY垃圾佬的网站', url: 'https://tualatin.club/', category: '技术', icon: 'desktop' },
  { name: "Power's Wiki", description: '个人技术知识库', url: 'https://wiki-power.com/', category: '技术', icon: 'book' },
  { name: 'EIDE社区', description: 'EIDE开发环境社区', url: 'https://discuss.em-ide.com/?q=stc32', category: '技术', icon: 'cog' },
  { name: '电子工程世界', description: '电子工程技术社区', url: 'https://bbs.eeworld.com.cn/forum-72-1.html', category: '技术', icon: 'flask' },
  { name: '51黑电子', description: '单片机学习交流论坛', url: 'http://www.51hei.com/bbs/', category: '技术', icon: 'microchip' },
  { name: 'PCB联盟网', description: 'PCB设计与制造资源', url: 'https://www.pcbbar.com/', category: '技术', icon: 'plug' },
  { name: '电子发烧友', description: '电子工程师学习交流社区', url: 'https://www.elecfans.com/', category: '技术', icon: 'bolt' },
  { name: '恩山无线论坛', description: '无线网络技术论坛', url: 'https://www.right.com.cn/forum/', category: '技术', icon: 'wifi' },
  { name: '吾爱破解', description: '软件安全与逆向分析论坛', url: 'https://www.52pojie.cn/index.php', category: '技术', icon: 'unlock' },
  { name: '浏览器脚本下载', description: 'GreasyFork用户脚本', url: 'https://greasyfork.org/zh-CN', category: '技术', icon: 'scroll' },
  { name: '半岛小芯', description: '芯片查询与采购平台', url: 'https://www.semiee.com/search?searchModel=bl3085', category: '技术', icon: 'microchip' },
  { name: 'LINUX DO', description: 'Linux技术社区', url: 'https://connect.linux.do/', category: '技术', icon: 'linux' },
  { name: 'ST中文论坛', description: '意法半导体中文社区', url: 'https://shequ.stmicroelectronics.cn/portal.php', category: '技术', icon: 'industry' },
  { name: 'CSDN文章解锁', description: 'CSDN文章免登录查看', url: 'http://101.42.252.35:5173/', category: '技术', icon: 'key' },
  { name: 'S.H.I.T Journal', description: '学术期刊平台', url: 'https://shitjournal.org/dashboard', category: '技术', icon: 'scroll' },
  { name: 'PT种子库', description: 'PT资源种子分享', url: 'https://cc.mypt.cc/ok.php?type=confirm', category: '技术', icon: 'database' },

  // 大学相关
  { name: '个人中心', description: '浙江理工大学学生个人中心', url: 'https://zstuedu.woczx.com/#/app/student/myproject', category: '大学', icon: 'user' },
  { name: '图书馆', description: '浙江理工大学图书馆', url: 'https://lib.zstu.edu.cn/', category: '大学', icon: 'book' },
  { name: '图书馆智能资源网关', description: '浙江理工大学图书馆资源导航', url: 'https://elib.zstu.edu.cn/next/resource/databases/navigation', category: '大学', icon: 'lock' },
  { name: '教务处公告', description: '浙江理工大学教务处学生公告', url: 'https://jwc.zstu.edu.cn/list.jsp?urltype=tree.TreeTempUrl&wbtreeid=1192', category: '大学', icon: 'bullhorn' },
  { name: '邮件系统', description: '浙江理工大学邮件系统', url: 'http://webmail.zstu.edu.cn/', category: '大学', icon: 'envelope' },
  { name: '数字学工入口', description: '浙江理工大学数字学工系统', url: 'https://xgxt.zstu.edu.cn/', category: '大学', icon: 'graduationcap' },
  { name: '信息学院官网', description: '信息科学与工程学院官方网站', url: 'https://sise.zstu.edu.cn/content.jsp?urltype=news.NewsContentUrl&wbtreeid=1141&wbnewsid=6299', category: '大学', icon: 'desktop' },
  { name: '工程电磁场纠正', description: '课程资源纠正文档', url: 'http://wiki.zstu.tech/index.php?title=ElectromagneticsErrata', category: '大学', icon: 'edit' },
  { name: '采购中心公示', description: '浙江理工大学采购中心校外公示', url: 'https://cgzx.zstu.edu.cn/gggs/jggs/xwgs.htm', category: '大学', icon: 'file' },

  // 学术
  { name: '谷歌学术', description: 'Google 的学术搜索平台', url: 'http://www.xueshuwang.top/', category: '学术', icon: 'graduationcap' },
  { name: '中国知网', description: '中国学术期刊全文数据库', url: 'https://www.cnki.net/old/', category: '学术', icon: 'book' },
  { name: 'SciHub', description: '学术文献下载工具', url: 'https://www.scihub.net.cn/sci-hub/', category: '学术', icon: 'certificate' },
  { name: '巨人学术文献', description: '学术文献检索平台', url: 'https://xs.typicalgame.com/', category: '学术', icon: 'file' },

  // AI 工具
  { name: 'Gemini', description: 'Google 的多模态 AI 助手', url: 'https://gemini.google.com/app?pli=1', category: 'AI', icon: 'brain' },
  { name: '智谱AI开放平台', description: '智谱 AI 的 AI 服务平台', url: 'https://www.bigmodel.cn/console/overview', category: 'AI', icon: 'gem' },
  { name: 'Grok', description: 'X (Twitter) 的 AI 助手', url: 'https://grok.com/', category: 'AI', icon: 'bolt' },
  { name: '通义千问', description: '阿里云的 AI 大模型服务', url: 'https://www.qianwen.com/', category: 'AI', icon: 'gem' },
  { name: 'Xiaomi MiMo Studio', description: '小米的 AI 创作平台', url: 'https://aistudio.xiaomimimo.com/#/', category: 'AI', icon: 'rocket' },
];

/* ----------------------------- B站 UP 主数据(共享) + 友链数据(共享) ----------------------------- */
/* 数据已在 src/data/upMasters.js 和 src/data/friends.js,这里只导入使用 */

/* ----------------------------- 组件 ----------------------------- */

function sortBookmarksByPriority(list) {
  return [...list].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return Number(b.isPinned) - Number(a.isPinned);
    if (a.isStarred !== b.isStarred) return Number(b.isStarred) - Number(a.isStarred);
    return 0;
  });
}

// 单个书签卡片(用于"网站"类分类)
function SiteCard({ bookmark }) {
  const faviconUrl = getFaviconUrl(bookmark.url);
  const fallbacks = getFallbackFaviconUrls(bookmark.url);

  const cardClass = [
    styles.siteCard,
    bookmark.isPinned ? styles.siteCardPinned : '',
    bookmark.isStarred ? styles.siteCardStarred : '',
  ].filter(Boolean).join(' ');

  return (
    <a
      href={bookmark.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cardClass}
    >
      <div className={styles.siteCardIcon}>
        {faviconUrl ? (
          <img
            src={faviconUrl}
            alt=""
            className={styles.siteCardFavicon}
            data-fallback-index="0"
            data-fallback-urls={JSON.stringify(fallbacks)}
            onError={(e) => {
              const img = e.target;
              const list = JSON.parse(img.dataset.fallbackUrls || '[]');
              const idx = parseInt(img.dataset.fallbackIndex || '0', 10);
              if (idx < list.length) {
                img.dataset.fallbackIndex = String(idx + 1);
                img.src = list[idx];
              } else {
                img.style.display = 'none';
                const placeholder = img.nextElementSibling;
                if (placeholder) placeholder.style.display = 'flex';
              }
            }}
          />
        ) : null}
        <span className={styles.siteCardIconPlaceholder} style={{ display: faviconUrl ? 'none' : 'flex' }}>
          <IconComponent iconName={bookmark.icon} className={styles.siteCardIconSvg} />
        </span>
      </div>

      <div className={styles.siteCardBody}>
        <div className={styles.siteCardTitle}>
          <span>{bookmark.name}</span>
          {bookmark.isStarred && <FaStar className={styles.siteCardStar} />}
        </div>
        <div className={styles.siteCardDesc}>{bookmark.description}</div>
      </div>

      <FaExternalLinkAlt className={styles.siteCardArrow} />
    </a>
  );
}

// 单个 UP 主/友链卡片已抽到 src/components/HorizontalCard.js

/* ----------------------------- 主页面 ----------------------------- */

export default function BookmarksPage() {
  // 把 B站UP主 + 友链作为独立分类注入
  const allCategories = useMemo(() => {
    const set = new Set(bookmarksData.map((b) => b.category));
    set.add('B站UP主');
    set.add('友链');
    return [
      '推荐',
      'B站UP主',
      '友链',
      ...Array.from(set).filter((c) => c !== '推荐' && c !== 'B站UP主' && c !== '友链'),
    ];
  }, []);

  const [activeCategory, setActiveCategory] = useState('推荐');
  const [query, setQuery] = useState('');
  const searchRef = useRef(null);

  // Cmd/Ctrl + K 聚焦搜索框
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const isBili = activeCategory === 'B站UP主';
  const isFriend = activeCategory === '友链';
  const isHorizontal = isBili || isFriend;

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    const match = (text) => !q || text.toLowerCase().includes(q);

    if (isBili) {
      const list = upMastersData.filter(
        (u) => match(u.name) || match(u.description) || (u.tags || []).some((t) => match(t))
      );
      return sortUpMastersByPriority(list);
    }
    if (isFriend) {
      const list = friendsData.filter(
        (f) => match(f.name) || match(f.description) || (f.tags || []).some((t) => match(t))
      );
      return sortFriendsByPriority(list);
    }
    const list = bookmarksData
      .filter((b) => b.category === activeCategory)
      .filter((b) => match(b.name) || match(b.description));
    return sortBookmarksByPriority(list);
  }, [activeCategory, query, isBili, isFriend]);

  const totalCount = bookmarksData.length + upMastersData.length + friendsData.length;

  // 当前分类的统计
  const currentCount = isBili
    ? upMastersData.length
    : isFriend
      ? friendsData.length
      : bookmarksData.filter((b) => b.category === activeCategory).length;

  return (
    <Layout title="网站导航" description="常用网站导航和书签收藏">
      <div className={styles.dashboard}>
        {/* ===================== 左侧栏 ===================== */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <img
              src={useBaseUrl('/person/touxiang.jpg')}
              alt="头像"
              className={styles.sidebarAvatar}
            />
            <div>
              <div className={styles.sidebarTitle}>网站导航</div>
              <div className={styles.sidebarSubtitle}>常用收藏 · {totalCount} 项</div>
            </div>
          </div>

          {/* 搜索框 */}
          <div className={styles.searchBox}>
            <FaSearch className={styles.searchIcon} />
            <input
              ref={searchRef}
              type="text"
              placeholder="搜索书签 / UP主 / 友链..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={styles.searchInput}
            />
            <kbd className={styles.searchKbd}>⌘K</kbd>
          </div>

          {/* 分类列表 */}
          <nav className={styles.categoryList}>
            {allCategories.map((cat) => {
              const count =
                cat === 'B站UP主'
                  ? upMastersData.length
                  : cat === '友链'
                    ? friendsData.length
                    : bookmarksData.filter((b) => b.category === cat).length;
              const isActive = cat === activeCategory;
              return (
                <button
                  key={cat}
                  className={`${styles.categoryItem} ${isActive ? styles.categoryItemActive : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  <span className={styles.categoryItemName}>{cat}</span>
                  <span className={styles.categoryItemCount}>{count}</span>
                </button>
              );
            })}
          </nav>

          <div className={styles.sidebarFooter}>
            <span>按 ⌘K 快速搜索</span>
          </div>
        </aside>

        {/* ===================== 主区域 ===================== */}
        <main className={styles.main}>
          <header className={styles.mainHeader}>
            <div>
              <h1 className={styles.mainTitle}>{activeCategory}</h1>
              <p className={styles.mainSubtitle}>
                {isBili
                  ? '我关注的 B 站 UP 主 · 每个博主旁附自定义描述'
                  : isFriend
                    ? '我收藏的博客与友链 · 每条旁附自定义推荐描述'
                    : '收藏的常用网站 · 点击卡片跳转'}
              </p>
            </div>
            <div className={styles.mainMeta}>
              <span className={styles.mainMetaCount}>
                {query ? `匹配 ${filteredItems.length}` : `共 ${currentCount}`}
              </span>
            </div>
          </header>

          {/* 内容区 */}
          {filteredItems.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>
                <IconComponent iconName="search" className={styles.emptyIconSvg} />
              </div>
              <div className={styles.emptyText}>
                {query ? `没有匹配 "${query}" 的内容` : '该分类下暂无内容'}
              </div>
            </div>
          ) : isHorizontal ? (
            <div className={styles.upList}>
              {filteredItems.map((item) => (
                <HorizontalCard
                  key={isBili ? item.uid : item.url}
                  variant={isBili ? 'bili' : 'friend'}
                  {...item}
                />
              ))}
            </div>
          ) : (
            <div className={styles.siteGrid}>
              {filteredItems.map((b) => (
                <SiteCard key={b.url} bookmark={b} />
              ))}
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
}