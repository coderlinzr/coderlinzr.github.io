import "github-markdown-css";
import "./index.css";

import { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { useLocation } from 'react-router-dom';
import { Catalog } from "../../components";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw"; // 支持html

const Blog = observer(() => {
  const location = useLocation();
  const currentPath = String(location.pathname);
  // 存储博文内容
  const [content, setContent] = useState<string>("");

  const changeCurrentArticle = async (url: any) => {
    const res = await fetch(url);
    const content = await res.text();
    setContent(content);
  };

  useEffect(() => {
    let nowBlogPath = `/docs/blog${currentPath.slice(6)}.md`;
    if (nowBlogPath !== localStorage.getItem("blogUrl")) {
      localStorage.setItem("blogUrl", nowBlogPath);
    }
  }, [currentPath]);

  useEffect(() => {
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
    changeCurrentArticle(localStorage.getItem("blogUrl"));
  }, []);  

  // 复制代码
  const copyCode = (text: any) => {
    // 添加后缀
    text += `作者：linzr\n链接： https://coderlinzr.github.io/ \n 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。\n`
    navigator.clipboard.writeText(text).then((res) => {
      // let element = document.getElementById(text);
      // setOpacity(element);
      // setTimeout(() => {
      //   resetOpacity(element);
      // }, 1500)
      const content = document.createElement("div");
      content.classList.add("success-icon-content");
      const icon = document.createElement("div");
      icon.classList.add("success-icon");
      content.appendChild(icon);
      const message = document.createElement("div");
      message.classList.add("message");
      message.appendChild(content);
      const info = document.createElement("span");
      info.innerText = "复制成功！";
      message.appendChild(info);
      document.body.appendChild(message);
    });
  };

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
                <div className="code-content">
                  <div className="copy" onClick={() => copyCode(children[0])}>
                    复制代码
                  </div>
                  <SyntaxHighlighter
                    children={String(children).replace(/\n$/, "")}
                    style={atomOneDark}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  />
                </div>
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
});

export default Blog;
