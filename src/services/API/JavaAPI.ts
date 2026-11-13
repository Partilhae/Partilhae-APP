import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const JavaAPI = axios.create({
  baseURL: "https://javachallenge.onrender.com",
});

JavaAPI.interceptors.request.use(async (config) => {
  const dados = await AsyncStorage.getItem("@partilhae_usuario_logado");

  if (dados) {
    const usuario = JSON.parse(dados) as {
      token: string;
      tipoToken: string;
    };
    config.headers.Authorization = `${usuario.tipoToken} ${usuario.token}`;
  }

  return config;
});

export { JavaAPI };
