<h1> 解析 markdown 文件到个人博客搭建 </h1>
市面上有很多将markdown文件转成页面或者个人博客的轻量级网页生成器，鉴于自己在整理总结时也经常md来做结构化梳理，于是萌生了复刻一款类似功能生成器的想法。

### 安装与导入
首先需要将md文件进行解析，这里用到的是react-markdown，能够将markdown字符串解析成react组件，详情可以参考[react-markdown官方文档](https://github.com/remarkjs/react-markdown)。<br/>
```javascript
import React from 'react'
import ReactMarkdown from 'react-markdown'
import ReactDom from 'react-dom'

ReactDom.render(<ReactMarkdown># Hello, *world*!</ReactMarkdown>, document.body)
```
针对组件样式则选用了github-markdown-css，它提供了github风格的md文件通用样式，详情可以参考[github-markdown-css官方文档](https://github.com/sindresorhus/github-markdown-css)。 <br/>
```javascript
// js
import "github-markdown-css";
import "./index.css";

<div className="markdown-body">Hello, world!</div>

// css
.markdown-body {
  box-sizing: border-box;
  height: 95%;
  width: 76%;
  overflow-y: scroll;
  margin: auto;
  padding: 45px;
}
```

### 搭建
#### 读取markdown文件
- 使用 XMLHttpRequest <br/>
XMLHttpRequest（XHR）对象用于与服务器交互。通过 XMLHttpRequest 可以在不刷新页面的情况下请求特定 URL，获取数据。
当然，XMLHttpRequest 可以用于获取任何类型的数据，而不仅仅是 XML。它甚至支持 HTTP 以外的协议（包括 file:// 和 FTP）。
因此可以通过创建的XHR对象来获取存储在本地的md文件。
```javascript
// 用于存储获取的markdown字符串
let content = '';

// 创建XHR对象
var xmlhttp = new XMLHttpRequest();

xmlhttp.onreadystatechange = function () {
  if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
    content = xmlhttp.responseText;
  }
};

// 文件目录在 public/static/test.md 这里不需要写 public 因为在项目打包之后没有此目录。
xmlhttp.open("GET", "/docs/test.md", true);
xmlhttp.send();

// 引入markdown字符串
<ReactMarkdown children={content} />
```
- 使用 fetch() <br/>
fetch()是js中发送网络请求以获取数据的异步函数。
```javascript
// 用于存储获取的markdown字符串
let content = '';

const getMarkdownFile = async (url: string) => {
  const res = await fetch(url);
  return await res.text();
};

content = getMarkdownFile("...");
// 引入markdown字符串
<ReactMarkdown children={content} />
```
#### 插件的使用
- remarkGfm <br/>
支持直接添加下划线，表格，任务列表和url等。
```javascript
import remarkGfm from 'remark-gfm';

const markdown = `Just a link: https://reactjs.com.`;

<ReactMarkdown children={markdown} remarkPlugins={[remarkGfm]} />

```
- rehypeRaw <br/>
由于react-markdown默认忽略html，如果想要在markdown文件中加入一些能够保证安全性不受影响的html，得使用插件rehypeRaw，它能够解析md文件里的html标签。
```javascript
import rehypeRaw from "rehype-raw";

const markdown = `Just a link <br/> <strong>Just a link</strong>`;

<ReactMarkdown children={markdown} rehypePlugins={[rehypeRaw]} />
```

- react-syntax-highlighter <br/>
对md文件中的代码块样式进行调整及美观优化，提供不同的主题色以供选择。
```javascript
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {dark} from 'react-syntax-highlighter/dist/esm/styles/prism'

const markdown = `
Here is some JavaScript code:
~~~js
console.log('It works!')
~~~
`
// 主要对ReactMarkdown标签中components属性的内容进行调整
code({node, inline, className, children, ...props}) {
  const match = /language-(\w+)/.exec(className || '')
  return !inline && match ? (
    // 当匹配到代码块时
    <SyntaxHighlighter
      children={String(children).replace(/\n$/, '')}
      style={dark}
      language={match[1]}
      PreTag="div"
      {...props}
    />
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  )
}
```

#### 目录生成及跳转
为了实现在浏览较长的笔记和文章时根据多级标题进行定位跳转，则需要针对获取到的markdown字符串进行截取匹配‘#’及之后的标题内容以生成目录结构
- 获取目录
```javascript
const getToc = (md: string) => {
  let toc: any = [];
  // 去除HTML中的注释，避免注释中的标题也会被匹配出来
  md = md.replace(/<!--[\w\W\r\n]*?-->/gim, "");
  // 注意每个标题后的换行符
  const reg = /(#+)\s+?(.+?)\n/g;
  let regExecRes = null;
  while ((regExecRes = reg.exec(md))) {
    toc.push({
      level: regExecRes[1].length,
      title: regExecRes[2],
    });
  }

  let maxLevel = 0;
  toc.forEach((t: any) => {
    if (t.level > maxLevel) {
      maxLevel = t.level;
    }
  });
  let stack: any = [];
  for (let i = 0; i < toc.length; i++) {
    const { level } = toc[i];
    // 当栈顶元素的level大于level时不断出栈找到当前元素的同级元素
    while (stack.length && stack[stack.length - 1].level > level) {
      stack.pop();
    }
    if (stack.length === 0) {
      const arr = new Array(maxLevel).fill(0);
      arr[level - 1] += 1;
      stack.push({
        level,
        arr,
      });
      toc[i].listNo = arr.join(".");
    }
    const { arr } = stack[stack.length - 1];
    const newArr = arr.slice();
    newArr[level - 1] += 1;
    stack.push({
      level,
      arr: newArr,
    });
    toc[i].listNo = newArr.join(".");
  }
  const h: any = [];
  toc.forEach((t: any) => {
    const headings = document.querySelectorAll(`h${t.level}`);
    headings.forEach((item: any) => {
      if (item.innerText === t.title) {
        h.push({ ...t, offsetTop: item.offsetTop });
      }
    });
  });

  return h;
};

// 目录h的结构
h = {
  level: 3, // 几级标题 可以转换成h1-h6
  title: "xxxx", // 标题内容
  listNo: "0.0.2.0", // 用于确定标题层级及父子节点的树状结构
  offsetTop: 247 // 距离顶部高度 便于实现跳转
}
```
- 平滑跳转
```javascript
const safeScrollTo = (element: any, top: number, smooth: boolean = true) => {
  if (!element) return;
  if (typeof element.scrollTo === "function") {
    const scrollConfig: any = {
      top,
    };
    if (smooth) {
      scrollConfig.behavior = "smooth";
    }
    element.scrollTo(scrollConfig);
  } else {
    if (element === window) {
      document.documentElement.scrollTop = top;
    } else {
      element.scrollTop = top;
    }
  }
};
```

#### 内容复制
navigator.clipboard是一个只读属性，该属性返回一个可以读写剪切板内容的 Clipboard 对象。在 Web 应用中，Clipboard API 可用于实现剪切、复制、粘贴的功能。
所有 Clipboard API 的方法都是异步的；它们返回一个 Promise 对象，在剪贴板访问完成后被兑现。
```javascript
// 将字符粘贴到剪切板的操作
const copyCode = (text: any) => {
  // 添加后缀
  text += `作者：\n链接：\n来源：\n著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。\n`
  navigator.clipboard.writeText(text).then((res) => {
    const content = document.createElement("div")
    content.classList.add("success-icon-content");
    const icon = document.createElement("div")
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

// 针对markdown标签里代码块的处理需要调整
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
```