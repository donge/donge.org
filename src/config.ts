export const SITE = {
  website: "https://donge.org/",
  author: "donge",
  profile: "https://github.com/donge",
  desc: "东冬の乱记 - AI、技术与生活的随笔",
  title: "东冬の乱记",
  ogImage: "og-image.jpg",
  lightAndDarkMode: true,
  postPerIndex: 6,
  postPerPage: 10,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true,
  editPost: {
    enabled: false,
    text: "Edit page",
    url: "https://github.com/donge/donge.org/edit/main/src/data/blog/",
  },
  dynamicOgImage: true,
  dir: "ltr",
  lang: "zh-CN",
  timezone: "Asia/Shanghai",
} as const;

/**
 * Google AdSense 配置
 *
 * 上线顺序：
 *   1. 用下方 client 里的真实 ID 提交站点申请（enabled 必须为 true，
 *      否则 Google 检测不到代码，审核不会开始）
 *   2. 审核期间保持 slots 为空：加载器已上线，但页面上不会有广告位，
 *      避免审核期产生无效展示
 *   3. 审核通过后，在 AdSense 后台「广告 > 按广告单元」创建单元，
 *      把 slot id 填进来即可开始出广告
 *   4. 配置「隐私权和消息 > GDPR 消息」（EEA/英国必需，否则那边完全不展示广告）
 */
export const ADSENSE = {
  /** 总开关。false 时页面上不会出现任何广告代码 */
  enabled: true,
  /** 发布商 ID，形如 ca-pub-1234567890123456 */
  client: "ca-pub-7665302986832862",
  /**
   * 广告单元 ID，在 AdSense 后台「广告 > 按广告单元」创建后获取。
   * 留空 = 该位置不渲染广告。审核通过前请保持为空。
   */
  slots: {
    /** 文章顶部横幅 */
    postTop: "",
    /** 文章底部横幅 */
    postBottom: "",
    /** 列表页（首页/归档/标签） */
    listBottom: "",
  },
} as const;

/** 发布商 ID 是否已配置为真实值（排除占位） */
export const hasAdsenseClient = (): boolean =>
  ADSENSE.enabled && /^ca-pub-\d{10,}$/.test(ADSENSE.client);

/** 广告位是否已就绪，避免占位 ID 造成无效请求 */
export const isAdsenseReady = (slot?: string): boolean =>
  hasAdsenseClient() && Boolean(slot);
