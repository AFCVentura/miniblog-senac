// Importa o componente Link do React Router, que permite navegação interna sem recarregar a página.
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav>
      {/* Define uma lista de links para navegação entre as páginas */}
      <ul>
        {/* Link para a página inicial */}
        <li>
          <Link to={`/`}>Início</Link>
        </li>

        {/* Link para a página "Sobre" */}
        <li>
          <Link to={`/about`}>Sobre</Link>
        </li>

        {/* Link para a lista de artigos */}
        <li>
          <Link to={`/articlelist`}>Artigos</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
