import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Portfolio from "./pages/Portfolio";
import Community from "./pages/Community";
import News from "./pages/News";
import Tips from "./pages/Tips";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />          
        <Route path="about" element={<About />} />  
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="community" element={<Community />} />
        <Route path="news" element={<News />} />
        <Route path="tips" element={<Tips />} />
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Route>
    </Routes>
  );
}

export default App;
