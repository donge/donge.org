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
