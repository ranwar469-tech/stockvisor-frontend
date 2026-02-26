import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Portfolio from "./pages/Portfolio";
import Community from "./pages/Community";
import News from "./pages/News";
import Tips from "./pages/Tips";
import AccountSettings from "./pages/AccountSettings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useTheme } from "./hooks/useTheme";

function App() {
  // Apply theme at the root so all pages (including login/register) get dark mode
  useTheme();

  return (
    <Routes>
      {/* Public auth routes — no nav/layout wrapper */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Public app routes — no auth required to browse */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="community" element={<Community />} />
        <Route path="news" element={<News />} />
        <Route path="tips" element={<Tips />} />
        <Route path="settings" element={<AccountSettings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
