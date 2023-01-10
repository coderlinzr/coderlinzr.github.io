import "./index.css";
import { CONTENTS } from "../../utils/constants";
import { Card } from "../../components";

const Home = () => {
  
  return (
    <div className="homepage">
      {CONTENTS.sort((a: any, b: any) => new Date(b.date) > new Date(a.date) ? 1 : -1).map((item: any, index: number) => {
        return (
          <Card
            title={item.title}
            date={item.date}
            tag={item.tag}
            path={item.path}
            index={`${index + 1}`.padStart(5, "0")}
          />
        );
      })}
    </div>
  );
};

export default Home;