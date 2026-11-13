export type BeneficiarioTipo = "pessoaFisica" | "ONG";

export type CadastroBeneficiario = {
  tipo: "beneficiario";

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

  tipoBeneficiario: BeneficiarioTipo;
  nomeOrganizacao?: string;
  raioBuscaKm: 5 | 10 | 20;
};

export type BeneficiarioErros = {
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

  tipoBeneficiario?: string;
  nomeOrganizacao?: string;
  raioBuscaKm?: string;
};

export type BeneficiarioRequest = {
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

  tipoBeneficiario: BeneficiarioTipo;
  nomeOrganizacao?: string | null;
  raioBuscaKm: 5 | 10 | 20;
};

export type BeneficiarioResponse = {
  idReceptor: number;
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

  tipoBeneficiario: BeneficiarioTipo;
  nomeOrganizacao?: string | null;
  raioBuscaKm: 5 | 10 | 20;

  quantidadePessoasFamilia?: number | null;
  possuiCriancas?: boolean | null;
  restricaoAlimentar?: string | null;
  observacao?: string | null;

  statusConta: "ativa" | "bloqueada";
};

export type PerfilBeneficiarioFormData = {
  nomeUsuario: string;
  email: string;
  telefone: string;

  cep: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;

  tipoBeneficiario: BeneficiarioTipo;
  nomeOrganizacao: string;
  raioBuscaKm: 5 | 10 | 20;

  quantidadePessoasFamilia: string;
  possuiCriancas: boolean | null;
  restricaoAlimentar: string;
  observacao: string;
};
