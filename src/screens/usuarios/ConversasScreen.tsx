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

type ConversasNavigation = NavigationProp<{
  Chat: { idConversa: string };
}>;

export default function ConversasScreen() {
  const navigation = useNavigation<ConversasNavigation>();

  const { conversas, mensagens, loading } = useConversas();

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
              name="chatbubble-ellipses-outline"
              size={22}
              color={cores.primary}
            />
          </View>

          <View style={estilos.detailContent}>
            <Text style={estilos.itemTitle}>Conversa sobre a doação</Text>

            <Text style={estilos.itemSubtitle} numberOfLines={2}>
              {ultima?.texto ?? "Nenhuma mensagem enviada."}
            </Text>

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

  if (loading || carregandoUsuario) {
    return (
      <View style={estilos.loading}>
        <ActivityIndicator size="large" color={cores.primary} />
      </View>
    );
  }

  return (
    <View style={estilos.safe}>
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
              Quando você iniciar uma conversa sobre uma doação, ela aparecerá
              aqui.
            </Text>
          </View>
        }
      />
    </View>
  );
}
