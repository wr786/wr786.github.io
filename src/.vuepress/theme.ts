import { hopeTheme } from "vuepress-theme-hope";
import { zhNavbar } from "./navbar/index.js";
import { zhSidebar } from "./sidebar/index.js";
import { getDirname, path } from "@vuepress/utils";

const __dirname = getDirname(import.meta.url);

export default hopeTheme({
  hostname: "https://wr786.github.io",

  author: {
    name: "wr786",
    url: "https://wr786.github.io",
  },

  iconAssets: "iconfont",

  logo: "/logo.png",

  repo: "wr786/wr786.github.io",

  docsDir: "src",

  blog: {
    medias: {
      BiliBili: "https://space.bilibili.com/1898891",
      Email: "mailto:wr786@pku.edu.cn",
      GitHub: "https://github.com/wr786",
      Steam: "https://steamcommunity.com/id/wr786",
      Bangumi: [
        "https://bgm.tv/user/wr786", 
        path.resolve(__dirname, "public/bangumi.svg"),
      ],
    },
  },

  locales: {
    "/": {
      // navbar
      navbar: zhNavbar,

      // sidebar
      sidebar: zhSidebar,

      footer: "分享明天",

      displayFooter: true,

      blog: {
        description: "飄逸なEGOIST",
        intro: "/intro.html",
      },

      metaLocales: {
        editLink: "编辑此页",
      },
    },
  },

  plugins: {
    blog: true,

    comment: {
      // @ts-expect-error: You should generate and use your own comment service
      provider: "Giscus",
      comment: true, //启用评论功能
      repo: "wr786/wr786.github.io", //远程仓库
      repoId: "R_kgDOJUK89A", //对应自己的仓库Id
      category: "Announcements",
      categoryId: "DIC_kwDOJUK89M4CVoKO" //对应自己的分类Id
    },

    copyright: {
      // 全局启用版权信息
      global: true,
      // 禁用复制
      disableCopy: false,
      // 版权信息
      license: "CC BY-NC-SA 4.0",
    },

    // all features are enabled for demo, only preserve features you need here
    mdEnhance: {
      align: true,
      attrs: true,
      chart: true,
      codetabs: true,
      demo: true,
      echarts: true,
      figure: true,
      flowchart: true,
      gfm: true,
      imgLazyload: true,
      imgSize: true,
      include: true,
      katex: true,
      mark: true,
      mermaid: true,
      playground: {
        presets: ["ts", "vue"],
      },
      presentation: {
        plugins: ["highlight", "math", "search", "notes", "zoom"],
      },
      stylize: [
        {
          matcher: "Recommended",
          replacer: ({ tag }) => {
            if (tag === "em")
              return {
                tag: "Badge",
                attrs: { type: "tip" },
                content: "Recommended",
              };
          },
        },
      ],
      sub: true,
      sup: true,
      tabs: true,
      vPre: true,
      vuePlayground: true,
    },

    // uncomment these if you want a PWA
    // pwa: {
    //   favicon: "/favicon.ico",
    //   cacheHTML: true,
    //   cachePic: true,
    //   appendBase: true,
    //   apple: {
    //     icon: "/assets/icon/apple-icon-152.png",
    //     statusBarColor: "black",
    //   },
    //   msTile: {
    //     image: "/assets/icon/ms-icon-144.png",
    //     color: "#ffffff",
    //   },
    //   manifest: {
    //     icons: [
    //       {
    //         src: "/assets/icon/chrome-mask-512.png",
    //         sizes: "512x512",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-mask-192.png",
    //         sizes: "192x192",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //     ],
    //     shortcuts: [
    //       {
    //         name: "Demo",
    //         short_name: "Demo",
    //         url: "/demo/",
    //         icons: [
    //           {
    //             src: "/assets/icon/guide-maskable.png",
    //             sizes: "192x192",
    //             purpose: "maskable",
    //             type: "image/png",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // },
  },
});
