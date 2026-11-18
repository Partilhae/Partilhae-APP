import { Alert } from "react-native";
import {
  BeneficiarioResponse,
  BeneficiarioUpdateRequest,
  CadastroBeneficiario,
} from "../types/Beneficiario";
import { JavaAPI } from "./API/JavaAPI";
import axios from "axios";

export async function cadastrarBeneficiario(cadastro: CadastroBeneficiario) {
  try {
    const { data } = await JavaAPI.post("/beneficiarios", {
      nomeUsuario: cadastro.nome.trim(),
      email: cadastro.email.trim().toLowerCase(),
      cpf: cadastro.cpf,
      telefone: cadastro.telefone,
      senha: cadastro.senha,

      cep: cadastro.cep,
      endereco: cadastro.endereco,
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
    });

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("STATUS DA API:", error.response?.status);
      console.log(
        "RESPOSTA DA API:",
        JSON.stringify(error.response?.data, null, 2),
      );
    } else {
      console.log("Erro inesperado:", error);
    }

    throw error;
  }
}

export async function buscarBeneficiario(
  id: number,
): Promise<BeneficiarioResponse | null> {
  try {
    const { data } = await JavaAPI.get<BeneficiarioResponse>(
      `/beneficiarios/${id}`,
    );
    return data;
  } catch (error) {
    console.log("Erro ao buscar beneficiário:", error);

    Alert.alert("Erro", "Não foi possível buscar os dados do beneficiário.");

    return null;
  }
}

export async function atualizarBeneficiario(
  id: number,
  dados: BeneficiarioUpdateRequest,
): Promise<BeneficiarioResponse | null> {
  try {
    const { data } = await JavaAPI.put<BeneficiarioResponse>(
      `/beneficiarios/${id}`,
      dados,
    );

    return data;
  } catch (error) {
    console.log("Erro ao atualizar beneficiário:", error);

    Alert.alert("Erro", "Não foi possível atualizar os dados do beneficiário.");

    return null;
  }
}

export async function deletarBeneficiario(id: number): Promise<boolean> {
  try {
    await JavaAPI.delete(`/beneficiarios/${id}`);

    return true;
  } catch (error) {
    console.log("Erro ao deletar beneficiário:", error);

    Alert.alert("Erro", "Não foi possível excluir a conta do beneficiário");

    return false;
  }
}
