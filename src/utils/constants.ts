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
    path: "/docs/test.md",
  },
];
