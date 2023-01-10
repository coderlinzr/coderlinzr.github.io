/*
 * @Author: Zhuoran Lin
 * @Date: 2022-07-28 18:14:31
 * @LastEditors: Zhuoran Lin
 * @LastEditTime: 2023-01-10 15:16:51
 * @Description:
 */
import './index.css';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import RootStore from '../../store/root';

const TAGS_COLOR: any = {
  JavaScript: '#f5dd1e',
  TypeScript: '#166cba',
  default: '#fefefe'
};

const Card = (props: any) => {
  const navigate = useNavigate();
  const root = useContext(RootStore);
  const { title, date, tag, path, index } = props;

  return (
    <div
      className="card-box"
      onClick={() => {
        root.blogUrl = path;
        localStorage.setItem('blogUrl', path);
        navigate(`/blog/${index}`);
      }}
    >
      <div className="show-icon" style={{backgroundColor: Object.keys(TAGS_COLOR).indexOf(tag) === -1 ? TAGS_COLOR.default : TAGS_COLOR[tag]}}>
        <strong>{tag}</strong>
      </div>
      <div className="main-content">
        <div className="card-title">{title}</div>
        <div className="card-sub-line">
          <div className="date">日期：{date}</div>
        </div>
      </div>
    </div>
  );
};

export default Card;
