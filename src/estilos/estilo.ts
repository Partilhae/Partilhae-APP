import { StyleSheet } from "react-native";

export const cores = {
  background: "#FFF9ED",
  white: "#FFFFFF",

  primary: "#75452B",
  primaryMedium: "#A96D45",
  primarySoft: "#F6E7D7",

  yellow: "#F5BC42",
  yellowMedium: "#FFD36B",
  yellowSoft: "#FFE7A8",

  text: "#38291F",
  textSecondary: "#806A5B",
  muted: "#A18F80",
  placeholder: "#B5A395",

  border: "#EDE0D0",
  borderStrong: "#D8BEA5",

  success: "#39845B",
  successSoft: "#E4F5E8",
  info: "#4388A5",
  infoSoft: "#E6F4FA",
  warning: "#B87520",
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
    paddingHorizontal: 22,
    paddingTop: 36,
    paddingBottom: 70,
  },

  scrollCentered: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 35,
  },

  pageContent: {
    padding: 20,
    gap: 22,
  },

  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: cores.background,
  },

  primaryBtn: {
    backgroundColor: cores.primary,
    borderRadius: 18,
    minHeight: 54,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  outlineBtn: {
    backgroundColor: cores.white,
    borderColor: cores.primary,
    borderWidth: 1.5,
    borderRadius: 18,
    minHeight: 54,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
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
    marginBottom: 15,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: cores.text,
    marginBottom: 8,
  },

  inputRow: {
    justifyContent: "center",
  },

  input: {
    backgroundColor: cores.white,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 16,
    minHeight: 54,
    paddingHorizontal: 16,
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

  logoContainer: {
    alignItems: "center",
    marginBottom: 28,
  },

  logoImage: {
    width: 230,
    height: 170,
  },

  subtitle: {
    fontSize: 14,
    color: cores.textSecondary,
    lineHeight: 22,
    marginBottom: 12,
  },

  footer: {
    alignItems: "center",
    marginTop: 25,
    gap: 8,
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

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: cores.text,
    marginBottom: 8,
  },

  headerCenter: {
    alignItems: "center",
    marginBottom: 25,
  },

  textCenter: {
    textAlign: "center",
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

  headerBrand: {
    fontSize: 12,
    fontWeight: "700",
    color: cores.primaryMedium,
  },

  pageTitle: {
    fontSize: 27,
    fontWeight: "800",
    color: cores.text,
  },

  pageSubtitle: {
    fontSize: 14,
    color: cores.textSecondary,
    lineHeight: 21,
  },

  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: cores.yellowSoft,
    alignItems: "center",
    justifyContent: "center",
  },

  indicatorRow: {
    flexDirection: "row",
    gap: 12,
  },

  indicator: {
    flex: 1,
    backgroundColor: cores.white,
    borderRadius: 20,
    padding: 18,
    gap: 8,
  },

  indicatorValue: {
    fontSize: 28,
    fontWeight: "800",
    color: cores.primary,
  },

  indicatorLabel: {
    fontSize: 12,
    color: cores.textSecondary,
  },

  card: {
    backgroundColor: cores.white,
    borderRadius: 22,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: cores.border,
  },

  highlightCard: {
    backgroundColor: cores.yellow,
    borderRadius: 24,
    padding: 22,
    gap: 14,
  },

  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },

  cardTitle: {
    fontSize: 18,
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
    borderRadius: 16,
    padding: 15,
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
    fontSize: 19,
    fontWeight: "700",
    color: cores.primary,
    marginTop: 18,
    marginBottom: 12,
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
    gap: 12,
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

  settingsText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: cores.text,
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
    fontSize: 12,
    fontWeight: "600",
  },
});

export default estilos;
