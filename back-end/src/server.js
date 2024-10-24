// Importações necessárias para configurar o servidor
import express from "express"; // Express é um framework para criar APIs e servidores web.
import { MongoClient } from "mongodb"; // MongoClient é a interface para se conectar ao MongoDB.
import cors from "cors"; // Cors é utilizado para permitir requisições entre diferentes domínios.
import bcrypt from "bcrypt"; // Bcrypt é usado para criptografar senhas.
import { db, connectToDb } from "./db.js"; // Importa a conexão ao banco de dados e a instância do banco.
import jwt from "jsonwebtoken"; // JWT é utilizado para gerar tokens de autenticação.
import { adminJs, adminRouter } from "./admin.js"; // Importa o painel AdminJS e suas rotas configuradas.
import swaggerUi from "swagger-ui-express"; // Swagger UI para a documentação
import swaggerJsdoc from "swagger-jsdoc"; // Swagger-jsdoc para gerar a documentação a partir dos comentários

const app = express(); // Cria uma instância do Express (nossa aplicação web).

// Definindo uma chave secreta para assinar os tokens JWT.
// Use uma chave forte para evitar que os tokens sejam falsificados.
const SECRET_KEY = "fullstackcomnode&reactehd+";

// Configuração do Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Blog API",
      version: "1.0.0",
      description: "Documentação da API do Blog com AdminJS",
    },
    servers: [
      {
        url: "http://localhost:8000", // URL base da API
      },
    ],
  },
  apis: ["./src/server.js"], // Caminho para os arquivos onde as rotas estão definidas
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Configura o CORS para permitir requisições apenas do domínio http://localhost:3000
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// Permite que o Express lide com requisições no formato JSON.
app.use(express.json());

// Middleware para verificar a autenticidade do token JWT.
// Este middleware será utilizado em rotas que precisam de autenticação.
// Ele busca o token no cabeçalho 'Authorization' da requisição, valida-o, e prossegue se o token for válido.
const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  console.log("Authorization Header:", authHeader); // Log para depuração
  const token = authHeader && authHeader.split(" ")[1]; // Obtém o token da requisição.

  if (!token) {
    return res
      .status(401)
      .json({ message: "Acesso negado. Token não fornecido." });
  }

  try {
    // Verifica se o token é válido usando a SECRET_KEY
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified; // Armazena os dados do usuário verificado na requisição
    next(); // Prossegue para a próxima função no ciclo da requisição
  } catch (error) {
    res.status(400).json({ message: "Token inválido." });
  }
};

// Define a rota do painel AdminJS e aplica a autenticação via login e senha.
app.use(adminJs.options.rootPath, adminRouter);

// Rotas relacionadas aos artigos

/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: Retorna todos os artigos
 *     responses:
 *       200:
 *         description: Lista de artigos
 *       404:
 *         description: Nenhum artigo encontrado
 */
// Rota para obter todos os artigos
app.get("/api/articles", async (req, res) => {
  try {
    // Busca todos os artigos no banco de dados
    const articles = await db.collection("articles").find().toArray();

    // Verifica se há artigos e retorna a lista
    if (articles.length > 0) {
      res.json(articles);
    } else {
      res.sendStatus(404); // Caso não existam artigos, retorna status 404
    }
  } catch (error) {
    console.error("Erro ao buscar os artigos:", error);
    res.status(500).json({ message: "Erro ao buscar os artigos" });
  }
});

/**
 * @swagger
 * /api/articles/{name}:
 *   get:
 *     summary: Retorna um artigo específico pelo nome
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         description: Nome do artigo
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dados do artigo
 *       404:
 *         description: Artigo não encontrado
 */
// Rota para obter um artigo específico pelo nome
app.get("/api/articles/:name", async (req, res) => {
  const { name } = req.params; // Obtém o nome do artigo a partir dos parâmetros da URL
  const article = await db.collection("articles").findOne({ name });

  // Verifica se o artigo foi encontrado
  if (article) {
    res.json(article); // Retorna o artigo em formato JSON
  } else {
    res.sendStatus(404); // Caso o artigo não seja encontrado, retorna status 404
  }
});

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login de usuário e geração de token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token JWT gerado
 *       401:
 *         description: Email ou senha inválidos
 */
