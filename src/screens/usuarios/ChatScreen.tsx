import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
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

          if (ativo) {
            setUsuario(dados);
          }
        } catch (error) {
          console.log("Erro ao carregar usuário:", error);

          if (ativo) {
            setUsuario(null);
          }
        } finally {
          if (ativo) {
            setCarregandoUsuario(false);
          }
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
          estilos.card,
          {
            alignSelf: minhaMensagem ? "flex-end" : "flex-start",
            maxWidth: "85%",
            backgroundColor: minhaMensagem ? cores.primarySoft : cores.white,
          },
        ]}
      >
        <Text style={estilos.infoText}>{item.texto}</Text>

        <Text style={estilos.itemSubtitle}>
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
      <View style={estilos.emptyState}>
        <Text style={estilos.emptyTitle}>Conversa indisponível</Text>

        <Text style={estilos.emptyText}>
          Não foi possível acessar esta conversa.
        </Text>
      </View>
    );
  }

  return (
    <View style={[estilos.safe, { flex: 1 }]}>
      <View
        style={[
          estilos.header,
          {
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: cores.border,
          },
        ]}
      >
        <Text style={estilos.pageTitle}>
          {solicitacao?.titulo || "Chat da doação"}
        </Text>
        <Text style={estilos.pageSubtitle}>
          Converse para combinar a entrega dos alimentos.
        </Text>
        <Pressable
          onPress={abrirDenuncia}
          style={{
            alignSelf: "flex-start",
            marginTop: 12,
            paddingVertical: 8,
          }}
        >
          <Text
            style={{
              color: cores.danger,
              fontWeight: "600",
            }}
          >
            Denunciar usuário
          </Text>
        </Pressable>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={estilos.pageTitle}>
          {solicitacao?.titulo || "Chat da doação"}
        </Text>

        <Text style={estilos.pageSubtitle}>
          Converse para combinar a entrega dos alimentos.
        </Text>
      </View>

      <FlatList
        ref={listaRef}
        data={mensagensDaConversa}
        keyExtractor={(item) => item.id}
        renderItem={renderizarMensagem}
        contentContainerStyle={[estilos.pageContent, { flexGrow: 1 }]}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() =>
          listaRef.current?.scrollToEnd({
            animated: true,
          })
        }
        ListEmptyComponent={
          <View style={estilos.emptyState}>
            <Text style={estilos.emptyTitle}>Nenhuma mensagem ainda</Text>

            <Text style={estilos.emptyText}>
              Envie a primeira mensagem para começar a conversa!
            </Text>
          </View>
        }
      />

      <View
        style={{
          padding: 16,
          backgroundColor: cores.white,
          borderTopWidth: 1,
          borderTopColor: cores.border,
        }}
      >
        <MensagemForm onSubmit={enviar} loading={enviando} />
      </View>
    </View>
  );
}
