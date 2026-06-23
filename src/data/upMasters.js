/**
 * B站 UP 主数据 - 共享给导航页(/bookmarks)和独立 UP 主页(/up-masters)
 *
 * 字段说明:
 *  - name: UP 主昵称
 *  - uid: B站 UID,用于拼接空间链接 & 头像解析
 *  - avatar: 直接指定的 B站头像 URL;留空则用 UID 拼接官方头像
 *  - description: 你自己写的个性化描述(支持 \n 换行)
 *  - tags: 标签数组,显示在描述框底部
 *  - isPinned: 置顶(排序优先)
 *  - isStarred: 星标(次优先)
 *  - joinedAt: 关注时间(可选,显示在描述框顶部)
 */

export const upMastersData = [
  {
    name: 'JT硬件乐趣',
    uid: '33826835',
    description:
      '硬件 DIY 与嵌入式方向 UP 主,内容覆盖 PCB 设计、单片机开发、电子制作全流程。\n视频节奏紧凑,项目从原理图到焊接调试一步一步演示,适合跟着一起做实物。\n做硬件项目卡壳时,经常来这里找灵感。',
    tags: ['硬件', 'DIY', 'PCB', '嵌入式'],
    isPinned: true,
    isStarred: true,
  },
  {
    name: '何乐生0',
    uid: '1201496332',
    description:
      '嵌入式 / 单片机方向 UP 主,分享电子开发中的实战经验与踩坑记录。\n关注时间不长,内容相对新,适合当作嵌入式学习的补充视角。',
    tags: ['嵌入式', '单片机', '电子'],
    isPinned: false,
    isStarred: true,
  },
];

// 排序:置顶 > 星标
export function sortUpMastersByPriority(list) {
  return [...list].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return Number(b.isPinned) - Number(a.isPinned);
    if (a.isStarred !== b.isStarred) return Number(b.isStarred) - Number(a.isStarred);
    return 0;
  });
}