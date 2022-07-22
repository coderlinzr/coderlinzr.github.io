import "github-markdown-css";
import "./index.css";

import { useContext, useState } from "react";
import { useMount } from "react-use";
import RootStore from "../../store/root";
import {Catalog} from "../../components";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw"; // 支持html

const Blog = () => {
  const root = useContext(RootStore);
  // 存储博文内容
  const [content, setContent] = useState<string>("");

  const changeCurrentArticle = async (url: string) => {
    const res = await fetch(url);
    const content = await res.text();
    setContent(content);
  };

  useMount(() => {
    // var xmlhttp = new XMLHttpRequest();

    // xmlhttp.onreadystatechange = function () {
    //   if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
    //     console.log(xmlhttp.responseText);
    //     setContent(xmlhttp.responseText);
    //   }
    // };
    // // 文件目录在 public/static/test.md 这里不需要写 public 因为打包之后没有此目录。
    // xmlhttp.open("GET", "/docs/test.md", true);
    // xmlhttp.send();
    changeCurrentArticle(root.blogUrl);
  });

  return (
    <div className="blog">
      <div className="content-box">
        <Catalog source={content} />
        <ReactMarkdown
          children={content}
          className="markdown-body"
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  children={String(children).replace(/\n$/, "")}
                  style={atomOneDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                />
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        />
      </div>
    </div>
  );
};

export default Blog;