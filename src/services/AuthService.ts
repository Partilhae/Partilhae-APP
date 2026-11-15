import { JavaAPI } from "./API/JavaAPI";
import { LoginResponse, UsuarioLogado } from "../types/Auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE_USUARIO_LOGADO = "@partilhae_usuario_logado";

export async function logarUsuario(
  email: string,
  senha: string,
): Promise<UsuarioLogado | null> {
  try {
    const { data } = await JavaAPI.post<LoginResponse>("/auth/login", {
      email: email.trim().toLowerCase(),
      senha,
    });

    const usuarioLogado: UsuarioLogado = {
      token: data.token,
      tipoToken: data.tipoToken,
      idUsuario: data.idUsuario,
      idDoador: data.idDoador,
      idReceptor: data.idReceptor,
      nomeUsuario: data.nomeUsuario,
      email: data.email,
      role: data.role,
    };

    await AsyncStorage.setItem(
      CHAVE_USUARIO_LOGADO,
      JSON.stringify(usuarioLogado),
    );

    return usuarioLogado;
  } catch (error) {
    console.log("Erro ao realizar login:", error);

    return null;
  }
}

export async function buscarUsuarioLogado(): Promise<UsuarioLogado | null> {
  try {
    const dados = await AsyncStorage.getItem(CHAVE_USUARIO_LOGADO);

    if (!dados) {
      return null;
    }

    return JSON.parse(dados) as UsuarioLogado;
  } catch (error) {
    console.log("Erro ao buscar usuário logado:", error);

    return null;
  }
}

export async function logoutUsuario(): Promise<void> {
  try {
    await AsyncStorage.removeItem(CHAVE_USUARIO_LOGADO);
  } catch (error) {
    console.log("Erro ao realizar logout:", error);
    throw error;
  }
}
