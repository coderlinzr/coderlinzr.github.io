import "./index.css";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import RootStore from "../../store/root";

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
      }}>
      <div className="left-content">
        <div className="card-title">{title}</div>
        <div className="card-sub-line">
          <div className="date">日期：{date}</div>
          <div className="notes">标签：{tag}</div>
        </div>
      </div>
      <div className="right-content">
        <div className="card-img"></div>
      </div>
    </div>
  );
};

export default Card;