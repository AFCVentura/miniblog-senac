// Importa os hooks e bibliotecas necessários
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Navegação e links internos
import axios from "axios"; // Para fazer requisições HTTP

const CreateAccountPage = () => {
  const apiURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  // Estados para armazenar os dados do formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUserName] = useState("");
  const [error, setError] = useState("");

  // Hook do React Router para navegar para a página de login
  const navigate = useNavigate();

  // Função para criar uma nova conta
  const createAccount = async () => {
    // Verifica se as senhas coincidem
    if (password !== confirmPassword) {
      setError("As senhas não conferem");
      return;
    }

    try {
      // Faz a requisição para criar a conta
      const response = await axios.post(`${apiURL}/api/create-account`, {
        username,
        email,
        password,
      });

      // Se a criação for bem-sucedida, redireciona para a página de login
      if (response.status === 201) {
        navigate(`/login`);
      } else {
        setError("Falha ao criar a conta");
      }
    } catch (error) {
      setError("Falha ao criar a conta");
    }
  };

  return (
    <div id="userform">
      <h1>Criar uma nova conta</h1>
      {/* Exibe a mensagem de erro, se houver */}
      {error && <p>{error}</p>}

      {/* Campos do formulário */}
      <input
        type="text"
        placeholder="Nome do usuário"
        value={username}
        onChange={(e) => setUserName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Informe seu email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Informe a senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirme a senha"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      {/* Botão para enviar o formulário */}
      <button onClick={createAccount}>Criar uma nova conta</button>

      {/* Link para o login */}
      <Link to="/login">Já possui uma conta? Clique aqui</Link>
    </div>
  );
};

export default CreateAccountPage;
