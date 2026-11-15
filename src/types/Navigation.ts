import { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
  Login: undefined;
  CadastroDoador: undefined;
  CadastroBeneficiario: undefined;
  Doador: undefined;
  Beneficiario: undefined;
};

export type DoadorTabParamlist = {
  InicioDoador: undefined;
  Solicitacoes: undefined;
  MinhasDoacoes: undefined;
  PerfilDoador: undefined;
};

export type DoadorStackParamlist = {
  DoadorTabs: NavigatorScreenParams<DoadorTabParamlist> | undefined;
  EditarPerfilDoador: undefined;
  DetalhesSolicitacaoDoador: { idSolicitacao: string };
  DetalhesDoacaoDoador: {
    idDoacao: string;
  };
};

export type BeneficiarioTabParamlist = {
  InicioBeneficiario: undefined;
  MinhasSolicitacoes: undefined;
  DoacoesRecebidasBeneficiario: undefined;
  PerfilBeneficiario: undefined;
};

export type BeneficiarioStackParamlist = {
  BeneficiarioTabs: NavigatorScreenParams<BeneficiarioTabParamlist> | undefined;
  EditarPerfilBeneficiario: undefined;
  NovaSolicitacaoBeneficiario: undefined;
  DetalhesSolicitacaoBeneficiario: { idSolicitacao: string };
  EditarSolicitacaoBeneficiario: {
    idSolicitacao: string;
  };
};
