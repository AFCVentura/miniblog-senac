// Importa os hooks e bibliotecas necessários
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Navegação e links internos
import axios from "axios"; // Para fazer requisições HTTP
import { signInWithGoogle } from "../firebase"; // Importa a função de login com Google

const LoginPage = () => {
  const apiURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  // Estados para armazenar os dados do formulário de login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Hook do React Router para navegação
  const navigate = useNavigate();

  // Função para o login com Google
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle(); // Chama a função de login com Google
      if (result) {
        const { user, token } = result;
        localStorage.setItem("token", token); // Armazena o token no localStorage
        console.log("Usuário logado com Google:", user);
        navigate(`/`); // Redireciona para a página principal após o login
      } else {
        setError("Falha ao fazer login com o Google");
      }
    } catch (err) {
      console.error("Erro no login com Google:", err);
      setError("Erro ao fazer login com o Google");
    }
  };

  // Função para realizar o login
  const logIn = async () => {
    try {
      // Faz a requisição para o backend para fazer login
      const response = await axios.post(`${apiURL}/api/login`, {
        email,
        password,
      });

      // Verifica se o login foi bem-sucedido
      if (response.status === 200) {
        const { token } = response.data; // Supondo que o backend retorna um token JWT
        localStorage.setItem("token", token); // Armazena o token no localStorage
        navigate(`/`); // Redireciona para a página inicial
      } else {
        setError("Email ou senha inexistentes");
      }
    } catch (error) {
      setError("Falha ao tentar realizar o login");
    }
  };

  return (
    <>
      <div id="userform">
        <h1>Log In</h1>
        {/* Exibe a mensagem de erro, se houver */}
        {error && <p>{error}</p>}

        {/* Campos do formulário de login */}
        <input
          type="email"
          placeholder="Informe o seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Informe a senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Botão para enviar o formulário de login */}
        <button onClick={logIn}>Logar no sistema</button>

        {/* Botão de login com Google */}
        <button onClick={handleGoogleLogin} style={{ marginTop: "10px" }}>
          Login com Google
        </button>

        {/* Link para criar uma nova conta */}
        <Link to={`/newaccount`}>Não possui uma conta ainda? Crie agora</Link>
      </div>
    </>
  );
};

export default LoginPage;
