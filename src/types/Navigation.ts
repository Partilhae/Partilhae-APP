import {
  NavigationProp,
  NavigatorScreenParams,
} from "@react-navigation/native";

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
  NovaSolicitacao: { idSolicitacao: string };
  DetalhesSolicitacaoDoador: { idSolicitacao: string };
  EditarSolicitacao: { idSolicitacao: string };
  Conversas: undefined;
  Chat: { idConversa: string };
  NovaDenuncia: { idUsuarioDenunciado: number };
  DetalhesDoacaoDoador: {
    idDoacao: string;
  };
  EditarPerfilDoador: undefined;
  ConfiguracoesPerfilDoador: undefined;
  MinhasDenuncias: undefined;
};

export type DoadorNavigationParamlist = DoadorTabParamlist &
  DoadorStackParamlist;

export type DoadorNavigation = NavigationProp<DoadorNavigationParamlist>;

export type BeneficiarioTabParamlist = {
  InicioBeneficiario: undefined;
  MinhasSolicitacoes: undefined;
  DoacoesRecebidasBeneficiario: undefined;
  PerfilBeneficiario: undefined;
};

export type BeneficiarioStackParamlist = {
  BeneficiarioTabs: NavigatorScreenParams<BeneficiarioTabParamlist> | undefined;
  NovaSolicitacaoBeneficiario: undefined;
  DetalhesSolicitacaoBeneficiario: { idSolicitacao: string };
  EditarSolicitacaoBeneficiario: {
    idSolicitacao: string;
  };
  DetalhesDoacoesRecebidasBeneficiario: { idDoacao: string };
  Conversas: undefined;
  Chat: { idConversa: string };
  NovaDenuncia: { idUsuarioDenunciado: number };
  EditarPerfilBeneficiario: undefined;
  ConfiguracoesPerfilBeneficiario: undefined;
  MinhasDenuncias: undefined;
};

export type BeneficiarioNavigationParamlist = BeneficiarioTabParamlist &
  BeneficiarioStackParamlist;

export type BeneficiarioNavigation =
  NavigationProp<BeneficiarioNavigationParamlist>;
