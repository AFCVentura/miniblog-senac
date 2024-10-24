// Importa o arquivo de estilo principal do aplicativo.
import "./App.css";

// Importa componentes necessários do React Router para lidar com rotas no front-end.
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importa as páginas que compõem o aplicativo.
import HomePage from "./pages/HomePage";
import ArticlePage from "./pages/ArticlePage";
import ArticlesListPage from "./pages/ArticlesListPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import CreateAccountPage from "./pages/CreateAccountPage";
import PrivateRoute from "./components/PrivateRoute";

// Importa o componente NavBar para a navegação do site.
import NavBar from "./components/Navbar";

function App() {

  return (
    <>
      {/* Configura o React Router para gerenciar a navegação entre as páginas do aplicativo */}
      <BrowserRouter>
        <div>
          {/* Renderiza a barra de navegação em todas as páginas */}
          <NavBar />

          {/* Configura as rotas que serão acessíveis pelo usuário */}
          <div id="page-body">
            <Routes>
              {/* Define a rota principal (home) */}
              <Route path={`/`} element={<HomePage />} />

              {/* Define a rota da página "Sobre" */}
              <Route path={`/about`} element={<AboutPage />} />

              {/* Define a rota para a lista de artigos */}
              <Route
                path={`/articlelist`}
                element={<ArticlesListPage />}
              />

              {/* Define a rota para exibir um artigo específico com base no ID */}
              <Route
                path={`/articlelist/:articleId`}
                element={<ArticlePage />}
              />

              {/* Define a rota para a página de login */}
              <Route path={`/login`} element={<LoginPage />} />

              {/* Define a rota para a página de criação de nova conta */}
              <Route
                path={`/newaccount`}
                element={<CreateAccountPage />}
              />
              <Route
                path={`/dashboard`}
                element={
                  <PrivateRoute>
                    <ArticlesListPage />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
