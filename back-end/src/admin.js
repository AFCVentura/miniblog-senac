// Importa o AdminJS e outros módulos necessários
import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express"; // Middleware para integração do AdminJS com o Express
import * as AdminJSMongoose from "@adminjs/mongoose"; // Adaptador para conectar o AdminJS ao MongoDB via Mongoose
import mongoose from "mongoose"; // Módulo para manipulação de dados no MongoDB
import bcrypt from "bcrypt"; // Biblioteca para hash de senhas (segurança)
import jwt from "jsonwebtoken"; // Biblioteca para geração de tokens de autenticação

// Conexão com o MongoDB
// Aqui conectamos à base de dados MongoDB utilizando a URL 'mongodb://localhost:27017/blogDatabase'.
// O useNewUrlParser e useUnifiedTopology são parâmetros que garantem uma conexão mais estável e compatível com as novas versões do MongoDB.
mongoose.connect("mongodb://localhost:27017/blogDatabase", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Registra o adaptador do Mongoose no AdminJS para facilitar a integração
// O AdminJS precisa de um adaptador para gerenciar os recursos do MongoDB.
// O adaptador AdminJSMongoose serve como "ponte" entre o AdminJS e o Mongoose.
AdminJS.registerAdapter(AdminJSMongoose);

// Modelo de Administrador
// Criamos um schema no MongoDB para os usuários administradores. Um schema é basicamente uma "estrutura" que define os dados.
// Aqui temos os campos: username (nome de usuário), email (email único), passwordHash (hash da senha), e role (papel do usuário, por exemplo, admin).
// A senha é armazenada como um hash para aumentar a segurança.
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Email único para cada usuário administrador
  passwordHash: { type: String, required: true }, // A senha será armazenada como um hash
  role: { type: String, default: "admin" }, // Define o papel do usuário (por padrão, 'admin')
});

// Modelo de dados de AdminUser, que é usado para criar e buscar administradores no banco
const AdminUser = mongoose.model("AdminUser", adminSchema);

// Função para autenticar o administrador
// Essa função recebe o email e a senha do usuário que tenta se logar. Primeiro, ela busca o email no banco de dados.
// Se o email existir, a função compara a senha informada com o hash da senha no banco, utilizando a biblioteca bcrypt.
// Se a comparação for bem-sucedida, o usuário é autenticado.
const authenticateAdmin = async (email, password) => {
  // Busca o administrador no banco de dados através do email
  const adminUser = await AdminUser.findOne({ email });

  // Caso o usuário não exista no banco, retorna falso
  if (!adminUser) {
    return false;
  }

  // Verifica se a senha é válida comparando o hash armazenado com a senha fornecida
  const isPasswordValid = await bcrypt.compare(
    password,
    adminUser.passwordHash
  );
  return isPasswordValid ? adminUser : false; // Retorna o administrador se a senha for correta, senão retorna falso
};

// Configurações do AdminJS
// Aqui configuramos os recursos que serão gerenciados no painel de administração do AdminJS.
// Temos dois recursos principais: 'User' (usuários) e 'Article' (artigos).
// Para cada recurso, definimos quais campos aparecerão no painel, e as ações disponíveis (criar, editar, deletar).
const adminJs = new AdminJS({
  resources: [
    {
      // Configuração do recurso 'User', que lida com usuários no sistema
      resource: mongoose.model(
        "User",
        new mongoose.Schema({
          username: String,
          email: String,
          passwordHash: String,
        })
      ),
      options: {
        navigation: "Gerenciamento de Usuários", // Define onde esse recurso aparece no menu de navegação
        listProperties: ["username", "email"], // Campos exibidos na lista de usuários
        actions: {
          new: { isVisible: true }, // Permitir a criação de novos usuários
          edit: { isVisible: true }, // Permitir a edição de usuários
          delete: { isVisible: true }, // Permitir a exclusão de usuários
        },
      },
    },
    {
      // Configuração do recurso 'Article', que lida com artigos no sistema
      resource: mongoose.model(
        "Article",
        new mongoose.Schema({
          name: String,
          title: String,
          content: [String],
          upvotes: Number,
          comments: [{ postedBy: String, text: String }],
        })
      ),
      options: {
        navigation: "Gerenciamento de Artigos", // Define onde esse recurso aparece no menu de navegação
        listProperties: ["name", "title", "content", "upvotes"], // Campos exibidos na lista de artigos
        actions: {
          new: { isVisible: true }, // Permitir a criação de novos artigos
          edit: { isVisible: true }, // Permitir a edição de artigos
          delete: { isVisible: true }, // Permitir a exclusão de artigos
        },
      },
    },
  ],
  rootPath: "/admin", // Define a rota onde o painel AdminJS estará disponível (/admin)
});

// Configuração do middleware para autenticação no painel de administração
// A função buildAuthenticatedRouter gera uma rota protegida por autenticação.
// Quando alguém tenta acessar o painel, o AdminJS pedirá o email e a senha.
// Se a autenticação for bem-sucedida (usando a função authenticateAdmin), o usuário poderá acessar o painel.
const adminRouter = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
  authenticate: async (email, password) => {
    const admin = await authenticateAdmin(email, password);
    // Se a autenticação for bem-sucedida, retorna as informações do administrador
    return admin ? { email: admin.email, role: admin.role } : null;
  },
  cookiePassword: "cookie-with-secret", // Defina uma senha secreta forte para garantir a segurança do cookie de sessão
});

// Exporta as configurações do AdminJS e a rota para uso em outros arquivos
export { adminJs, adminRouter };
