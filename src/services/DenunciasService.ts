import { DenunciaRequest, DenunciaResponse } from "../types/Denuncia";
import { JavaAPI } from "./API/JavaAPI";

export async function criarDenuncia(
  dados: DenunciaRequest,
): Promise<DenunciaResponse> {
  const { data } = await JavaAPI.post<DenunciaResponse>("/denuncias", dados);

  return data;
}

export async function buscarDenuncia(id: number): Promise<DenunciaResponse> {
  const { data } = await JavaAPI.get<DenunciaResponse>(`/denuncias/${id}`);

  return data;
}

export async function listarMinhasDenuncias(
  idUsuario: number,
): Promise<DenunciaResponse[]> {
  const { data } = await JavaAPI.get<{content: DenunciaResponse[]}>(
    `/denuncias/usuario/${idUsuario}`,
  );

  return data.content;
}
