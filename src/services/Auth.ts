import { Alert } from "react-native";
import { CadastroDoador } from "../types/Doador";
import { JavaAPI } from "./API/JavaAPI";
import { CadastroBeneficiario } from "../types/Beneficiario";
import { LoginResponse, UsuarioLogado } from "../types/Auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE_USUARIO_LOGADO = "@partilhae_usuario_logado";

export async function cadastrarDoador(cadastro: CadastroDoador) {
  try {
    const { data } = await JavaAPI.post("/doadores", {
      nomeUsuario: cadastro.nome.trim(),
      email: cadastro.email.trim().toLowerCase(),
      cpf: cadastro.cpf,
      telefone: cadastro.telefone,
      senha: cadastro.senha,

      cep: cadastro.cep,
      endereco: cadastro.logradouro,
      numero: cadastro.numero,
      complemento: cadastro.complemento,
      bairro: cadastro.bairro,
      cidade: cadastro.cidade,
      estado: cadastro.estado,

      tipoDoador: cadastro.tipoDoador,
      nomeEstabelecimento:
        cadastro.tipoDoador === "pessoaFisica"
          ? null
          : cadastro.nomeEstabelecimento?.trim(),
    });

    return data;
  } catch (error) {
    console.log("Erro ao cadastrar doador:", error);

    Alert.alert("Erro", "Não foi possível cadastrar o doador.");

    return null;
  }
}

export async function cadastrarBeneficiario(cadastro: CadastroBeneficiario) {
  try {
    const { data } = await JavaAPI.post("/beneficiarios", {
      nomeUsuario: cadastro.nome.trim(),
      email: cadastro.email.trim().toLowerCase(),
      cpf: cadastro.cpf,
      telefone: cadastro.telefone,
      senha: cadastro.senha,

      cep: cadastro.cep,
      endereco: cadastro.logradouro,
      numero: cadastro.numero,
      complemento: cadastro.complemento,
      bairro: cadastro.bairro,
      cidade: cadastro.cidade,
      estado: cadastro.estado,

      tipoBeneficiario: cadastro.tipoBeneficiario,
      nomeOrganizacao:
        cadastro.tipoBeneficiario === "ONG"
          ? cadastro.nomeOrganizacao?.trim()
          : null,
      raioBuscaKm: cadastro.raioBuscaKm,
    });

    return data;
  } catch (error) {
    console.log("Erro ao cadastrar beneficiário:", error);

    Alert.alert("Erro", "Não foi possível cadastrar beneficiário");

    return null;
  }
}

export async function logarUsuario(
    email: string,
    senha: string,
): Promise<UsuarioLogado | null> {
    try {
        const {data} = await JavaAPI.post<LoginResponse>("/auth/login", {
            email: email.trim().toLowerCase(),
            senha,
        });

        const usuarioLogado: UsuarioLogado = {
            token: data.token,
            tipoToken: data.tipoToken,
            idUsuario: data.idUsuario,
            idDoador: data.idDoador,
            idReceptor: data.idReceptor,
            nomeUsuario:data.nomeUsuario,
            email: data.email,
            role: data.role,
        };

        await AsyncStorage.setItem(
            CHAVE_USUARIO_LOGADO,
            JSON.stringify(usuarioLogado),
        );

        return usuarioLogado;
    } catch(error) {
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
  }
}