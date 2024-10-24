// Importa a biblioteca do Firebase
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Configurações do seu projeto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCcHk_2S2wt25JHk3JXnXyU0EAP53KslRw",
  authDomain: "blogwender.firebaseapp.com",
  projectId: "blogwender",
  storageBucket: "blogwender.appspot.com",
  messagingSenderId: "671460129586",
  appId: "1:671460129586:web:8903abe0d93a634ad1f52b",
};

//project-825965677733

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Firebase Authentication e o provedor do Google
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Função para autenticação com o Google
export const signInWithGoogle = () => {
  return signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken; // Token de acesso do Google
      const user = result.user; // Informações do usuário
      console.log(user); // Pode ser usado para salvar o usuário no contexto ou back-end
      return { token, user };
    })
    .catch((error) => {
      console.error("Erro na autenticação com o Google: ", error);
      return null;
    });
};
