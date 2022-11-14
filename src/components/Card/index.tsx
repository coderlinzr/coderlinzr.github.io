/*
 * @Author: Zhuoran Lin
 * @Date: 2022-07-28 18:14:31
 * @LastEditors: Zhuoran Lin
 * @LastEditTime: 2022-11-14 14:17:17
 * @Description:
 */
import './index.css';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import RootStore from '../../store/root';

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
      <div className={tag === 'JavaScript' ? 'show-icon javascript-tag' : 'show-icon'}>
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
