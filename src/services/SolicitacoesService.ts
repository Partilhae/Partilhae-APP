import { NetAPI } from "./API/NetAPI";
import {
  NovaSolicitacao,
  Solicitacao,
  StatusSolicitacao,
} from "../types/Solicitacao";
import { Alert } from "react-native";

export async function criarSolicitacao(
  dados: NovaSolicitacao,
  idReceptor: number,
): Promise<Solicitacao | null> {
  try {
    const { data } = await NetAPI.post<Solicitacao>("/solicitacoes", {
      idReceptor,
      titulo: dados.titulo,
      descricao: dados.descricao,
      tipoAjuda: dados.tipoAjuda,
      itens: dados.itens.map((item) => ({
        nome: item.nome,
        quantidade: item.quantidade,
        unidade: item.unidade,
      })),
    });

    return data;
  } catch (error) {
    console.log("Erro ao criar solicitação:", error);
    Alert.alert("Erro", "Não foi possível criar essa solicitação.");
    return null;
  }
}

export async function listarSolicitacoesBeneficiario(
  idReceptor: number,
): Promise<Solicitacao[] | null> {
  try {
    const { data } = await NetAPI.get<Solicitacao[]>(
      `/solicitacoes/receptor/${idReceptor}`,
    );

    return data;
  } catch (error) {
    console.log("Erro ao listar solicitações:", error);
    return null;
  }
}

export async function listarSolicitacoesDisponiveis(): Promise<
  Solicitacao[] | null
> {
  try {
    const { data } = await NetAPI.get<Solicitacao[]>("/solicitacoes");

    return data;
  } catch (error) {
    console.log("Erro ao listar solicitações disponíveis:", error);

    return null;
  }
}

export async function buscarSolicitacao(
  idSolicitacao: string,
): Promise<Solicitacao | null> {
  try {
    const { data } = await NetAPI.get<Solicitacao>(
      `/solicitacoes/${idSolicitacao}`,
    );

    return data;
  } catch (error) {
    console.log("Erro ao buscar solicitação:", error);
    Alert.alert("Erro", "Não foi possível achar os dados dessas solicitações.")
    return null;
  }
}

export async function atualizarSolicitacao(
  idSolicitacao: string,
  dados: NovaSolicitacao,
): Promise<Solicitacao | null> {
  try {
    const { data } = await NetAPI.put<Solicitacao>(
      `/solicitacoes/${idSolicitacao}`,
      {
        titulo: dados.titulo,
        descricao: dados.descricao,
        tipoAjuda: dados.tipoAjuda,
        itens: dados.itens.map((item) => ({
          nome: item.nome,
          quantidade: item.quantidade,
          unidade: item.unidade,
        })),
      },
    );

    return data;
  } catch (error) {
    console.log("Erro ao atualizar solicitação:", error);
    return null;
  }
}

export async function atualizarStatusSolicitacao(
  idSolicitacao: string,
  status: StatusSolicitacao,
): Promise<boolean> {
  try {
    await NetAPI.patch(`/solicitacoes/${idSolicitacao}/status`, { status });

    return true;
  } catch (error) {
    console.log("Erro ao atualizar status:", error);
    return false;
  }
}

export async function cancelarSolicitacao(
  idSolicitacao: string,
): Promise<boolean> {
  return atualizarStatusSolicitacao(idSolicitacao, "cancelada");
}


export async function excluirSolicitacao(
  idSolicitacao: string,
): Promise<boolean> {
  try {
    await NetAPI.delete(
      `/solicitacoes/${idSolicitacao}`,
    );

    return true;
  } catch (error) {
    console.log("Erro ao excluir solicitação:", error);
    return false;
  }
}
