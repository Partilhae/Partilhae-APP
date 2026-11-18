import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { useDoacoes } from "../../context/DoacoesContext";
import { useSolicitacoes } from "../../context/SolicitacoesContext";
import { useConversas } from "../../context/ConversasContext";
import { buscarUsuarioLogado } from "../../services/AuthService";
import {
  BeneficiarioNavigation,
  BeneficiarioStackParamlist,
} from "../../types/Navigation";

import Botao from "../../components/Botao";
import estilos, { cores } from "../../estilos/estilo";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusDoacao } from "../../types/Doacao";

type DetalhesDoacaoRoute = RouteProp<
  BeneficiarioStackParamlist,
  "DetalhesDoacoesRecebidasBeneficiario"
>;

export default function DetalhesDoacaoRecebidaBeneficiarioScreen() {
  const navigation = useNavigation<BeneficiarioNavigation>();
  const route = useRoute<DetalhesDoacaoRoute>();

  const { idDoacao } = route.params;

  const {
    doacoes,
    loading: loadingDoacoes,
    atualizarStatusDoacao,
  } = useDoacoes();

  const { solicitacoes, loading: loadingSolicitacoes } = useSolicitacoes();

  const { iniciarConversa, loading: loadingConversas } = useConversas();

  const [confirmando, setConfirmando] = useState(false);
  const [abrindoChat, setAbrindoChat] = useState(false);

  const doacao = doacoes.find((item) => item.id === idDoacao);

  const solicitacao = solicitacoes.find(
    (item) => item.id === doacao?.idSolicitacao,
  );

  async function abrirChat() {
    if (!doacao || abrindoChat || loadingConversas) return;

    try {
      setAbrindoChat(true);

      const usuario = await buscarUsuarioLogado();

      if (
        !usuario ||
        usuario.role !== "RECEPTOR" ||
        usuario.idReceptor !== doacao.idReceptor ||
        usuario.idUsuario !== doacao.idUsuarioBeneficiario
      ) {
        Alert.alert(
          "Acesso negado",
          "Você não tem permissão para acessar esta conversa.",
        );
        return;
      }

      if (
        !Number.isInteger(doacao.idUsuarioDoador) ||
        !Number.isInteger(doacao.idUsuarioBeneficiario) ||
        doacao.idUsuarioDoador <= 0 ||
        doacao.idUsuarioBeneficiario <= 0
      ) {
        Alert.alert(
          "Conversa indisponível",
          "Esta doação não possui os dados necessários para iniciar uma conversa.",
        );
        return;
      }

      const conversa = await iniciarConversa(
        doacao.id,
        doacao.idUsuarioDoador,
        doacao.idUsuarioBeneficiario,
      );

      navigation.navigate("Chat", {
        idConversa: conversa.id,
      });
    } catch (error) {
      console.log("Erro ao abrir chat:", error);

      Alert.alert(
        "Erro",
        error instanceof Error
          ? error.message
          : "Não foi possível abrir a conversa.",
      );
    } finally {
      setAbrindoChat(false);
    }
  }

  function confirmarRecebimento() {
    Alert.alert(
      "Confirmar recebimento",
      "Você confirma que recebeu a doação?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: finalizarDoacao,
        },
      ],
    );
  }

  async function finalizarDoacao() {
    if (!doacao || confirmando) return;

    try {
      setConfirmando(true);

      const usuario = await buscarUsuarioLogado();

      if (
        !usuario ||
        usuario.role !== "RECEPTOR" ||
        usuario.idReceptor !== doacao.idReceptor
      ) {
        Alert.alert(
          "Acesso negado",
          "Você não tem permissão para confirmar esta doação.",
        );
        return;
      }

      await atualizarStatusDoacao(idDoacao, "concluida");

      navigation.goBack();
    } catch (error) {
      console.log("Erro ao confirmar recebimento:", error);

      Alert.alert("Erro", "Não foi possível confirmar o recebimento.");
    } finally {
      setConfirmando(false);
    }
  }

  if (loadingDoacoes || loadingSolicitacoes) {
    return (
      <View style={estilos.loading}>
        <ActivityIndicator size="large" color={cores.primary} />
      </View>
    );
  }

  if (!doacao || !solicitacao) {
    return (
      <View style={estilos.safe}>
        <View style={estilos.pageContent}>
          <Text style={estilos.emptyTitle}>Doação não encontrada</Text>

          <Text style={estilos.emptyText}>
            Não foi possível carregar os detalhes desta doação.
          </Text>

          <Botao label="Voltar" onPress={() => navigation.goBack()} />
        </View>
      </View>
    );
  }

  function estiloStatus(status: StatusDoacao) {
    switch (status) {
      case "em_andamento":
        return {
          fundo: estilos.conversaStatusEmAndamento,
          texto: estilos.conversaStatusTextoEmAndamento,
        };

      case "entregue":
        return {
          fundo: estilos.conversaStatusEntregue,
          texto: estilos.conversaStatusTextoEntregue,
        };

      case "concluida":
        return {
          fundo: estilos.conversaStatusConcluida,
          texto: estilos.conversaStatusTextoConcluida,
        };

      case "cancelada":
        return {
          fundo: estilos.conversaStatusCancelada,
          texto: estilos.conversaStatusTextoCancelada,
        };
    }
  }

  const statusTexto = {
    em_andamento: "Em andamento",
    entregue: "Aguardando confirmação",
    concluida: "Concluída",
    cancelada: "Cancelada",
  }[doacao.status];

  return (
    <SafeAreaView style={estilos.safe} edges={["top", "bottom"]}>
      <ScrollView
        contentContainerStyle={estilos.cadastroScroll}
        showsVerticalScrollIndicator={false}
      >
        <Pressable style={estilos.backBtn} onPress={() => navigation.goBack()}>
          <Text style={estilos.backBtnText}>← Voltar</Text>
        </Pressable>

        <View style={estilos.cadastroHeader}>
          <Text style={estilos.cadastroTitulo}>Detalhes da doação</Text>

          <Text style={estilos.cadastroSubtitulo}>
            Acompanhe a ajuda recebida.
          </Text>
        </View>

        <View style={estilos.solicitacaoDetalhesCard}>
          <Text style={estilos.solicitacaoDetalhesTitulo}>
            {solicitacao.titulo}
          </Text>

          <Text style={estilos.solicitacaoDetalhesDescricao}>
            {solicitacao.descricao}
          </Text>

          <View style={estilos.solicitacaoDetalhesDivisor} />

          <Text style={estilos.solicitacaoDetalhesLabel}>Status da doação</Text>

          <View
            style={[
              estilos.solicitacaoDetalhesStatus,
              estiloStatus(doacao.status).fundo,
            ]}
          >
            <Text
              style={[
                estilos.solicitacaoStatusTexto,
                estiloStatus(doacao.status).texto,
              ]}
            >
              {statusTexto}
            </Text>
          </View>

          <Text style={estilos.itemSubtitle}>
            Registrada em:{" "}
            {new Date(doacao.dataCriacao).toLocaleDateString("pt-BR")}
          </Text>

          {doacao.dataConclusao && (
            <Text style={estilos.itemSubtitle}>
              Concluída em:{" "}
              {new Date(doacao.dataConclusao).toLocaleDateString("pt-BR")}
            </Text>
          )}
        </View>

        {solicitacao.tipoAjuda === "especifico" && (
          <View style={estilos.section}>
            <Text style={estilos.sectionTitle}>Alimentos solicitados</Text>

            {solicitacao.itens.length > 0 ? (
              solicitacao.itens.map((item) => (
                <View key={item.id} style={estilos.solicitacaoItem}>
                  <View style={estilos.detailContent}>
                    <Text style={estilos.itemTitle}>{item.nome}</Text>

                    <Text style={estilos.itemSubtitle}>
                      {item.quantidade} {item.unidade}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={estilos.emptyText}>Nenhum alimento informado.</Text>
            )}
          </View>
        )}

        {(doacao.status === "em_andamento" || doacao.status === "entregue") && (
          <View style={estilos.section}>
            <Text style={estilos.sectionTitle}>Comunicação</Text>

            <Text style={estilos.pageSubtitle}>
              Combine os detalhes da entrega pelo chat.
            </Text>

            <Botao
              label="Abrir conversa"
              onPress={abrirChat}
              loading={abrindoChat || loadingConversas}
            />
          </View>
        )}

        {doacao.status === "entregue" && (
          <View style={estilos.section}>
            <Text style={estilos.sectionTitle}>Confirmar recebimento</Text>

            <Text style={estilos.pageSubtitle}>
              O doador informou que realizou a entrega. Confirme somente se você
              recebeu a doação.
            </Text>

            <Botao
              label="Confirmar recebimento"
              onPress={confirmarRecebimento}
              loading={confirmando}
            />
          </View>
        )}

        {doacao.status === "concluida" && (
          <View style={estilos.section}>
            <View style={estilos.card}>
              <View style={estilos.infoRow}>
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={cores.success}
                />

                <Text style={estilos.itemTitle}>Doação concluída</Text>
              </View>

              <Text style={estilos.cardDescription}>
                O recebimento desta doação foi confirmado.
              </Text>
            </View>
          </View>
        )}

        {doacao.status === "cancelada" && (
          <View style={estilos.card}>
            <View style={estilos.infoRow}>
                <Ionicons
                  name="alert-circle"
                  size={24}
                  color={cores.danger}
                />

                <Text style={estilos.itemTitle}>Cancelada</Text>
              </View>
            <Text style={estilos.cardDescription}>
              Esta doação foi cancelada.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
