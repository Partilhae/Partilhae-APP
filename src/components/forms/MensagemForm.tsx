import { useState } from "react";
import { View } from "react-native";
import estilos from "../../estilos/estilo";
import Input from "../Input";
import Botao from "../Botao";

type MensagemFormProps = {
  onSubmit: (texto: string) => Promise<void>;
  loading?: boolean;
};

export default function MensagemForm({
  onSubmit,
  loading = false,
}: MensagemFormProps) {
  const [texto, setTexto] = useState("");
  const [erro, setErro] = useState("");

  async function enviarMensagem() {
    const mensagem = texto.trim();

    if (!mensagem) {
      setErro("Digite uma mensagem.");
      return;
    }

    try {
      await onSubmit(mensagem);
      setTexto("");
      setErro("");
    } catch (error) {
      console.log("Erro ao enviar mensagem:", error);
      setErro("Não foi possível enviar a mensagem.");
    }
  }

  return (
    <View style={estilos.form}>
      <Input
        label="Mensagem"
        placeholder="Digite sua mensagem..."
        value={texto}
        onChangeText={(valor) => {
          setTexto(valor);
          setErro("");
        }}
        error={erro}
        editable={!loading}
        multiline
        maxLength={1000}
      />
      <Botao
        label="Enviar mensagem"
        onPress={enviarMensagem}
        loading={loading}
      />
    </View>
  );
}
