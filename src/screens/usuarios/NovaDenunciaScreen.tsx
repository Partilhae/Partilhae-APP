import { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";

import DenunciaForm from "../../components/forms/DenunciaForm";
import { criarDenuncia } from "../../services/DenunciasService";
import { DenunciaRequest } from "../../types/Denuncia";
import estilos from "../../estilos/estilo";

type NovaDenunciaParams = {
  NovaDenuncia: {
    idUsuarioDenunciado: number;
  };
};

export default function NovaDenunciaScreen() {
  const navigation = useNavigation();

  const route = useRoute<RouteProp<NovaDenunciaParams, "NovaDenuncia">>();

  const [enviando, setEnviando] = useState(false);

  const { idUsuarioDenunciado } = route.params;

  async function enviarDenuncia(motivo: string) {
    if (enviando) return;

    if (!Number.isInteger(idUsuarioDenunciado) || idUsuarioDenunciado <= 0) {
      Alert.alert("Erro", "Não foi possível identificar o usuário denunciado.");
      return;
    }

    const dados: DenunciaRequest = {
      idUsuarioDenunciado,
      motivo: motivo.trim(),
    };

    try {
      setEnviando(true);

      await criarDenuncia(dados);

      Alert.alert(
        "Denúncia enviada",
        "Sua denúncia foi registrada com sucesso.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error) {
      console.log("Erro ao registrar denúncia:", error);

      Alert.alert(
        "Erro",
        "Não foi possível registrar a denúncia. Tente novamente.",
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <View style={estilos.safe}>
      <ScrollView
        contentContainerStyle={estilos.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={estilos.pageTitle}>Nova denúncia</Text>

        <Text style={estilos.pageSubtitle}>
          Conte o que aconteceu para que sua denúncia possa ser analisada.
        </Text>

        <DenunciaForm onSubmit={enviarDenuncia} loading={enviando} />
      </ScrollView>
    </View>
  );
}
