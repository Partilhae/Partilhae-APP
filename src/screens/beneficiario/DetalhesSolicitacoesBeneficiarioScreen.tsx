import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  useNavigation,
  useRoute,
  RouteProp,
  NavigationProp,
} from "@react-navigation/native";

import estilos, { cores } from "../../estilos/estilo";
import { useSolicitacoes } from "../../context/SolicitacoesContext";
import { StatusSolicitacao } from "../../types/Solicitacao";
import { buscarUsuarioLogado } from "../../services/AuthService";
import { BeneficiarioStackParamlist } from "../../types/Navigation";

export default function DetalhesSolicitacaoScreen() {
  const navigation =
    useNavigation<NavigationProp<BeneficiarioStackParamlist>>();

  const route =
    useRoute<
      RouteProp<BeneficiarioStackParamlist, "DetalhesSolicitacaoBeneficiario">
    >();

  const { idSolicitacao } = route.params;

  const { solicitacoes, loading, atualizarStatus, excluirSolicitacao } =
    useSolicitacoes();

  const [cancelando, setCancelando] = useState(false);

  const [excluindo, setExcluindo] = useState(false);

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

  function editarSolicitacao() {
    if (!solicitacao || solicitacao.status !== "aberta") {
      return;
    }

    navigation.navigate("EditarSolicitacaoBeneficiario", {
      idSolicitacao: solicitacao.id,
    });
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

  async function excluirPedido() {
    if (!solicitacao || excluindo) return;

    try {
      setExcluindo(true);

      const usuario = await buscarUsuarioLogado();

      if (
        !usuario?.idReceptor ||
        usuario.idReceptor !== solicitacao.idReceptor
      ) {
        Alert.alert(
          "Erro",
          "Você não tem permissão para excluir esta solicitação.",
        );
        return;
      }

      if (solicitacao.status !== "aberta") {
        Alert.alert(
          "Atenção",
          "Somente solicitações abertas podem ser excluídas.",
        );
        return;
      }

      await excluirSolicitacao(solicitacao.id);

      Alert.alert(
        "Solicitação excluída",
        "Seu pedido foi excluído com sucesso.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error) {
      console.log("Erro ao excluir solicitação:", error);

      Alert.alert("Erro", "Não foi possível excluir a solicitação.");
    } finally {
      setExcluindo(false);
    }
  }

  function confirmarExclusao() {
    Alert.alert(
      "Excluir solicitação",
      "Tem certeza de que deseja excluir este pedido? Essa ação não poderá ser desfeita.",
      [
        { text: "Voltar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: excluirPedido,
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

        {solicitacao.status === "aberta" && (
          <Pressable
            style={estilos.solicitacaoCancelarBotao}
            onPress={confirmarExclusao}
            disabled={excluindo || cancelando}
          >
            {excluindo ? (
              <ActivityIndicator color={cores.danger} />
            ) : (
              <Text style={estilos.solicitacaoCancelarTexto}>
                Excluir solicitação
              </Text>
            )}
          </Pressable>
        )}

        {solicitacao.status === "aberta" && (
          <Pressable
            style={estilos.solicitacoesNovoBotao}
            onPress={editarSolicitacao}
            disabled={cancelando || excluindo}
          >
            <Text style={estilos.solicitacoesNovoTexto}>
              Editar solicitação
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}
