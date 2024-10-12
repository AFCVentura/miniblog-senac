import { Link } from "react-router-dom";

const ArticleList = ({ articles }) => {
  return (
    <>
      {articles.map((article) => (
        <Link
          key={article.name}
          className="article-list-item"
          to={`/articlelist/${article.name}`}
        >
          <h1>{article.title}</h1>
          <h3>{article.upvotes} upvotes - {article.comments.length} comentários</h3>
          <p>{article.content.substring(0, 150)}...</p>
        </Link>
      ))}
    </>
  );
};

export default ArticleList;
