import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  "/",
  {
    text: "目录",
    icon: "list",
    prefix: "/posts/",
    children: [
      {
        text: "记录",
        icon: "edit",
        link: "Life/",
      },
      {
        text: "技术",
        icon: "code",
        link: "Tech/",
      },
      {
        text: "随想",
        icon: "write",
        link: "Scribble/",
      },
      {
        text: "翻译",
        icon: "repo",
        link: "Translate/",
      }
    ],
  },
]);
