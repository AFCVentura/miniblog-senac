import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ArticlePage from "./pages/ArticlePage";
import ArticlesListPage from "./pages/ArticlesListPage";
import AboutPage from "./pages/AboutPage";
import NavBar from "./components/Navbar";
import CreateArticlePage from "./pages/CreateArticlePage";

function App() {
  return (
    <>
      <BrowserRouter>
        <div>
          <NavBar />
          <div id="page-body">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/articlelist" element={<ArticlesListPage />} />
              <Route path="/articlelist/:articleId" element={<ArticlePage />} />
              <Route path="/articlelist/create" element={<CreateArticlePage />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
