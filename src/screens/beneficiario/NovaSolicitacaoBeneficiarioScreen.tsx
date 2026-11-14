import { useNavigation } from "@react-navigation/native";
import { useSolicitacoes } from "../../context/SolicitacoesContext";
import { useState } from "react";
import { NovaSolicitacao } from "../../types/Solicitacao";
import { buscarUsuarioLogado } from "../../services/Auth";
import { Alert, ScrollView, Text, View } from "react-native";
import estilos from "../../estilos/estilo";
import SolicitacaoForm from "../../components/forms/SolicitacaoForm";

export default function NovaSolicitacaoBeneficiarioScreen() {
  const navigation = useNavigation();
  const { adicionarSolicitacao } = useSolicitacoes();

  const [loading, setLoading] = useState(false);

  async function handleCriarSolicitacao(dados: NovaSolicitacao) {
    try {
      setLoading(true);

      const usuario = await buscarUsuarioLogado();

      if (!usuario || !usuario.idReceptor) {
        Alert.alert("Erro", "Não foi possível identificar o beneficiário.");
        return;
      }

      await adicionarSolicitacao(dados, usuario.idReceptor);

      Alert.alert(
        "Solicitação publicada!",
        "Seu pedido foi cadastrado com sucesso.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error) {
      console.log("Erro ao criar solicitação.", error);

      Alert.alert("Erro", "Não foi possível publicar sua solicitação.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={estilos.safe}>
      <ScrollView
        contentContainerStyle={estilos.cadastroScroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={estilos.cadastroHeader}>
          <Text style={estilos.cadastroTitulo}>Nova solicitação</Text>

          <Text style={estilos.cadastroSubtitulo}>
            Conte para a comunidade como podemos ajudar você.
          </Text>
        </View>

        <SolicitacaoForm onSubmit={handleCriarSolicitacao} loading={loading} />
      </ScrollView>
    </View>
  );
}
