// Importa os hooks e bibliotecas necessárias
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Para redirecionamento de página

// Definição do componente AddCommentForm, que recebe o nome do artigo e uma função callback para atualizar o artigo
const AddCommentForm = ({ articleName, onArticleUpdated }) => {
  const apiURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  // Estados para armazenar o nome do usuário e o texto do comentário
  const [name, setName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState("");

  // Hook do React Router para navegação
  const navigate = useNavigate();

  // Função para adicionar um comentário
  const addComment = async () => {
    const token = localStorage.getItem("token"); // Verifica se o usuário está logado

    // Se o usuário não estiver logado, redireciona para a página de login
    if (!token) {
      setError("Você precisa estar logado para adicionar um comentário.");
      navigate(`$/login`);
      return;
    }

    try {
      // Faz uma requisição POST para adicionar o comentário ao artigo
      const response = await axios.post(
        `${apiURL}/api/articles/${articleName}/comments`,
        {
          postedBy: name,
          text: commentText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Envia o token JWT no cabeçalho
          },
        }
      );

      const updatedArticle = response.data;
      onArticleUpdated(updatedArticle); // Atualiza a lista de comentários
      setName(""); // Limpa o campo de nome
      setCommentText(""); // Limpa o campo de comentário
    } catch (error) {
      setError(`Erro ao adicionar comentário. ${error}`);
    }
  };

  return (
    <div id="add-comment-form">
      <h3>Adicione um comentário</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Campo para o nome do usuário */}
      <label>
        Nome:
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
        />
      </label>

      {/* Campo para o texto do comentário */}
      <label>
        Comentário:
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          rows="4"
        />
      </label>

      {/* Botão para adicionar o comentário */}
      <button onClick={addComment}>Adicione seu comentário</button>
    </div>
  );
};

export default AddCommentForm;
