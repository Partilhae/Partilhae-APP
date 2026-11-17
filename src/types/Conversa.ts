export type Conversa = {
  id: string;
  idDoacao: string;
  idUsuarioDoador: number;
  idUsuarioBeneficiario: number;
  dataCriacao: string;
};

export type Mensagem = {
  id: string;
  idConversa: string;
  idRemetente: number;
  texto: string;
  dataEnvio: string;
};
