import { Alert } from "react-native";
import { JavaAPI } from "./API/JavaAPI";
import { CadastroDoador, DoadorRequest, DoadorResponse } from "../types/Doador";

export async function cadastrarDoador(cadastro: CadastroDoador) {
  try {
    const { data } = await JavaAPI.post("/doadores", {
      nomeUsuario: cadastro.nome.trim(),
      email: cadastro.email.trim().toLowerCase(),
      cpf: cadastro.cpf,
      telefone: cadastro.telefone,
      senha: cadastro.senha,

      cep: cadastro.cep,
      logradouro: cadastro.logradouro,
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

export async function buscarDoador(id: number): Promise<DoadorResponse | null> {
  try {
    const { data } = await JavaAPI.get<DoadorResponse>(`/doadores/${id}`);

    return data;
  } catch (error) {
    console.log("Erro ao buscar doador:", error);

    Alert.alert("Erro", "Não foi possível buscar os dados do doador.");

    return null;
  }
}

export async function atualizarDoador(
  id: number,
  dados: DoadorRequest,
): Promise<DoadorResponse | null> {
  try {
    const { data } = await JavaAPI.put<DoadorResponse>(
      `/doadores/${id}`,
      dados,
    );

    return data;
  } catch (error) {
    console.log("Erro ao atualizar doador:", error);

    Alert.alert(
      "Erro",
      "Não foi possível atualizar os dados desse doador.",
    );

    return null;
  }
}

export async function deletarDoador(id: number): Promise<boolean> {
  try {
    await JavaAPI.delete(`/doadores/${id}`);

    return true;
  } catch (error) {
    console.log("Erro ao deletar doador:", error);

    Alert.alert("Erro", "Não foi possível excluir a conta do doador");

    return false;
  }
}
