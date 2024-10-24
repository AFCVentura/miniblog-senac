// Importa hooks de estado e efeito do React
import { useState, useEffect } from "react";
// Importa o axios, uma biblioteca para fazer requisições HTTP
import axios from "axios";
// Importa o componente ArticleList, que renderiza a lista de artigos
import ArticleList from "../components/ArticleList";

const ArticlesListPage = () => {
   const apiURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;

  // Estado para armazenar os artigos
  const [articles, setArticles] = useState([]);
  // Estado para indicar se os artigos estão sendo carregados
  const [isLoading, setIsLoading] = useState(true);
  // Estado para armazenar possíveis erros
  const [error, setError] = useState(null);

  // Função assíncrona para buscar os artigos do backend
  const fetchArticles = async () => {
    try {
      // Faz a requisição GET para o backend para obter os artigos
      const response = await axios.get(`${apiURL}/api/articles`); // Altere para o endpoint correto
      // Atualiza o estado com os artigos recuperados
      setArticles(response.data);
      // Indica que o carregamento foi concluído
      setIsLoading(false);
    } catch (error) {
      // Em caso de erro, atualiza o estado para refletir o erro
      console.error("Erro ao buscar os artigos:", error);
      setError("Erro ao buscar os artigos");
      setIsLoading(false);
    }
  };

  // useEffect é usado para carregar os artigos ao montar o componente
  useEffect(() => {
    fetchArticles(); // Chama a função de busca ao montar o componente
  }, []); // A dependência vazia garante que a função seja chamada apenas uma vez

  // Renderiza uma mensagem de carregamento ou erro, se aplicável
  if (isLoading) return <p>Carregando artigos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <h1>Confira os artigos</h1>
      {/* Passa os artigos recuperados para o componente ArticleList */}
      <ArticleList articles={articles} />
    </>
  );
};

export default ArticlesListPage;
