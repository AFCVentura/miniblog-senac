import axios from "axios";
import React, { useEffect, useState } from "react";

const CreateArticlePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [name, setName] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    const formattedName = title.toLowerCase().replace(" ", "-");
    setName(formattedName);
  }, [title]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title && content) {
      setError("");

      try {
        const res = await axios.post("http://localhost:4000/api/articles", {
          name,
          title,
          content,
        });
      } catch (err) {
        console.error(err);
        setError("Ocorreu um erro ao publicar o artigo");
      } finally {
        setName("");
        setTitle("");
        setContent("");
      }
    }
  };

  return (
    <div>
      <h1>Publique seu artigo!</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Título
          <input type="text" onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          Conteúdo
          <textarea onChange={(e) => setContent(e.target.value)} />
        </label>
        <button type="submit">Criar Artigo</button>
      </form>
      {error || <p className="error">{error}</p>}
    </div>
  );
};

export default CreateArticlePage;
