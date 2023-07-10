import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  "/",
  {
    text: "目录",
    icon: "edit",
    prefix: "/posts/",
    children: [
      {
        text: "生活",
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
        icon: "code",
        link: "Scribble/",
      },
    ],
  },
]);
