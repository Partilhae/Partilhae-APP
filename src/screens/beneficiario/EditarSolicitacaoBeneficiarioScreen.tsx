
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";

import estilos, { cores } from "../../estilos/estilo";
import { BeneficiarioStackParamlist } from "../../types/Navigation";
import { NovaSolicitacao } from "../../types/Solicitacao";
import { useSolicitacoes } from "../../context/SolicitacoesContext";
import { buscarUsuarioLogado } from "../../services/AuthService";
import SolicitacaoForm from "../../components/forms/SolicitacaoForm";

export default function EditarSolicitacaoBeneficiarioScreen() {
  const navigation = useNavigation();

  const route =
    useRoute<
      RouteProp<
        BeneficiarioStackParamlist,
        "EditarSolicitacaoBeneficiario"
      >
    >();

  const { idSolicitacao } = route.params;

  const {
    solicitacoes,
    loading,
    atualizarSolicitacao,
  } = useSolicitacoes();

  const [salvando, setSalvando] = useState(false);

  const solicitacao = solicitacoes.find(
    (item) => item.id === idSolicitacao,
  );

  async function handleSalvar(dados: NovaSolicitacao) {
    if (!solicitacao || salvando) return;

    try {
      setSalvando(true);

      const usuario = await buscarUsuarioLogado();

      if (
        !usuario?.idReceptor ||
        usuario.idReceptor !== solicitacao.idReceptor
      ) {
        Alert.alert(
          "Erro",
          "Você não tem permissão para editar esta solicitação.",
        );
        return;
      }

      if (solicitacao.status !== "aberta") {
        Alert.alert(
          "Atenção",
          "Somente solicitações abertas podem ser editadas.",
        );
        return;
      }

      await atualizarSolicitacao(solicitacao.id, dados);

      Alert.alert(
        "Solicitação atualizada!",
        "As alterações foram salvas com sucesso.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error) {
      console.log("Erro ao editar solicitação:", error);

      Alert.alert(
        "Erro",
        "Não foi possível salvar as alterações.",
      );
    } finally {
      setSalvando(false);
    }
  }

  if (loading) {
    return (
      <View style={estilos.solicitacaoCarregando}>
        <ActivityIndicator
          size="large"
          color={cores.primary}
        />
      </View>
    );
  }

  if (!solicitacao) {
    return (
      <View style={estilos.solicitacaoCarregando}>
        <Text style={estilos.solicitacoesVazioTitulo}>
          Solicitação não encontrada
        </Text>
      </View>
    );
  }

  return (
    <View style={estilos.safe}>
      <ScrollView
        contentContainerStyle={estilos.cadastroScroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={estilos.cadastroHeader}>
          <Text style={estilos.cadastroTitulo}>
            Editar solicitação
          </Text>

          <Text style={estilos.cadastroSubtitulo}>
            Atualize as informações do seu pedido de ajuda.
          </Text>
        </View>

        <SolicitacaoForm
          dadosIniciais={{
            titulo: solicitacao.titulo,
            descricao: solicitacao.descricao,
            tipoAjuda: solicitacao.tipoAjuda,
            itens: solicitacao.itens,
          }}
          onSubmit={handleSalvar}
          loading={salvando}
        />
      </ScrollView>
    </View>
  );
}
