# Projeto Mini-blog

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white
)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white
)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge
)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white
)
![Firebase](https://img.shields.io/badge/Firebase-F29D0C?style=for-the-badge&logo=firebase&logoColor=white
)


Esse é o projeto de um miniblog que permite a postagem de artigos, bem como comentários e upvotes neles.

## Como executar
O projeto é dividido em duas parte, back-end e front-end, para o sistema funcionar é preciso ter o mongoDB e o Node.js intalados.

### Back-end
Para executar o back-end, é preciso ajustar a URL da conexão no arquivo `db.js` para a URL correspondente ao banco de dados presente na sua máquina (caso não tenha um, é preciso criá-lo). Além disso é preciso instalar as dependências necessárias com o comando `npm i`. Após isso, basta executar o comando `npm run start` para executar no modo normal ou `npm run dev` para executar no modo de desenvolvimento. Se o texto presente nos comandos de console.log() da função connectToDb() do arquivo server.js aparecerem no terminal, o back-end está rodando, a URL do back-end é `http://localhost:4000`

### Front-end
Para executar o front-end, basta repetir o comando `npm i` em outro terminal e depois o comando `npm run dev` para executar a aplicação React. A URL onde ela está executando aparecerá: `http://localhost:5173`.
