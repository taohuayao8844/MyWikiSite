import React, { useState } from 'react';
import { SiBilibili } from 'react-icons/si';
import { FaStar, FaExternalLinkAlt } from 'react-icons/fa';
import styles from './HorizontalCard.module.css';

/* ----------------------------- 头像相关工具 ----------------------------- */

function extractDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

// B站头像兜底(走 card 接口,前端因跨域可能拿不到,失败回退首字母)
const biliFallbackAvatar = (uid) => `https://api.bilibili.com/x/web-interface/card?mid=${uid}`;

const friendFavicon = (url) => {
  const domain = extractDomain(url);
  if (!domain) return null;
  return `https://api.iowen.cn/favicon/${domain}.png`;
};

const friendFaviconFallbacks = (url) => {
  const domain = extractDomain(url);
  if (!domain) return [];
  return [
    `https://q1.qlogo.cn/g?b=qq&nk=${domain}&s=64`,
    `https://${domain}/favicon.ico`,
  ];
};

// B站头像首字母渐变色(可复现,稳定)
const AVATAR_GRADIENTS = [
  ['#00a1d6', '#f25d8e'],
  ['#fb7299', '#00a1d6'],
  ['#7c3aed', '#00a1d6'],
  ['#f59e0b', '#ef4444'],
  ['#10b981', '#0ea5e9'],
];

function pickGradient(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
}

/* ----------------------------- 横向卡片组件 ----------------------------- */

/**
 * 横向卡片 - B站UP主 与 友链 共用布局
 *
 * Props:
 *  - variant: 'bili' | 'friend'
 *  - name: 名称
 *  - url: 链接(bili 时用于拼接 B站空间链接,friend 时直接跳转)
 *  - uid:  B站 UID(bili 必需,friend 不需要)
 *  - avatar: 直接指定的图片地址(bili 可选)
 *  - description: 描述文本(支持 \n 换行)
 *  - tags: 标签数组
 *  - isPinned / isStarred / isFeatured: 排序标记(用作样式)
 *  - badgeText: 头像上的小角标文字,默认 bili 显示 SiBilibili, friend 显示 '友'
 */
export default function HorizontalCard({
  variant = 'friend',
  name,
  url,
  uid,
  avatar,
  description,
  tags = [],
  isPinned = false,
  isStarred = false,
  isFeatured = false,
  badgeText,
  onClickOverride,
}) {
  const isBili = variant === 'bili';
  const linkUrl = isBili && uid ? `https://space.bilibili.com/${uid}` : url;
  const primarySrc = isBili
    ? avatar || biliFallbackAvatar(uid)
    : friendFavicon(url);
  const fallbacks = !isBili ? friendFaviconFallbacks(url) : [];

  const [avatarFailed, setAvatarFailed] = useState(false);
  const [fallbackIdx, setFallbackIdx] = useState(0);
  const gradient = pickGradient(uid || url || name || '');

  // 计算当前展示的图片 src
  let currentSrc = null;
  if (!avatarFailed) {
    if (isBili) {
      currentSrc = primarySrc;
    } else if (fallbackIdx === 0) {
      currentSrc = primarySrc;
    } else {
      currentSrc = fallbacks[fallbackIdx - 1];
    }
  }

  const handleAvatarError = (e) => {
    if (isBili) {
      setAvatarFailed(true);
      return;
    }
    const next = fallbackIdx + 1;
    if (next <= fallbacks.length) {
      setFallbackIdx(next);
    } else {
      setAvatarFailed(true);
    }
  };

  const wrapperClass = [
    styles.horizontalCard,
    isPinned ? styles.horizontalCardPinned : '',
    isStarred ? styles.horizontalCardStarred : '',
    isFeatured ? styles.horizontalCardFeatured : '',
  ].filter(Boolean).join(' ');

  return (
    <article className={wrapperClass} data-variant={variant}>
      {/* 左侧:profile 区域 */}
      <a
        className={styles.horizontalCardProfile}
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`访问 ${name} 的${isBili ? 'B站空间' : '主页'}`}
        onClick={onClickOverride}
      >
        <div className={styles.horizontalCardAvatar}>
          {!avatarFailed && currentSrc ? (
            <img
              src={currentSrc}
              alt={name}
              onError={handleAvatarError}
              loading="lazy"
            />
          ) : (
            <span
              className={styles.horizontalCardAvatarFallback}
              style={{
                background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
              }}
            >
              {name.charAt(0)}
            </span>
          )}
          <span className={styles.horizontalCardAvatarBadge} data-variant={variant}>
            {isBili ? <SiBilibili /> : (badgeText || '友')}
          </span>
        </div>

        <div className={styles.horizontalCardProfileText}>
          <div className={styles.horizontalCardName}>
            <span>{name}</span>
            {(isStarred || isFeatured) && <FaStar className={styles.horizontalCardStar} />}
          </div>
          <div className={styles.horizontalCardSub}>
            {isBili ? `UID: ${uid}` : extractDomain(url)}
          </div>
          <div className={styles.horizontalCardLink}>
            {isBili ? '访问空间' : '访问博客'} <FaExternalLinkAlt />
          </div>
        </div>
      </a>

      {/* 右侧:描述框 */}
      <div className={styles.horizontalCardDesc}>
        <div className={styles.horizontalCardDescHeader}>
          <span className={styles.horizontalCardDescLabel}>
            {isBili ? '个人描述' : '推荐描述'}
          </span>
        </div>
        <div className={styles.horizontalCardDescContent}>
          {description.split('\n').map((line, i) => (
            <p key={i} className={styles.horizontalCardDescLine}>{line}</p>
          ))}
        </div>
        {tags && tags.length > 0 && (
          <div className={styles.horizontalCardTags}>
            {tags.map((t) => (
              <span key={t} className={styles.horizontalCardTag}>{t}</span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}