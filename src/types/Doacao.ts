export type StatusDoacao =
  | "em_andamento"
  | "entregue"
  | "concluida"
  | "cancelada";

export type FiltroDoacao =
  | "em_andamento"
  | "concluida"
  | "cancelada";

export type Doacao = {
  id: string;
  idSolicitacao: string;
  idDoador: number;
  idReceptor: number;
  status: StatusDoacao;
  dataCriacao: string;
  dataConclusao?: string;
};
