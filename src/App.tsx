import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Nav } from "./components";
import Home from './pages/Home';
import Blog from './pages/Blog';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/blog/:id' element={<Blog />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
