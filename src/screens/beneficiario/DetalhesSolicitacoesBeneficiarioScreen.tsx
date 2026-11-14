import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";

import estilos, { cores } from "../../estilos/estilo";
import { useSolicitacoes } from "../../context/SolicitacoesContext";
import { StatusSolicitacao } from "../../types/Solicitacao";
import { buscarUsuarioLogado } from "../../services/Auth";

type DetalhesParams = {
  DetalhesSolicitacao: {
    idSolicitacao: string;
  };
};

export default function DetalhesSolicitacaoScreen() {
  const navigation = useNavigation();

  const route = useRoute<RouteProp<DetalhesParams, "DetalhesSolicitacao">>();

  const { idSolicitacao } = route.params;

  const { solicitacoes, loading, atualizarStatus } = useSolicitacoes();

  const [cancelando, setCancelando] = useState(false);

  const solicitacao = solicitacoes.find((item) => item.id === idSolicitacao);

  function formatarStatus(status: StatusSolicitacao) {
    switch (status) {
      case "aberta":
        return "Aberta";
      case "em_andamento":
        return "Em andamento";
      case "concluida":
        return "Concluída";
      case "cancelada":
        return "Cancelada";
    }
  }

  function formatarData(data: string) {
    return new Date(data).toLocaleDateString("pt-BR");
  }

  async function cancelarSolicitacao() {
    if (!solicitacao || cancelando) return;

    try {
      setCancelando(true);

      const usuario = await buscarUsuarioLogado();

      if (
        !usuario?.idReceptor ||
        usuario.idReceptor !== solicitacao.idReceptor
      ) {
        Alert.alert(
          "Erro",
          "Você não tem permissão para cancelar esta solicitação.",
        );
        return;
      }

      await atualizarStatus(solicitacao.id, "cancelada");

      Alert.alert(
        "Solicitação cancelada",
        "Seu pedido foi cancelado com sucesso.",
      );
    } catch (error) {
      console.log("Erro ao cancelar solicitação:", error);

      Alert.alert("Erro", "Não foi possível cancelar a solicitação.");
    } finally {
      setCancelando(false);
    }
  }

  function confirmarCancelamento() {
    Alert.alert(
      "Cancelar solicitação",
      "Tem certeza de que deseja cancelar este pedido?",
      [
        {
          text: "Voltar",
          style: "cancel",
        },
        {
          text: "Cancelar solicitação",
          style: "destructive",
          onPress: cancelarSolicitacao,
        },
      ],
    );
  }

  if (loading) {
    return (
      <View style={estilos.solicitacaoCarregando}>
        <ActivityIndicator size="large" color={cores.primary} />
      </View>
    );
  }

  if (!solicitacao) {
    return (
      <View style={estilos.solicitacaoCarregando}>
        <Text style={estilos.solicitacoesVazioTitulo}>
          Solicitação não encontrada
        </Text>

        <Text style={estilos.solicitacoesVazioTexto}>
          Não foi possível encontrar este pedido.
        </Text>

        <Pressable onPress={() => navigation.goBack()}>
          <Text style={estilos.solicitacaoVoltar}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={estilos.safe}>
      <ScrollView
        contentContainerStyle={estilos.cadastroScroll}
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={estilos.solicitacaoVoltar}>← Voltar</Text>
        </Pressable>

        <View style={estilos.cadastroHeader}>
          <Text style={estilos.cadastroTitulo}>Detalhes da solicitação</Text>

          <Text style={estilos.cadastroSubtitulo}>
            Acompanhe as informações do seu pedido.
          </Text>
        </View>

        {/* INFORMAÇÕES PRINCIPAIS */}
        <View style={estilos.solicitacaoDetalhesCard}>
          <Text style={estilos.solicitacaoDetalhesTitulo}>
            {solicitacao.titulo}
          </Text>

          <View style={estilos.solicitacaoDetalhesStatus}>
            <Text style={estilos.solicitacaoStatusTexto}>
              {formatarStatus(solicitacao.status)}
            </Text>
          </View>

          <Text style={estilos.solicitacaoDetalhesLabel}>Descrição</Text>

          <Text style={estilos.solicitacaoDetalhesDescricao}>
            {solicitacao.descricao}
          </Text>

          <View style={estilos.solicitacaoDetalhesDivisor} />

          <Text style={estilos.solicitacaoDetalhesLabel}>Tipo de ajuda</Text>

          <Text style={estilos.solicitacaoDetalhesValor}>
            {solicitacao.tipoAjuda === "geral"
              ? "Ajuda geral"
              : "Ajuda específica"}
          </Text>

          <Text style={estilos.solicitacaoDetalhesLabel}>
            Data de publicação
          </Text>

          <Text style={estilos.solicitacaoDetalhesValor}>
            {formatarData(solicitacao.dataCriacao)}
          </Text>
        </View>

        {/* ALIMENTOS SOLICITADOS */}
        {solicitacao.tipoAjuda === "especifico" && (
          <View style={estilos.solicitacaoDetalhesSecao}>
            <Text style={estilos.cadastroSecaoTitulo}>
              Alimentos solicitados
            </Text>

            {solicitacao.itens.length === 0 ? (
              <Text style={estilos.cadastroAjuda}>
                Nenhum alimento informado.
              </Text>
            ) : (
              solicitacao.itens.map((item) => (
                <View key={item.id} style={estilos.solicitacaoItem}>
                  <View style={{ flex: 1 }}>
                    <Text style={estilos.solicitacaoItemNome}>{item.nome}</Text>

                    <Text style={estilos.solicitacaoItemQuantidade}>
                      {item.quantidade} {item.unidade}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* CANCELAMENTO */}
        {solicitacao.status === "aberta" && (
          <Pressable
            style={estilos.solicitacaoCancelarBotao}
            onPress={confirmarCancelamento}
            disabled={cancelando}
          >
            {cancelando ? (
              <ActivityIndicator color={cores.danger} />
            ) : (
              <Text style={estilos.solicitacaoCancelarTexto}>
                Cancelar solicitação
              </Text>
            )}
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}
