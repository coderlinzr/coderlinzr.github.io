import "./index.css";
import { useState, useEffect } from "react";

interface Menu {
  level: number;
  title: string;
  listNo: string;
  offsetTop: number | null;
}

interface Props {
  source: string;
}

const Catalog = (props: Props) => {
  const { source } = props;
  const [menuTree, setMenuTree] = useState<Menu[]>([]);
  const [selectedMenuId, setSelectedMenuId] = useState<string>('');

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
    setMenuTree(h);
    setSelectedMenuId(h[0] ? `${h[0].listNo}-${h[0].offsetTop}` : '')
  };

  useEffect(() => {
    getToc(source);
  }, [source])

  // 平滑页内跳转
  const safeScrollTo = (element: any, top: any, smooth: boolean = true) => {
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

  return (
    <div className="catalog">
      {menuTree.length
        ? menuTree.map((item: Menu, index: number) => {
            return (
              <div
                key={index}
                className={`catalog-title title-level${item.level} ${
                  selectedMenuId === `${item.listNo}-${item.offsetTop}` ? "active" : ""
                }`}
                onClick={() => {
                  setSelectedMenuId(`${item.listNo}-${item.offsetTop}`);
                  safeScrollTo(
                    document.getElementsByClassName("markdown-body")[0],
                    item.offsetTop && item.offsetTop - 96
                  );
                }}>
                {item.title}
              </div>
            );
          })
        : null}
    </div>
  );
};

export default Catalog;
