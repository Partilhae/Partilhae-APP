import { useState } from "react";
import { Alert, View } from "react-native";
import Input from "../Input";
import Botao from "../Botao";

type DenunciaFormProps = {
  onSubmit: (motivo: string) => Promise<void>;
  loading?: boolean;
};

export default function DenunciaForm({
  onSubmit,
  loading = false,
}: DenunciaFormProps) {
  const [motivo, setMotivo] = useState("");

  async function enviar() {
    if (!motivo.trim()) {
      Alert.alert("Campo obrigatório", "Informe o motivo da denúncia.");
      return;
    }

    try {
      await onSubmit(motivo.trim());
    } catch (error) {
      Alert.alert(
        "Erro",
        error instanceof Error
          ? error.message
          : "Não foi possível enviar a denúncia.",
      );
    }
  }

  return (
    <View>
      <Input
        label="Motivo da denúncia"
        value={motivo}
        onChangeText={setMotivo}
        placeholder="Descreva o que aconteceu"
        multiline
      />

      <Botao label="Enviar denúncia" onPress={enviar} loading={loading} />
    </View>
  );
}
