// @ts-nocheck
// Note: type annotations allow type checking and IDEs autocompletion

const path = require('path')
const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/dracula')
const oceanicNext = require('prism-react-renderer/themes/oceanicNext')
const duotoneLight = require('prism-react-renderer/themes/duotoneLight')
/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'ZeroPointNine站',
  tagline: '叹隙中驹，石中火，梦中身',
  url: 'https://taohuayao8844.github.io',
  baseUrl: '/',
  onBrokenLinks: 'log',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'person/favicon.ico',
  organizationName: 'taohuayao8844', // Usually your GitHub org/user name.
  projectName: 'taohuayao8844.github.io', // Usually your repo name.
  i18n: {
    defaultLocale: 'zh-cn',
    locales: ['zh-cn'],
  },
  scripts: process.env.track_url ? [
     {
      src: process.env.track_url,
      'data-website-id':process.env.track_id,
      async: true,
    }
  ] : [],
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        gtag: {
          trackingID: 'G-K06FBEHD1R',
          anonymizeIP: true,
        },
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          // 指向当前个人仓库，便于后续维护文档来源
          editUrl: 'https://github.com/taohuayao8844/taohuayao8844.github.io/tree/main/',
          // 配置 Markdown 支持 LaTeX 公式
          remarkPlugins: [require('remark-math')],
          rehypePlugins: [
            [require('rehype-katex'), {
              strict: false,
              throwOnError: false,
              output: 'html',
              displayMode: false,
            }],
          ],
        },
        blog: {
          showReadingTime: true,
          // 指向当前个人仓库，便于后续维护博客来源
          editUrl: 'https://github.com/taohuayao8844/taohuayao8844.github.io/tree/main/',
          // 配置博客支持 LaTeX 公式
          remarkPlugins: [require('remark-math')],
          rehypePlugins: [
            [require('rehype-katex'), {
              strict: false,
              throwOnError: false,
              output: 'html',
              displayMode: false,
            }],
          ],
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
  plugins: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        indexDocs: true,
        indexBlog: true,
        indexPages: false,
        docsRouteBasePath: '/',
        blogRouteBasePath: '/blog',
        language: ['zh', 'en'],
        hashed: 'filename',
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        searchBarPosition: 'right',
      },
    ],
    function searchPageAliasPlugin() {
      return {
        name: 'search-page-alias-plugin',
        configureWebpack() {
          return {
            resolve: {
              alias: {
                '@theme/SearchPage': path.resolve(__dirname, './src/theme/SearchPage/index.js'),
              },
            },
          }
        },
      }
    },
  ],

  // 添加 KaTeX CSS 样式
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css',
      type: 'text/css',
      integrity: 'sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV',
      crossorigin: 'anonymous',
    },
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'ZeroPointNine站',
        items: [
          {
            to: '/A_%E5%86%99%E5%9C%A8%E5%89%8D%E9%9D%A2',
            label: '📗Wiki',
            position: 'left',
          },
          {
            to: '/blog',
            label: '📝博客',
            position: 'left',
          },
          {
            to: '/bookmarks',
            label: '📑导航',
            position: 'left',
          },
          {
            to: '/files',
            label: '📁文件',
            position: 'left',
          },
          {
            type: 'search',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Wiki',
                to: '/A_%E5%86%99%E5%9C%A8%E5%89%8D%E9%9D%A2',
              },
              {
                label: '导航',
                to: '/bookmarks',
              },
            ],
          },
          {
            title: 'Contact',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/taohuayao8844/taohuayao8844.github.io',
              },
              {
                label: '微博',
                href: 'https://weibo.com/u/5920416195',
              },
              {
                label: 'Bilibili',
                href: 'https://space.bilibili.com/396104992?spm_id_from=333.1007.0.0',
              },
            ],
          },
        ],
        copyright:
          '© 2025 ZERO_POINT_NINE  |  <a href="https://www.beian.gov.cn/portal/query/index" target="_blank" rel="noopener noreferrer">浙ICP备2025202341号</a>',
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: oceanicNext,
        // theme: duotoneLight,
        // darkTheme: oceanicNext,
      },
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 5,
      },
      metadata: [
        {
          name: 'description',
          content: 'ZeroPointNine 的个人博客与知识整理站，记录学习、生活与思考。',
        },
        {
          rel: 'apple-touch-icon',
          href: '/person/apple-touch-icon.png',
        },
      ],
    }),
}

module.exports = config
