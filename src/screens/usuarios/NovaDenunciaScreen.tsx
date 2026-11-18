import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

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
    <SafeAreaView style={estilos.safe} edges={["top", "bottom"]}>
      <ScrollView
        contentContainerStyle={estilos.pageContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={estilos.solicitacaoVoltar}>← Voltar</Text>
        </Pressable>

        <View style={estilos.cadastroHeader}>
          <Text style={estilos.cadastroTitulo}>Nova denúncia</Text>

          <Text style={estilos.cadastroSubtitulo}>
            Descreva o ocorrido para que sua denúncia possa ser analisada.
          </Text>
        </View>

        <DenunciaForm onSubmit={enviarDenuncia} loading={enviando} />
      </ScrollView>
    </SafeAreaView>
  );
}
