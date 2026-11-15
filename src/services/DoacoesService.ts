import { NetAPI } from "./API/NetAPI";
import { Doacao, StatusDoacao } from "../types/Doacao";

export async function criarDoacao(
  idSolicitacao: string,
  idDoador: number,
): Promise<Doacao | null> {
  try {
    const { data } = await NetAPI.post<Doacao>("/doacoes", {
      idSolicitacao,
      idDoador,
    });

    return data;
  } catch (error) {
    console.log("Erro ao criar doação:", error);
    return null;
  }
}

export async function listarDoacoesDoador(
  idDoador: number,
): Promise<Doacao[] | null> {
  try {
    const { data } = await NetAPI.get<Doacao[]>(`/doacoes/doador/${idDoador}`);

    return data;
  } catch (error) {
    console.log("Erro ao listar doações do doador:", error);
    return null;
  }
}

export async function listarDoacoesBeneficiario(
  idReceptor: number,
): Promise<Doacao[] | null> {
  try {
    const { data } = await NetAPI.get<Doacao[]>(
      `/doacoes/receptor/${idReceptor}`,
    );

    return data;
  } catch (error) {
    console.log("Erro ao listar doações do beneficiário:", error);
    return null;
  }
}

export async function buscarDoacao(idDoacao: string): Promise<Doacao | null> {
  try {
    const { data } = await NetAPI.get<Doacao>(`/doacoes/${idDoacao}`);

    return data;
  } catch (error) {
    console.log("Erro ao buscar doação:", error);
    return null;
  }
}

export async function atualizarStatusDoacao(
  idDoacao: string,
  status: StatusDoacao,
): Promise<boolean> {
  try {
    await NetAPI.patch(`/doacoes/${idDoacao}/status`, { status });

    return true;
  } catch (error) {
    console.log("Erro ao atualizar status da doação:", error);
    return false;
  }
}

export async function cancelarDoacao(idDoacao: string): Promise<boolean> {
  return atualizarStatusDoacao(idDoacao, "cancelada");
}


export async function excluirDoacao(
  idDoacao: string,
): Promise<boolean> {
  try {
    await NetAPI.delete(`/doacoes/${idDoacao}`);

    return true;
  } catch (error) {
    console.log("Erro ao excluir doação:", error);
    return false;
  }
}
