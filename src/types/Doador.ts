export type DoadorTipo = "pessoaFisica" | "estabelecimento" | "projetoSocial";

export type CadastroDoador = {
  tipo: "doador";

  nome: string;
  email: string;
  cpf: string;
  telefone: string;

  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;

  senha: string;

  tipoDoador: DoadorTipo;
  nomeEstabelecimento?: string;
};

export type DoadorErros = {
  nome?: string;
  email?: string;
  cpf?: string;
  telefone?: string;
  senha?: string;

  cep?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;

  tipoDoador?: string;
  nomeEstabelecimento?: string;
};

export type DoadorRequest = {
  nomeUsuario: string;
  email: string;
  senha: string;
  cpf: string;
  telefone: string;

  cep: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;

  tipoDoador: DoadorTipo;
  nomeEstabelecimento?: string | null;
};

export type DoadorResponse = {
  idDoador: number;
  idUsuario: number;

  nomeUsuario: string;
  email: string;
  cpf: string;
  telefone: string;

  cep: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;

  tipoDoador: DoadorTipo;
  nomeEstabelecimento?: string | null;

  disponibilidade?: string | null;
  observacao?: string | null;

  statusConta: "ativa" | "bloqueada";
};


export type PerfilDoadorFormData = {
  nomeUsuario: string;
  email: string;
  telefone: string;

  cep: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;

  tipoDoador: DoadorTipo;
  nomeEstabelecimento: string;
  disponibilidade: string;
  observacao: string;
};
