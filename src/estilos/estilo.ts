import { StyleSheet } from "react-native";

export const cores = {
  background: "#FAF9F7",
  white: "#FFFFFF",

  primary: "#A94F65",
  primaryMedium: "#C65765",
  primarySoft: "#F7E9EC",

  yellow: "#F1C86D",
  yellowMedium: "#F5D994",
  yellowSoft: "#FFF5DF",

  text: "#30343B",
  textSecondary: "#656A73",
  muted: "#85878D",
  placeholder: "#999BA3",

  border: "#E7E5E4",
  borderStrong: "#D3CFCC",

  success: "#39845B",
  successSoft: "#E4F5E8",

  info: "#4388A5",
  infoSoft: "#E6F4FA",

  warning: "#966A24",
  warningSoft: "#FFF0C9",

  danger: "#C94B43",
  dangerSoft: "#FCE9E6",
} as const;

const estilos = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: cores.background,
  },

  scroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },

  pageContent: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 32,
    gap: 16,
  },

  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: cores.background,
  },

  primaryBtn: {
    backgroundColor: cores.primary,
    borderRadius: 14,
    minHeight: 50,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  outlineBtn: {
    backgroundColor: cores.white,
    borderColor: cores.primary,
    borderWidth: 1.5,
    borderRadius: 14,
    minHeight: 50,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  primaryBtnText: {
    color: cores.white,
    fontSize: 16,
    fontWeight: "700",
  },
  outlineBtnText: {
    color: cores.primary,
    fontSize: 16,
    fontWeight: "700",
  },

  wrapper: {
    marginBottom: 12,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: cores.text,
    marginBottom: 6,
  },
  inputRow: {
    justifyContent: "center",
  },
  input: {
    backgroundColor: cores.white,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 14,
    minHeight: 50,
    paddingHorizontal: 14,
    paddingRight: 48,
    fontSize: 15,
    color: cores.text,
  },
  inputError: {
    borderColor: cores.danger,
  },

  eyeBtn: {
    position: "absolute",
    right: 15,
    padding: 5,
  },

  errorText: {
    color: cores.danger,
    fontSize: 12,
    marginTop: 5,
  },

  form: {
    gap: 5,
  },

  toggle: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },
  toggleBtn: {
    flex: 1,
    backgroundColor: cores.white,
    borderWidth: 1.5,
    borderColor: cores.border,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleActive: {
    backgroundColor: cores.yellowSoft,
    borderColor: cores.yellow,
  },
  toggleText: {
    fontSize: 13,
    color: cores.textSecondary,
    fontWeight: "500",
    textAlign: "center",
  },
  toggleTextActive: {
    color: cores.primary,
    fontWeight: "700",
  },

  footerLink: {
    color: cores.primary,
    fontSize: 14,
    fontWeight: "700",
  },

  backBtn: {
    paddingVertical: 10,
    marginBottom: 15,
  },
  backBtnText: {
    color: cores.primary,
    fontWeight: "700",
    fontSize: 14,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerText: {
    flex: 1,
    gap: 5,
  },

  pageTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: cores.text,
  },
  pageSubtitle: {
    fontSize: 13,
    color: cores.textSecondary,
    lineHeight: 19,
  },

  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: cores.yellowSoft,
    alignItems: "center",
    justifyContent: "center",
  },

  indicatorRow: {
    flexDirection: "row",
    gap: 10,
  },
  indicator: {
    flex: 1,
    backgroundColor: cores.white,
    borderRadius: 16,
    padding: 14,
    gap: 6,
  },
  indicatorValue: {
    fontSize: 25,
    fontWeight: "800",
    color: cores.primary,
  },
  indicatorLabel: {
    fontSize: 12,
    color: cores.textSecondary,
  },

  card: {
    backgroundColor: cores.white,
    borderRadius: 18,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: cores.border,
  },
  highlightCard: {
    backgroundColor: cores.yellow,
    borderRadius: 18,
    padding: 18,
    gap: 10,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: cores.text,
  },
  cardDescription: {
    fontSize: 14,
    color: cores.textSecondary,
    lineHeight: 21,
  },

  actionButton: {
    flexDirection: "row",
    backgroundColor: cores.primary,
    borderRadius: 14,
    padding: 13,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  actionButtonText: {
    color: cores.white,
    fontSize: 14,
    fontWeight: "700",
  },

  headerInline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: cores.primary,
  },

  linkText: {
    fontSize: 13,
    fontWeight: "700",
    color: cores.primary,
  },

  list: {
    gap: 12,
  },

  itemTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: cores.text,
  },
  itemSubtitle: {
    fontSize: 13,
    color: cores.textSecondary,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  infoText: {
    fontSize: 12,
    color: cores.textSecondary,
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },

  emptyState: {
    backgroundColor: cores.white,
    borderRadius: 22,
    padding: 28,
    alignItems: "center",
    gap: 12,
  },
  emptyIcon: {
    width: 65,
    height: 65,
    borderRadius: 22,
    backgroundColor: cores.yellowSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: cores.text,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 13,
    color: cores.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },

  profileAvatar: {
    width: 85,
    height: 85,
    borderRadius: 43,
    backgroundColor: cores.yellowSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "800",
    color: cores.text,
    textAlign: "center",
  },
  profileEmail: {
    fontSize: 14,
    color: cores.textSecondary,
    textAlign: "center",
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 10,
  },
  profileBadge: {
    backgroundColor: cores.yellowSoft,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  profileBadgeText: {
    color: cores.primary,
    fontSize: 12,
    fontWeight: "700",
  },

  section: {
    gap: 10,
    marginBottom: 10,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  detailIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: cores.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  detailContent: {
    flex: 1,
    gap: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: cores.muted,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "600",
    color: cores.text,
  },

  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
  },
  settingsDangerText: {
    color: cores.danger,
  },

  separator: {
    height: 1,
    backgroundColor: cores.border,
  },

  disabledText: {
    fontSize: 12,
    color: cores.muted,
    lineHeight: 19,
  },

  tabBar: {
    height: 72,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: cores.white,
    borderTopColor: cores.border,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: "600",
  },

  loginScroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 40,
  },
  loginHeader: {
    alignItems: "center",
    marginBottom: 30,
  },
  loginLogo: {
    width: 210,
    height: 150,
    marginBottom: 4,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: cores.text,
    textAlign: "center",
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: cores.textSecondary,
    textAlign: "center",
    maxWidth: 300,
  },
  loginTipoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: cores.text,
    marginBottom: 10,
  },
  loginToggle: {
    flexDirection: "row",
    backgroundColor: cores.primarySoft,
    borderRadius: 16,
    padding: 5,
    marginBottom: 18,
    gap: 5,
  },
  loginToggleBtn: {
    flex: 1,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  loginToggleActive: {
    backgroundColor: cores.white,
    borderWidth: 1,
    borderColor: cores.borderStrong,
  },
  loginToggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: cores.textSecondary,
  },
  loginToggleTextActive: {
    color: cores.primary,
    fontWeight: "700",
  },
  loginFooter: {
    alignItems: "center",
    marginTop: 26,
    gap: 7,
  },
  loginFooterText: {
    fontSize: 14,
    color: cores.textSecondary,
  },
  loginFooterLink: {
    fontSize: 14,
    color: cores.primary,
    fontWeight: "700",
  },

  cadastroForm: {
    gap: 22,
  },
  cadastroSecao: {
    gap: 4,
  },
  cadastroSecaoTitulo: {
    fontSize: 18,
    fontWeight: "700",
    color: cores.primary,
    marginBottom: 12,
    paddingBottom: 9,
    borderBottomWidth: 1,
    borderBottomColor: cores.border,
  },
  cadastroCampoTitulo: {
    fontSize: 14,
    fontWeight: "600",
    color: cores.text,
    marginTop: 8,
    marginBottom: 8,
  },
  cadastroLinha: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  cadastroCampoMenor: {
    flex: 1,
    minWidth: 0,
  },
  cadastroCampoMaior: {
    flex: 2,
    minWidth: 0,
  },
  cadastroOpcoes: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  cadastroOpcao: {
    flex: 1,
    minWidth: 0,
    backgroundColor: cores.white,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 14,
    minHeight: 44,
    paddingHorizontal: 8,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cadastroOpcaoAtiva: {
    backgroundColor: cores.yellowSoft,
    borderColor: cores.yellow,
  },
  cadastroOpcaoTexto: {
    fontSize: 13,
    fontWeight: "600",
    color: cores.textSecondary,
    textAlign: "center",
  },
  cadastroOpcaoTextoAtivo: {
    color: cores.primary,
    fontWeight: "700",
  },
  cadastroAjuda: {
    fontSize: 12,
    lineHeight: 18,
    color: cores.textSecondary,
    marginBottom: 10,
  },
  cadastroScroll: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 32,
  },
  cadastroHeader: {
    marginBottom: 26,
  },
  cadastroTitulo: {
    fontSize: 28,
    fontWeight: "800",
    color: cores.text,
    marginBottom: 8,
  },
  cadastroSubtitulo: {
    fontSize: 14,
    lineHeight: 21,
    color: cores.textSecondary,
  },
  cadastroFooter: {
    alignItems: "center",
    gap: 8,
    marginTop: 28,
  },
  cadastroOpcoesDoador: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  cadastroOpcaoDoador: {
    width: "48%",
    flexGrow: 1,
    backgroundColor: cores.white,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 14,
    minHeight: 44,
    paddingHorizontal: 8,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  solicitacaoAdicionar: {
    borderWidth: 1,
    borderColor: cores.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  solicitacaoAdicionarTexto: {
    fontSize: 14,
    fontWeight: "700",
    color: cores.primary,
  },
  solicitacaoLista: {
    marginTop: 16,
    gap: 10,
  },
  solicitacaoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: cores.white,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  solicitacaoItemNome: {
    fontSize: 14,
    fontWeight: "700",
    color: cores.text,
  },
  solicitacaoItemQuantidade: {
    fontSize: 13,
    color: cores.textSecondary,
    marginTop: 4,
  },
  solicitacaoRemover: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: cores.dangerSoft,
  },
  solicitacaoRemoverTexto: {
    fontSize: 12,
    fontWeight: "600",
    color: cores.danger,
  },
  solicitacoesScroll: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 28,
    flexGrow: 1,
  },
  solicitacoesHeader: {
    marginBottom: 16,
  },
  solicitacoesNovoBotao: {
    backgroundColor: cores.primary,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
  },
  solicitacoesNovoTexto: {
    fontSize: 14,
    fontWeight: "700",
    color: cores.white,
  },
  solicitacaoCard: {
    backgroundColor: cores.white,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  solicitacaoCardTopo: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 10,
  },
  solicitacaoCardTitulo: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: cores.text,
  },
  solicitacaoCardDescricao: {
    fontSize: 13,
    lineHeight: 20,
    color: cores.textSecondary,
    marginBottom: 12,
  },
  solicitacaoCardInfo: {
    fontSize: 12,
    color: cores.textSecondary,
    marginBottom: 5,
  },
  solicitacaoCardData: {
    fontSize: 12,
    color: cores.muted,
    marginTop: 10,
  },
  solicitacaoStatusTexto: {
    fontSize: 11,
    fontWeight: "700",
    color: cores.warning,
  },
  solicitacoesVazio: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 55,
  },
  solicitacoesVazioTitulo: {
    fontSize: 18,
    fontWeight: "700",
    color: cores.text,
    textAlign: "center",
    marginBottom: 10,
  },
  solicitacoesVazioTexto: {
    fontSize: 14,
    lineHeight: 21,
    color: cores.textSecondary,
    textAlign: "center",
  },
  solicitacaoCarregando: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: cores.background,
    gap: 12,
  },
  solicitacaoVoltar: {
    fontSize: 14,
    fontWeight: "600",
    color: cores.primary,
    marginBottom: 24,
  },
  solicitacaoDetalhesCard: {
    backgroundColor: cores.white,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 18,
    padding: 18,
    marginBottom: 24,
  },
  solicitacaoDetalhesTitulo: {
    fontSize: 21,
    fontWeight: "700",
    color: cores.text,
    marginBottom: 12,
  },
  solicitacaoDetalhesStatus: {
    alignSelf: "flex-start",
    backgroundColor: cores.yellowSoft,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginBottom: 22,
  },
  solicitacaoDetalhesLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: cores.text,
    marginBottom: 6,
    marginTop: 12,
  },
  solicitacaoDetalhesDescricao: {
    fontSize: 14,
    lineHeight: 22,
    color: cores.textSecondary,
  },
  solicitacaoDetalhesValor: {
    fontSize: 14,
    color: cores.textSecondary,
    marginBottom: 8,
  },
  solicitacaoDetalhesDivisor: {
    height: 1,
    backgroundColor: cores.border,
    marginVertical: 16,
  },
  solicitacaoDetalhesSecao: {
    marginBottom: 24,
    gap: 10,
  },
  solicitacaoCancelarBotao: {
    borderWidth: 1,
    borderColor: cores.danger,
    backgroundColor: cores.dangerSoft,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
  },
  solicitacaoCancelarTexto: {
    fontSize: 14,
    fontWeight: "700",
    color: cores.danger,
  },

  explorarVerDetalhes: {
    backgroundColor: cores.primarySoft,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 14,
  },
  explorarVerDetalhesTexto: {
    color: cores.primary,
    fontSize: 14,
    fontWeight: "700",
  },

  doadorQueroAjudar: {
    backgroundColor: cores.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 16,
  },
  doadorQueroAjudarTexto: {
    color: cores.white,
    fontSize: 15,
    fontWeight: "700",
  },
  doacoesFiltros: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  doacoesFiltro: {
    flex: 1,
    minWidth: 0,
    backgroundColor: cores.white,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  doacoesFiltroAtivo: {
    backgroundColor: cores.primarySoft,
    borderColor: cores.primarySoft,
  },
  doacoesFiltroTexto: {
    color: cores.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  doacoesFiltroTextoAtivo: {
    color: cores.primary,
  },

  conversaStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  conversaStatusEmAndamento: {
    backgroundColor: cores.primarySoft,
  },
  conversaStatusEntregue: {
    backgroundColor: cores.warningSoft,
  },
  conversaStatusConcluida: {
    backgroundColor: cores.successSoft,
  },
  conversaStatusCancelada: {
    backgroundColor: cores.dangerSoft,
  },
  conversaStatusTextoEmAndamento: {
    color: cores.primary,
  },
  conversaStatusTextoEntregue: {
    color: cores.warning,
  },
  conversaStatusTextoConcluida: {
    color: cores.success,
  },
  conversaStatusTextoCancelada: {
    color: cores.danger,
  },

  chatContainer: {
    flex: 1,
  },
  chatHeader: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: cores.border,
    backgroundColor: cores.white,
    gap: 10,
  },
  chatHeaderAcoes: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chatAcao: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 6,
  },
  chatDenunciarTexto: {
    color: cores.danger,
    fontSize: 13,
    fontWeight: "600",
  },
  chatMensagens: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexGrow: 1,
  },
  chatMensagem: {
    maxWidth: "82%",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 10,
  },
  chatMensagemMinha: {
    alignSelf: "flex-end",
    backgroundColor: cores.primarySoft,
    borderColor: cores.primarySoft,
  },
  chatMensagemRecebida: {
    alignSelf: "flex-start",
    backgroundColor: cores.white,
    borderColor: cores.border,
  },
  chatMensagemTexto: {
    fontSize: 14,
    lineHeight: 21,
    color: cores.text,
  },
  chatMensagemHorario: {
    fontSize: 11,
    color: cores.textSecondary,
    textAlign: "right",
    marginTop: 5,
  },
  chatRodape: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: cores.white,
    borderTopWidth: 1,
    borderTopColor: cores.border,
  },
  chatFinalizado: {
    padding: 16,
    alignItems: "center",
    backgroundColor: cores.successSoft,
    borderRadius: 14,
    gap: 6,
  },
  chatFinalizadoTitulo: {
    color: cores.success,
    fontWeight: "700",
    fontSize: 15,
    textAlign: "center",
  },
  chatFinalizadoTexto: {
    color: cores.textSecondary,
    fontSize: 13,
    textAlign: "center",
  },
});

export default estilos;
