/**
 * 友链数据 - 共享给导航页(/bookmarks)
 * 字段:
 *  - name: 博客/博主名
 *  - url: 博客地址
 *  - description: 你自己写的推荐描述(支持 \n 换行)
 *  - tags: 标签数组
 *  - isPinned: 置顶
 *  - isStarred: 星标
 *  - isFeatured: 强推(放最前面)
 */

export const friendsData = [
  {
    name: 'Wiki Power博客',
    url: 'https://wiki-power.com/',
    description:
      '一个 RMer 的网站,里面有很完整的电子类的知识和发展路径。\n从硬件入门到嵌入式项目,内容结构化,适合作为电子方向系统学习的索引站。',
    tags: ['电子', '嵌入式', '系统学习'],
    isPinned: true,
    isStarred: true,
    isFeatured: true,
  },
  {
    name: '碳烤鱼的博客',
    url: 'https://www.indratang.top/s1/zero2hero',
    description:
      '这个是一个浙大的工科学长,给了我很多的启发,如果大一就看了这个博客,可能会少走很多弯路,强推!\n关于大学规划、技术方向选择、个人成长的真实记录,每篇都值得读两遍。',
    tags: ['大学规划', '成长', '工科'],
    isPinned: true,
    isStarred: true,
    isFeatured: true,
  },
  {
    name: 'CS自学指南',
    url: 'https://csdiy.wiki/#cs61a',
    description:
      '一份完整的 CS 自学指南,涵盖国内外公开课资源、学习路径、刷题路线。\n计算机专业同学的宝藏导航站,比很多付费课靠谱。',
    tags: ['CS', '自学', '公开课'],
    isPinned: true,
    isStarred: true,
    isFeatured: true,
  },
  {
    name: 'SysNow的博客',
    url: 'https://sysnow.xyz/',
    description:
      '理工的 PWM_King 的博客。同学里少见的、愿意把工程实践细节写得很细的人。\n嵌入式、自动化、折腾向,跟我关注的领域重合度很高。',
    tags: ['嵌入式', '同学', '工程'],
    isPinned: false,
    isStarred: true,
    isFeatured: false,
  },
];

export function sortFriendsByPriority(list) {
  return [...list].sort((a, b) => {
    if (a.isFeatured !== b.isFeatured) return Number(b.isFeatured) - Number(a.isFeatured);
    if (a.isPinned !== b.isPinned) return Number(b.isPinned) - Number(a.isPinned);
    if (a.isStarred !== b.isStarred) return Number(b.isStarred) - Number(a.isStarred);
    return 0;
  });
}