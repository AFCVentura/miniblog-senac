// Importa hooks e componentes necessários para a página de artigo
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import NotFoundPage from "./NotFoundPage"; // Exibe uma página de erro caso o artigo não seja encontrado
import CommentList from "../components/CommentList"; // Lista de comentários do artigo
import AddCommentForm from "../components/AddCommentForm"; // Formulário para adicionar novos comentários
import axios from "axios"; // Biblioteca para fazer requisições HTTP

const ArticlePage = () => {
  const apiURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  // Estado para armazenar as informações do artigo (upvotes e comentários)
  const [articleInfo, setArticleInfo] = useState({ upvotes: 0, comments: [] });
  // Estado para armazenar o artigo completo
  const [article, setArticle] = useState(null);
  // Estado para controlar o carregamento dos dados
  const [isLoading, setIsLoading] = useState(true);
  // Estado para lidar com erros, como artigo não encontrado
  const [error, setError] = useState(null);

  // Obtém o parâmetro da URL (o ID do artigo)
  const { articleId } = useParams();

  // Função para carregar os dados do artigo a partir do backend
  useEffect(() => {
    const loadArticleInfo = async () => {
      try {
        // Faz uma requisição para obter os dados do artigo
        const response = await axios.get(
          `${apiURL}/api/articles/${articleId}`
        );
        const newArticleInfo = response.data;
        // Armazena os dados do artigo no estado
        setArticle(newArticleInfo);
        setArticleInfo(newArticleInfo); // Armazena os upvotes e comentários
        setIsLoading(false); // Indica que terminou de carregar
      } catch (error) {
        console.error("Erro ao carregar o artigo:", error);
        setError("Artigo não encontrado.");
        setIsLoading(false);
      }
    };

    // Chama a função de carregamento
    loadArticleInfo();
  }, [articleId]);

  // Função para adicionar um voto ao artigo
  const addUpvote = async () => {
    try {
      // Faz uma requisição PUT para incrementar os votos
      const response = await axios.put(`${apiURL}/api/articles/${articleId}/upvote`);
      const updatedArticle = response.data;
      // Atualiza a contagem de upvotes no estado
      setArticleInfo(updatedArticle);
    } catch (error) {
      console.error("Erro ao atualizar votos:", error);
    }
  };

  // Verifica se o artigo está sendo carregado ou ocorreu um erro
  if (isLoading) return <p>Carregando artigo...</p>;
  if (error) return <NotFoundPage />;

  return (
    <>
      {/* Exibe o título do artigo */}
      <h1>{article.title}</h1>

      {/* Seção de votos */}
      <div className="upvotes-section">
        <button onClick={addUpvote}>Votar</button>
        <p>Este artigo possui {articleInfo.upvotes} votos</p>
      </div>

      {/* Exibe o conteúdo do artigo */}
      {article.content.map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}

      {/* Exibe a lista de comentários */}
      <CommentList comments={articleInfo.comments} />

      {/* Exibe o formulário para adicionar novos comentários */}
      <AddCommentForm
        articleName={articleId}
        onArticleUpdated={(updateArticle) => setArticleInfo(updateArticle)}
      />
    </>
  );
};

export default ArticlePage;
