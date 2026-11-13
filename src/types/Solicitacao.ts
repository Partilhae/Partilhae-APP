export type StatusSolicitacao =
  | "aberta"
  | "em_andamento"
  | "concluida"
  | "cancelada";

export type TipoAjuda = "geral" | "especifico";

export type ItemSolicitacao = {
  id: string;
  nome: string;
  quantidade: number;
  unidade: string;
};

export type Solicitacao = {
  id: string;
  idReceptor: number;
  titulo: string;
  descricao: string;
  tipoAjuda: TipoAjuda;
  status: StatusSolicitacao;
  dataCriacao: string;
  itens: ItemSolicitacao[];
};

export type NovaSolicitacao = {
  titulo: string;
  descricao: string;
  tipoAjuda: TipoAjuda;
  itens: ItemSolicitacao[];
};
