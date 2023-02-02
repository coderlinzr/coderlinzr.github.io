interface Content {
  title: string;
  date: string;
  tag: string;
  path: string;
}

export const CONTENTS: Array<Content | {}> = [
  {
    title: "解析 markdown 文件到个人博客搭建",
    date: "2022-07-01",
    tag: "JavaScript",
    path: "/docs/blog0001.md",
  },
  {
    title: "ts 类型挑战（持续更新中）",
    date: "2023-01-09",
    tag: "TypeScript",
    path: "/docs/blog0002.md",
  },
  {
    title: "深入理解ts的infer",
    date: "2023-01-30",
    tag: "TypeScript",
    path: "/docs/blog0003.md",
  }
];
