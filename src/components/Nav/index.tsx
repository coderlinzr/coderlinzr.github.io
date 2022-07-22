import "./index.css";

const Nav = () => {
  return (
    <div className="nav">
      <div className="avatar" />
      <div className="nav-bar-titles">
        <div className="nav-title">
          <a href="/">HOME</a>
        </div>
        <div className="nav-title">
          <a href="/">ABOUT</a>
        </div>
      </div>
    </div>
  );
};

export default Nav;