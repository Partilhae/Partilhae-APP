import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import estilos, { cores } from "../../estilos/estilo";
import { useConversas } from "../../context/ConversasContext";
import { buscarUsuarioLogado } from "../../services/AuthService";
import { Conversa } from "../../types/Conversa";
import { UsuarioLogado } from "../../types/Auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDoacoes } from "../../context/DoacoesContext";
import { useSolicitacoes } from "../../context/SolicitacoesContext";

type ConversasNavigation = NavigationProp<{
  Chat: { idConversa: string };
}>;

export default function ConversasScreen() {
  const navigation = useNavigation<ConversasNavigation>();

  const { conversas, mensagens, loading } = useConversas();
  const { doacoes, loading: loadingDoacoes } = useDoacoes();
  const { solicitacoes, loading: loadingSolicitacoes } = useSolicitacoes();

  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);
  const [carregandoUsuario, setCarregandoUsuario] = useState(true);

  useEffect(() => {
    carregarUsuario();
  }, []);

  async function carregarUsuario() {
    try {
      const dados = await buscarUsuarioLogado();
      setUsuario(dados);
    } catch (error) {
      console.log("Erro ao carregar usuário:", error);
    } finally {
      setCarregandoUsuario(false);
    }
  }

  function ultimaMensagem(idConversa: string) {
    return mensagens
      .filter((mensagem) => mensagem.idConversa === idConversa)
      .sort(
        (a, b) =>
          new Date(b.dataEnvio).getTime() - new Date(a.dataEnvio).getTime(),
      )[0];
  }

  const minhasConversas = conversas
    .filter(
      (conversa) =>
        conversa.idUsuarioDoador === usuario?.idUsuario ||
        conversa.idUsuarioBeneficiario === usuario?.idUsuario,
    )
    .sort((a, b) => {
      const dataA = ultimaMensagem(a.id)?.dataEnvio ?? a.dataCriacao;

      const dataB = ultimaMensagem(b.id)?.dataEnvio ?? b.dataCriacao;

      return new Date(dataB).getTime() - new Date(dataA).getTime();
    });

  function renderizarConversa({ item }: { item: Conversa }) {
    const ultima = ultimaMensagem(item.id);

    const doacao = doacoes.find((doacao) => doacao.id === item.idDoacao);

    const solicitacao = solicitacoes.find(
      (solicitacao) => solicitacao.id === doacao?.idSolicitacao,
    );

    const concluida = doacao?.status === "concluida";
    const cancelada = doacao?.status === "cancelada";
    const entregue = doacao?.status === "entregue";

    const textoStatus = concluida
      ? "Doação concluída"
      : cancelada
        ? "Doação cancelada"
        : entregue
          ? "Aguardando confirmação"
          : "Em andamento";

    const estiloStatus = concluida
      ? estilos.conversaStatusConcluida
      : cancelada
        ? estilos.conversaStatusCancelada
        : entregue
          ? estilos.conversaStatusEntregue
          : estilos.conversaStatusEmAndamento;

    const estiloTextoStatus = concluida
      ? estilos.conversaStatusTextoConcluida
      : cancelada
        ? estilos.conversaStatusTextoCancelada
        : entregue
          ? estilos.conversaStatusTextoEntregue
          : estilos.conversaStatusTextoEmAndamento;

    return (
      <Pressable
        style={estilos.solicitacaoCard}
        onPress={() =>
          navigation.navigate("Chat", {
            idConversa: item.id,
          })
        }
      >
        <View style={estilos.cardRow}>
          <View style={estilos.detailIcon}>
            <Ionicons
              name={
                concluida
                  ? "checkmark-circle-outline"
                  : "chatbubble-ellipses-outline"
              }
              size={22}
              color={concluida ? cores.success : cores.primary}
            />
          </View>

          <View style={estilos.detailContent}>
            <Text style={estilos.itemTitle} numberOfLines={1}>
              {solicitacao?.titulo ?? "Conversa sobre a doação"}
            </Text>

            <Text style={estilos.itemSubtitle} numberOfLines={2}>
              {ultima?.texto ?? "Nenhuma mensagem enviada."}
            </Text>

            <View style={estilos.conversaStatusRow}>
              <View style={[estilos.statusBadge, estiloStatus]}>
                <Text style={[estilos.statusBadgeText, estiloTextoStatus]}>
                  {textoStatus}
                </Text>
              </View>

              {(concluida || cancelada) && (
                <Text style={estilos.itemSubtitle}>Histórico disponível</Text>
              )}
            </View>

            {ultima && (
              <Text style={estilos.solicitacaoCardData}>
                {new Date(ultima.dataEnvio).toLocaleDateString("pt-BR")}
              </Text>
            )}
          </View>

          <Ionicons name="chevron-forward" size={20} color={cores.muted} />
        </View>
      </Pressable>
    );
  }

  if (loading || loadingDoacoes || loadingSolicitacoes || carregandoUsuario) {
    return (
      <View style={estilos.loading}>
        <ActivityIndicator size="large" color={cores.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={estilos.safe} edges={["top"]}>
      <FlatList
        data={minhasConversas}
        keyExtractor={(item) => item.id}
        renderItem={renderizarConversa}
        contentContainerStyle={estilos.solicitacoesScroll}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={estilos.solicitacoesHeader}>
            <Text style={estilos.cadastroTitulo}>Conversas</Text>

            <Text style={estilos.cadastroSubtitulo}>
              Acompanhe suas conversas sobre as doações.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={estilos.solicitacoesVazio}>
            <Ionicons
              name="chatbubbles-outline"
              size={42}
              color={cores.muted}
            />

            <Text style={estilos.solicitacoesVazioTitulo}>
              Nenhuma conversa encontrada
            </Text>

            <Text style={estilos.solicitacoesVazioTexto}>
              Suas conversas aparecerão aqui.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
