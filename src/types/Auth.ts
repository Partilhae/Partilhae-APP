export type UserTipo = "beneficiario" | "doador";

export type UserRole = "DOADOR" | "RECEPTOR";

export type LoginFormData = {
  tipo: UserTipo;
  email: string;
  senha: string;
};

export type LoginErros = {
  email?: string;
  senha?: string;
};

export type LoginRequest = {
  email: string;
  senha: string;
};

export type LoginResponse = {
  token: string;
  tipoToken: string;

  idUsuario: number;
  nomeUsuario: string;
  email: string;
  role: UserRole;

  idDoador: number | null;
  idReceptor: number | null;
};

export type UsuarioLogado = LoginResponse;
