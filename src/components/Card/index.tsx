import './index.css';
import { useNavigate } from 'react-router-dom';

const TAGS_COLOR: any = {
  JavaScript: '#f5dd1e',
  TypeScript: '#166cba',
  default: '#eeeff1'
};

const Card = (props: any) => {
  const navigate = useNavigate();
  const { title, date, tag, path, index } = props;

  return (
    <div
      className="card-box"
      onClick={() => {
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
