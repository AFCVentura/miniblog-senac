import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import { db, connectToDb } from "./db.js";

// Configuração inicial do servidor
const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
}

));
app.use(express.json());

// POST: Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await db.collection("users").findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "Email ou senha inválido" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (isPasswordValid) {
    res.status(200).json({ message: "Login efetuado com sucesso" });
  } else {
    res.status(401).json({ message: "Senha ou email inválido(s)" });
  }
});

// POST: Cadastro
app.post("/api/create-account", async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await db.collection("users").findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email já cadastrado" });
  }
  // cria um hash da senha para ser armazenado
  const passwordHash = await bcrypt.hash(password, 10);

  // gravar novo usuário
  await db.collection("users").insertOne({
    username,
    email,
    passwordHash,
  });

  res.status(201).json({ message: "Usuário criado com sucesso" });
});

// POST: Artigos
app.post("/api/articles", async (req, res) => {
  // Extrai os dados que vieram do front-end
  const { name, title, content } = req.body;

  // Verifica se existe um article com esse nome e salva na variável
  const article = await db.collection("articles").findOne({ name });

  // Caso haja um artigo, lança o erro 409 (erro mais apropriado para conflitos desse tipo segundo):
  // Fonte: https://stackoverflow.com/questions/3825990/http-response-code-for-post-when-resource-already-exists#:~:text=The%20409%20(Conflict)%20status%20code,target%20resource%20and%20its%20state.&text=The%20resource%20is%20defined%20by,is%20called%20a%20%22resource%22.
  if (article) {
    res.sendStatus(409);
  } else {
    // Se não existir um artigo, cria um passando os dados do front-end e o valor default para upvotes e comentários
    await db.collection("articles").insertOne({
      name,
      title,
      content,
      upvotes: 0,
      comments: [],
    });

    const newArticle = await db.collection("articles").findOne({ name });
    res.status(201).json(newArticle);
  }
});

// GET: Artigos
app.get("/api/articles", async (req, res) => {
  const articles = await db.collection("articles").find({}).toArray();

  if (articles) {
    res.json(articles);
  } else {
    res.sendStatus(404);
  }
});

// GET: Artigo
app.get("/api/articles/:name", async (req, res) => {
  const { name } = req.params;
  const article = await db.collection("articles").findOne({ name });

  if (article) {
    res.json(article);
  } else {
    res.sendStatus(404);
  }
});

// PUT: Upvotes
app.put("/api/articles/:name/upvote", async (req, res) => {
  const { name } = req.params;
  await db.collection("articles").updateOne(
    { name },
    {
      $inc: { upvotes: 1 },
    }
  );
  const article = await db.collection("articles").findOne({ name });

  if (article) {
    article.upVotes += 1;
    res.send(article);
  } else {
    res.send("Este artigo não existe");
  }
});

// POST: Comentários
app.post("/api/articles/:name/comments", async (req, res) => {
  const { name } = req.params;
  const { postedBy, text } = req.body;

  await db.collection("articles").updateOne(
    { name },
    {
      $push: { comments: { postedBy, text } },
    }
  );
  const article = await db.collection("articles").findOne({ name });

  if (article) {
    res.send(article);
  } else {
    res.send("Este artigo não existe");
  }
});

// Conexão com o banco e inicialização do servidor.
connectToDb(() => {
  console.log("Conectado com sucesso ao MongoDB");
  app.listen(4000, () => {
    console.log("Servidor sendo executado na porta 4000");
  });
});
