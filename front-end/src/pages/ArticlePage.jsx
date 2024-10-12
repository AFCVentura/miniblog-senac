import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import articles from "../article-content";
import NotFoundPage from "./NotFoundPage";
import CommentList from "../components/CommentList";
import AddCommentForm from "../components/AddCommentForm";
import axios from "axios";

const ArticlePage = () => {
  const [articleInfo, setArticleInfo] = useState({});
  const { articleId } = useParams();
  console.log(articleId);

  useEffect(() => {
    const loadArticleInfo = async () => {
      const response = await axios.get(
        `http://localhost:4000/api/articles/${articleId}`
      );
      const newArticleInfo = response.data;
      if (!newArticleInfo) {
        return <NotFoundPage />;
      }
      setArticleInfo(newArticleInfo);
    };

    loadArticleInfo();
  }, [articleId]);

  const addUpvote = async () => {
    const response = await axios.put(
      `http://localhost:4000/api/articles/${articleId}/upvote`
    );
    const updateArticle = response.data;
    setArticleInfo(updateArticle);
  };

  return (
    <>
      <h1>{articleInfo.title}</h1>
      <div className="upvotes-section">
        <button onClick={addUpvote}>Votar</button>
        <p>Este artigo possui {articleInfo.upvotes} votos</p>
      </div>

      <p>{articleInfo.content}</p>

      <AddCommentForm
        articleName={articleId}
        onArticleUpdated={(updateArticle) => setArticleInfo(updateArticle)}
      />
      <CommentList comments={articleInfo.comments ?? []} />
    </>
  );
};

export default ArticlePage;
