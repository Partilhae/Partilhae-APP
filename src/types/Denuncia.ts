export type DenunciaRequest = {
  idUsuarioDenunciado?: number;
  idConversa?: number;
  idSolicitacao?: number;
  idDoacao?: number;
  motivo: string;
};

export type DenunciaResponse = {
  idDenuncia: number;
  idDenunciante: number;
  idUsuarioDenunciado: number | null;
  idConversa: number | null;
  idSolicitacao: number | null;
  idDoacao: number | null;
  motivo: string;
  status: string;
  dataDenuncia: string;
  resolucao: string | null;
};
