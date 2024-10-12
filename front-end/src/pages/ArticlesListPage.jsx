import { useEffect, useState } from "react";
import ArticleList from "../components/ArticleList";
import axios from "axios";
import CreateArticle from "../components/CreateArticle";
import { Link } from "react-router-dom";

const ArticlesListPage = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const getArticles = async () => {
      const res = await axios.get("http://localhost:4000/api/articles");
      const data = res.data;
      setArticles(data);
    }
    getArticles();
  }, []) 


  return (
    <>
      <Link
      className="link"
      to="/articlelist/create"
      >Publique seu artigo!</Link>
      <h2>Confira os artigos</h2>
      <ArticleList articles={articles} />
    </>
  );
};

export default ArticlesListPage;
