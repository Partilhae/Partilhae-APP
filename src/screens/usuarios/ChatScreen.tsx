import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  NavigationProp,
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";

import estilos, { cores } from "../../estilos/estilo";
import { useConversas } from "../../context/ConversasContext";
import { useDoacoes } from "../../context/DoacoesContext";
import { useSolicitacoes } from "../../context/SolicitacoesContext";
import { buscarUsuarioLogado } from "../../services/AuthService";
import { UsuarioLogado } from "../../types/Auth";
import { Mensagem } from "../../types/Conversa";
import MensagemForm from "../../components/forms/MensagemForm";
import {
  BeneficiarioStackParamlist,
  DoadorStackParamlist,
} from "../../types/Navigation";

type ChatRoute = RouteProp<{ Chat: { idConversa: string } }, "Chat">;

export default function ChatScreen() {
  const navigation =
    useNavigation<
      NavigationProp<DoadorStackParamlist | BeneficiarioStackParamlist>
    >();

  const route = useRoute<ChatRoute>();
  const { idConversa } = route.params;

  const {
    conversas,
    loading: loadingConversas,
    enviarMensagem,
    listarMensagens,
  } = useConversas();

  const { doacoes, loading: loadingDoacoes } = useDoacoes();
  const { solicitacoes, loading: loadingSolicitacoes } = useSolicitacoes();

  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);
  const [carregandoUsuario, setCarregandoUsuario] = useState(true);
  const [enviando, setEnviando] = useState(false);

  const listaRef = useRef<FlatList<Mensagem>>(null);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      async function carregarUsuario() {
        setCarregandoUsuario(true);
        setUsuario(null);

        try {
          const dados = await buscarUsuarioLogado();

          if (ativo) setUsuario(dados);
        } catch (error) {
          console.log("Erro ao carregar usuário:", error);

          if (ativo) setUsuario(null);
        } finally {
          if (ativo) setCarregandoUsuario(false);
        }
      }

      carregarUsuario();

      return () => {
        ativo = false;
      };
    }, []),
  );

  const conversa = conversas.find((item) => item.id === idConversa);

  const doacao = doacoes.find((item) => item.id === conversa?.idDoacao);

  const solicitacao = solicitacoes.find(
    (item) => item.id === doacao?.idSolicitacao,
  );

  const doacaoConcluida = doacao?.status === "concluida";
  const doacaoCancelada = doacao?.status === "cancelada";
  const conversaEncerrada = doacaoConcluida || doacaoCancelada;

  const participante =
    usuario != null &&
    conversa != null &&
    (conversa.idUsuarioDoador === usuario.idUsuario ||
      conversa.idUsuarioBeneficiario === usuario.idUsuario);

  const idUsuarioDenunciado =
    usuario?.idUsuario === conversa?.idUsuarioDoador
      ? conversa?.idUsuarioBeneficiario
      : conversa?.idUsuarioDoador;

  const mensagensDaConversa = listarMensagens(idConversa);

  async function enviar(texto: string) {
    if (!usuario || !participante) {
      throw new Error("Usuário sem acesso à conversa.");
    }

    if (conversaEncerrada) {
      Alert.alert(
        "Conversa encerrada",
        "Esta conversa está disponível apenas para consulta.",
      );
      return;
    }

    setEnviando(true);

    try {
      await enviarMensagem(idConversa, usuario.idUsuario, texto);
    } finally {
      setEnviando(false);
    }
  }

  function abrirDenuncia() {
    if (
      !participante ||
      !idUsuarioDenunciado ||
      !Number.isInteger(idUsuarioDenunciado) ||
      idUsuarioDenunciado <= 0 ||
      idUsuarioDenunciado === usuario?.idUsuario
    ) {
      Alert.alert("Erro", "Não foi possível identificar o usuário denunciado.");
      return;
    }

    navigation.navigate("NovaDenuncia", {
      idUsuarioDenunciado,
    });
  }

  function renderizarMensagem({ item }: { item: Mensagem }) {
    const minhaMensagem = item.idRemetente === usuario?.idUsuario;

    return (
      <View
        style={[
          estilos.chatMensagem,
          minhaMensagem
            ? estilos.chatMensagemMinha
            : estilos.chatMensagemRecebida,
        ]}
      >
        <Text style={estilos.chatMensagemTexto}>{item.texto}</Text>

        <Text style={estilos.chatMensagemHorario}>
          {new Date(item.dataEnvio).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    );
  }

  if (
    loadingConversas ||
    loadingDoacoes ||
    loadingSolicitacoes ||
    carregandoUsuario
  ) {
    return (
      <View style={estilos.loading}>
        <ActivityIndicator size="large" color={cores.primary} />
      </View>
    );
  }

  if (!usuario || !conversa || !participante) {
    return (
      <SafeAreaView style={estilos.safe} edges={["top", "bottom"]}>
        <View style={estilos.pageContent}>
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={estilos.solicitacaoVoltar}>← Voltar</Text>
          </Pressable>

          <View style={estilos.emptyState}>
            <Text style={estilos.emptyTitle}>Conversa indisponível</Text>

            <Text style={estilos.emptyText}>
              Não foi possível acessar esta conversa.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={estilos.safe} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={estilos.chatContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={estilos.chatHeader}>
          <View style={estilos.chatHeaderAcoes}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={estilos.chatAcao}
            >
              <Ionicons name="arrow-back" size={20} color={cores.primary} />

              <Text style={estilos.linkText}>Voltar</Text>
            </Pressable>

            <Pressable onPress={abrirDenuncia} style={estilos.chatAcao}>
              <Ionicons name="flag-outline" size={17} color={cores.danger} />

              <Text style={estilos.chatDenunciarTexto}>Denunciar</Text>
            </Pressable>
          </View>

          <Text style={estilos.cardTitle} numberOfLines={2}>
            {solicitacao?.titulo || "Chat da doação"}
          </Text>

          <Text style={estilos.pageSubtitle}>
            {conversaEncerrada
              ? "Histórico da conversa"
              : "Combine os detalhes da entrega por aqui."}
          </Text>
        </View>

        <FlatList
          ref={listaRef}
          style={estilos.chatContainer}
          data={mensagensDaConversa}
          keyExtractor={(item) => item.id}
          renderItem={renderizarMensagem}
          contentContainerStyle={estilos.chatMensagens}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() =>
            listaRef.current?.scrollToEnd({
              animated: true,
            })
          }
          ListEmptyComponent={
            <View style={estilos.emptyState}>
              <Text style={estilos.emptyTitle}>Nenhuma mensagem ainda</Text>

              <Text style={estilos.emptyText}>
                {conversaEncerrada
                  ? "Esta conversa não possui mensagens registradas."
                  : "Envie a primeira mensagem para combinar a entrega!"}
              </Text>
            </View>
          }
        />

        <View style={estilos.chatRodape}>
          {conversaEncerrada ? (
            <View
              style={[
                estilos.chatFinalizado,
                doacaoCancelada && estilos.conversaStatusCancelada,
              ]}
            >
              <Ionicons
                name={
                  doacaoConcluida
                    ? "checkmark-circle-outline"
                    : "close-circle-outline"
                }
                size={24}
                color={doacaoConcluida ? cores.success : cores.danger}
              />

              <Text
                style={[
                  estilos.chatFinalizadoTitulo,
                  doacaoCancelada && estilos.conversaStatusTextoCancelada,
                ]}
              >
                {doacaoConcluida
                  ? "Doação realizada e finalizada!"
                  : "Doação cancelada"}
              </Text>

              <Text style={estilos.chatFinalizadoTexto}>
                {doacaoConcluida
                  ? "O recebimento foi confirmado. Esta conversa foi encerrada."
                  : "Esta doação foi cancelada. A conversa está disponível para consulta."}
              </Text>
            </View>
          ) : (
            <MensagemForm onSubmit={enviar} loading={enviando} />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
