// Importa o componente Link do React Router, que permite navegação interna sem recarregar a página
import { Link } from "react-router-dom";

// Definição do componente ArticleList, que recebe uma lista de artigos como propriedade
const ArticleList = ({ articles }) => {
  return (
    <>
      {/* Mapeia e renderiza cada artigo como um link */}
      {articles.map((article) => (
        <Link
          key={article.name}
          className="article-list-item"
          to={`/articlelist/${article.name}`}
        >
          <h1>{article.title}</h1>
          {/* Exibe o início do conteúdo do artigo */}
          <p>{article.content[0].substring(0, 150)}...</p>
        </Link>
      ))}
    </>
  );
};

export default ArticleList;
