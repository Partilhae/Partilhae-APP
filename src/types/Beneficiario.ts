export type BeneficiarioTipo = "pessoaFisica" | "ONG";

export type CadastroBeneficiario = {
  tipo: "beneficiario";

  nome: string;
  email: string;
  cpf: string;
  telefone: string;

  cep: string;
  endereco: string;
  numero: string;
  complemento: string ;
  bairro: string;
  cidade: string;
  estado: string;

  senha: string;

  tipoBeneficiario: BeneficiarioTipo;
  nomeOrganizacao?: string;
};

export type BeneficiarioErros = {
  nome?: string;
  email?: string;
  cpf?: string;
  telefone?: string;
  senha?: string;

  cep?: string;
  endereco?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;

  tipoBeneficiario?: string;
  nomeOrganizacao?: string;
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
  complemento?: string | null;
  bairro: string;
  cidade: string;
  estado: string;

  tipoBeneficiario: BeneficiarioTipo;
  nomeOrganizacao?: string | null;
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
  complemento?: string | null;
  bairro: string;
  cidade: string;
  estado: string;

  tipoBeneficiario: BeneficiarioTipo;
  nomeOrganizacao?: string | null;

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
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;

  tipoBeneficiario: BeneficiarioTipo;
  nomeOrganizacao: string;

  quantidadePessoasFamilia: string;
  possuiCriancas: boolean | null;
  restricaoAlimentar: string;
  observacao: string;
};

export type BeneficiarioUpdateRequest =
  Partial<Omit<PerfilBeneficiarioFormData, "quantidadePessoasFamilia">> & {
    quantidadePessoasFamilia?: number;
  };