// Rota para login de usuário e geração de token JWT
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verifica se o usuário existe no banco de dados
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email ou senha inválidos" });
    }

    // Verifica se a senha está correta comparando o hash no banco com a senha fornecida
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email ou senha inválidos" });
    }

    // Gera o token JWT caso a autenticação seja bem-sucedida
    const token = jwt.sign(
      { email: user.email, id: user._id }, // Dados do usuário a serem incluídos no token (payload)
      SECRET_KEY, // Chave secreta para assinar o token
      { expiresIn: "1h" } // Expira em 1 hora
    );

    // Retorna o token para o cliente
    res.status(200).json({ token });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ message: "Erro ao processar a solicitação" });
  }
});

/**
 * @swagger
 * /api/create-account:
 *   post:
 *     summary: Criação de uma nova conta de usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Email já cadastrado
 */
// Rota para criar uma nova conta de usuário
app.post("/api/create-account", async (req, res) => {
  const { username, email, password } = req.body;

  // Verifica se o email já está cadastrado
  const existingUser = await db.collection("users").findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email já cadastrado" });
  }

  // Cria um hash da senha para garantir que a senha não seja armazenada em texto puro
  const passwordHash = await bcrypt.hash(password, 10);

  // Insere o novo usuário no banco de dados
  await db.collection("users").insertOne({
    username,
    email,
    passwordHash,
  });

  // Retorna uma resposta de sucesso
  res.status(201).json({ message: "Usuário criado com sucesso" });
});

/**
 * @swagger
 * /api/articles/{name}/upvote:
 *   put:
 *     summary: Incrementa o número de votos de um artigo
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         description: Nome do artigo
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Número de votos atualizado
 *       404:
 *         description: Artigo não encontrado
 */
// Rota para incrementar o número de votos de um artigo
app.put("/api/articles/:name/upvote", async (req, res) => {
  const { name } = req.params;

  // Atualiza o número de votos do artigo incrementando em 1
  await db.collection("articles").updateOne(
    { name },
    {
      $inc: { upvotes: 1 },
    }
  );
  const article = await db.collection("articles").findOne({ name });

  // Verifica se o artigo foi encontrado e retorna o número de votos atualizado
  if (article) {
    article.upVotes += 1;
    res.send(`O artigo ${name} agora possui ${article.upvotes} votos!`);
  } else {
    res.send("Este artigo não existe");
  }
});

/**
 * @swagger
 * /api/articles/{name}/comments:
 *   post:
 *     summary: Adiciona um comentário a um artigo (necessita de autenticação)
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         description: Nome do artigo
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postedBy:
 *                 type: string
 *               text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comentário adicionado com sucesso
 *       404:
 *         description: Artigo não encontrado
 *       401:
 *         description: Falha na autenticação
 */
// Rota para adicionar comentários a um artigo (necessita de autenticação)
app.post("/api/articles/:name/comments", verifyToken, async (req, res) => {
  const { name } = req.params;
  const { postedBy, text } = req.body;

  // Adiciona um novo comentário ao artigo
  await db.collection("articles").updateOne(
    { name },
    {
      $push: { comments: { postedBy, text } },
    }
  );
  const article = await db.collection("articles").findOne({ name });

  // Verifica se o artigo foi encontrado e retorna os comentários atualizados
  if (article) {
    res.send(article.comments);
  } else {
    res.send("Este artigo não existe");
  }
});

// Função para criar um usuário administrador master para o primeiro acesso ao painel AdminJS
const createMasterUser = async () => {
  const masterEmail = "master@admin.com";
  const existingMaster = await db
    .collection("adminusers")
    .findOne({ email: masterEmail });

  // Se o usuário master ainda não existir, cria um novo
  if (!existingMaster) {
    const passwordHash = await bcrypt.hash("masterpassword", 10);

    // Insere o usuário master no banco de dados
    await db.collection("adminusers").insertOne({
      username: "master",
      email: masterEmail,
      passwordHash,
      role: "superadmin",
    });

    console.log("Usuário master criado com sucesso.");
  }
};

// Conecta ao banco de dados e inicia o servidor
connectToDb(() => {
  console.log("Conectado com sucesso ao MongoDB");
  createMasterUser(); // Cria o usuário master se necessário
  app.listen(8000, () => {
    console.log("Servidor sendo executado na porta 8000");
  });
});
