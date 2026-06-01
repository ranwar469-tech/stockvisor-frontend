import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Portfolio from "./pages/Portfolio";
import Community from "./pages/Community";
import DiscussionThread from "./pages/DiscussionThread";
import News from "./pages/News";
import Tips from "./pages/Tips";
import AccountSettings from "./pages/AccountSettings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import { useTheme } from "./hooks/useTheme";

function App() {
  useTheme();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="community" element={<Community />} />
        <Route path="community/threads/:threadId" element={<DiscussionThread />} />
        <Route path="news" element={<News />} />
        <Route path="tutorials" element={<Tips />} />
        <Route path="settings" element={<AccountSettings />} />
        <Route
          path="admin"
          element={(
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          )}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
