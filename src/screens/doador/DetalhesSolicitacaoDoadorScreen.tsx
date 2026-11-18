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
import { DoadorNavigation, DoadorStackParamlist } from "../../types/Navigation";
import { StatusSolicitacao } from "../../types/Solicitacao";
import { useState } from "react";
import { useDoacoes } from "../../context/DoacoesContext";
import { buscarUsuarioLogado } from "../../services/AuthService";
import { SafeAreaView } from "react-native-safe-area-context";

type DetalhesRoute = RouteProp<
  DoadorStackParamlist,
  "DetalhesSolicitacaoDoador"
>;

export default function DetalhesSolicitacaoDoadorScreen() {
  const navigation = useNavigation<DoadorNavigation>();
  const route = useRoute<DetalhesRoute>();

  const { idSolicitacao } = route.params;

  const { solicitacoes, loading } = useSolicitacoes();

  const { adicionarDoacao, loading: loadingDoacoes } = useDoacoes();
  const [criandoDoacao, setCriandoDoacao] = useState(false);

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

  async function confirmarAjuda() {
    if (!solicitacao || criandoDoacao) return;

    try {
      setCriandoDoacao(true);

      const usuario = await buscarUsuarioLogado();

      if (!usuario?.idDoador) {
        Alert.alert("Erro", "Não foi possível identificar o doador.");
        return;
      }

      if (solicitacao.status !== "aberta") {
        Alert.alert(
          "Indisponível",
          "Esta solicitação não está mais disponível.",
        );
        return;
      }

      await adicionarDoacao(solicitacao.id, usuario.idDoador);

      Alert.alert(
        "Doação iniciada!",
        "Você começou a ajudar este beneficiário.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("DoadorTabs", {
              screen: "MinhasDoacoes"
            }),
          },
        ],
      );
    } catch (error) {
      console.log("Erro ao iniciar doação:", error);

      Alert.alert(
        "Erro",
        error instanceof Error
          ? error.message
          : "Não foi possível iniciar a doação.",
      );
    } finally {
      setCriandoDoacao(false);
    }
  }

  function iniciarDoacao() {
    Alert.alert(
      "Confirmar ajuda",
      "Deseja iniciar uma doação para esta solicitação?",
      [
        {
          text: "Voltar",
          style: "cancel",
        },
        {
          text: "Quero ajudar",
          onPress: confirmarAjuda,
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

  if (!solicitacao || solicitacao.status !== "aberta") {
    return (
      <View style={estilos.solicitacaoCarregando}>
        <Text style={estilos.solicitacoesVazioTitulo}>
          Solicitação indisponível
        </Text>

        <Text style={estilos.solicitacoesVazioTexto}>
          Esta solicitação não está mais disponível para receber ajuda.
        </Text>

        <Pressable onPress={() => navigation.goBack()}>
          <Text style={estilos.solicitacaoVoltar}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={estilos.safe} edges={["top", "bottom"]}>
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
            Veja como você pode contribuir.
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
          <Text style={estilos.solicitacaoDetalhesLabel}>Localização</Text>

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

        <View style={estilos.solicitacaoDetalhesSecao}>
          <Text style={estilos.cadastroSecaoTitulo}>Deseja ajudar?</Text>

          <Text style={estilos.cadastroAjuda}>
            Inicie uma doação e combine os detalhes pelo chat.
          </Text>

          <Pressable
            style={estilos.doadorQueroAjudar}
            onPress={iniciarDoacao}
            disabled={criandoDoacao || loadingDoacoes}
          >
            {criandoDoacao ? (
              <ActivityIndicator color={cores.white} />
            ) : (
              <Text style={estilos.doadorQueroAjudarTexto}>Quero ajudar</Text>
            )}
          </Pressable>

          <Text style={estilos.cadastroAjuda}>
            Ao confirmar, esta solicitação ficará vinculada á sua doação.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
