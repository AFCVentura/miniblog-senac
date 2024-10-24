// Importa o hook useState do React para gerenciar o estado do componente
import { useState } from "react";

// Definição do componente CommentList, que recebe a lista de comentários como propriedade
const CommentList = ({ comments }) => {
  // Estado para armazenar o índice do comentário atual exibido
  const [currentIndex, setCurrentIndex] = useState(0);

  // Função para avançar para o próximo comentário
  const nextComment = () => {
    if (currentIndex < comments.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Função para retroceder para o comentário anterior
  const prevComment = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Caso não existam comentários, exibe uma mensagem
  if (!comments || comments.length === 0) {
    return <p>Nenhum comentário ainda.</p>;
  }

  return (
    <div className="comment-list">
      <h3>Comentários</h3>

      {/* Exibe o comentário atual */}
      <div className="comment-item">
        <h4>{comments[currentIndex].postedBy}</h4>
        <p>{comments[currentIndex].text}</p>
      </div>

      {/* Controles de navegação para os comentários */}
      <div className="pagination-controls">
        <button onClick={prevComment} disabled={currentIndex === 0}>
          &#8592;
        </button>
        <span>
          {currentIndex + 1} de {comments.length}
        </span>
        <button
          onClick={nextComment}
          disabled={currentIndex === comments.length - 1}
        >
          &#8594;
        </button>
      </div>
    </div>
  );
};

export default CommentList;
