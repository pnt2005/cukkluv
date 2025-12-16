import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar/Navbar.jsx";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import PostPage from "./pages/PostPage/PostPage";
import RecipesPage from "./pages/RecipesPage/RecipesPage.jsx";
import RecipesDetail from "./pages/RecipesPage/RecipesDetail.jsx";
import Footer from "./components/Navbar/Footer.jsx";
import "react-toastify/dist/ReactToastify.css";

const LayoutWithFooter = ({ children }) => (
  <>
    {children}
    <Footer />
  </>
);

function App() {
  return (
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/posts" element={<PostPage />} />
          <Route path="/" element={<LayoutWithFooter><HomePage /></LayoutWithFooter>} />
          <Route path="/recipes" element={<LayoutWithFooter><RecipesPage /></LayoutWithFooter>} />
          <Route path="/recipes/:id" element={<LayoutWithFooter><RecipesDetail /></LayoutWithFooter>} />
          <Route path="/posts" element={<LayoutWithFooter><PostPage /></LayoutWithFooter>} />
          <Route path="/recipes" element={<LayoutWithFooter><RecipesPage /></LayoutWithFooter>} />
          <Route path="/recipes/:id" element={<LayoutWithFooter><RecipesDetail /></LayoutWithFooter>} />
        </Routes>

        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      </Router>
  );
}

export default App;

 
