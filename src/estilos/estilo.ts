
import { StyleSheet } from "react-native";

export const cores = {
  primaria: "#735342",
  fundo: "#FAF7EF",
  texto: "#342D29",
  destaque: "#F3DEA0",
  branco: "#FFFFFF",
  erro: "#C0392B",
  cinza: "#777777",
  borda: "#D9CFC5",
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },

  conteudo: {
    flexGrow: 1,
    padding: 20,
  },

  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: cores.primaria,
    textAlign: "center",
  },

  subtitulo: {
    fontSize: 16,
    color: cores.texto,
    textAlign: "center",
  },

  form: {
    gap: 16,
  },

  inputContainer: {
    gap: 6,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: cores.texto,
  },

  input: {
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: cores.texto,
  },

  erro: {
    fontSize: 12,
    color: cores.erro,
  },

  botao: {
    backgroundColor: cores.primaria,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  botaoTexto: {
    color: cores.branco,
    fontSize: 16,
    fontWeight: "bold",
  },

  toggle: {
    flexDirection: "row",
    backgroundColor: cores.destaque,
    borderRadius: 10,
    padding: 4,
    gap: 4,
  },

  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  toggleActive: {
    backgroundColor: cores.primaria,
  },

  toggleText: {
    color: cores.texto,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },

  toggleTextActive: {
    color: cores.branco,
  },
});

export default estilos;
