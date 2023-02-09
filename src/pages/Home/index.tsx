import "./index.css";
import { CONTENTS, Content } from "../../utils/constants";
import { Card } from "../../components";

const Home = () => {
  
  return (
    <div className="homepage">
      {CONTENTS.sort((a: any, b: any) => new Date(b.date) > new Date(a.date) ? 1 : -1).map((item: Content, index: number) => {
          return (
            <Card
              title={item.title}
              date={item.date}
              tag={item.tag}
              path={item.path}
              index={item.path.slice(10, 14)}
            />
          );
      })}
    </div>
  );
};

export default Home;