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

import estilos, { cores } from "../../estilos/estilo";
import { useDoacoes } from "../../context/DoacoesContext";
import { useSolicitacoes } from "../../context/SolicitacoesContext";
import { buscarUsuarioLogado } from "../../services/AuthService";
import { DoadorNavigation, DoadorStackParamlist } from "../../types/Navigation";
import { StatusDoacao } from "../../types/Doacao";
import { useConversas } from "../../context/ConversasContext";

type DetalhesRoute = RouteProp<DoadorStackParamlist, "DetalhesDoacaoDoador">;

export default function DetalhesDoacaoDoadorScreen() {
  const navigation = useNavigation<DoadorNavigation>();
  const route = useRoute<DetalhesRoute>();

  const { iniciarConversa, loading: loadingConversas } = useConversas();

  const [abrindoChat, setAbrindoChat] = useState(false);

  const { idDoacao } = route.params;

  const {
    doacoes,
    loading: loadingDoacoes,
    atualizarStatusDoacao,
  } = useDoacoes();

  const { solicitacoes, loading: loadingSolicitacoes } = useSolicitacoes();

  const [salvando, setSalvando] = useState(false);

  const doacao = doacoes.find((item) => item.id === idDoacao);

  const solicitacao = solicitacoes.find(
    (item) => item.id === doacao?.idSolicitacao,
  );

  function formatarStatus(status: StatusDoacao) {
    switch (status) {
      case "em_andamento":
        return "Em andamento";
      case "entregue":
        return "Entrega informada";
      case "concluida":
        return "Concluída";
      case "cancelada":
        return "Cancelada";
    }
  }

  function formatarData(data: string) {
    return new Date(data).toLocaleDateString("pt-BR");
  }

  async function abrirChat() {
    if (!doacao || abrindoChat || loadingConversas) return;

    try {
      setAbrindoChat(true);

      const usuario = await buscarUsuarioLogado();

      if (
        !usuario ||
        usuario.role !== "DOADOR" ||
        usuario.idDoador !== doacao.idDoador ||
        usuario.idUsuario !== doacao.idUsuarioDoador
      ) {
        Alert.alert(
          "Acesso negado",
          "Você não tem permissão para acessar esta conversa.",
        );
        return;
      }

      if (
        !Number.isInteger(doacao.idUsuarioDoador) ||
        !Number.isInteger(doacao.idUsuarioBeneficiario)
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

  async function alterarStatus(novoStatus: StatusDoacao) {
    if (!doacao || salvando) return;

    try {
      setSalvando(true);

      const usuario = await buscarUsuarioLogado();

      if (usuario?.idDoador == null || usuario.idDoador !== doacao.idDoador) {
        Alert.alert("Erro", "Você não tem permissão para alterar esta doação.");
        return;
      }

      if (doacao.status !== "em_andamento") {
        Alert.alert("Atenção", "Esta doação não pode mais ser alterada.");
        return;
      }

      await atualizarStatusDoacao(doacao.id, novoStatus);

      Alert.alert(
        "Sucesso!",
        novoStatus === "entregue"
          ? "A entrega foi informada. Aguarde a confirmação do beneficiário."
          : "A doação foi cancelada.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error) {
      console.log("Erro ao atualizar doação:", error);

      Alert.alert(
        "Erro",
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar a doação.",
      );
    } finally {
      setSalvando(false);
    }
  }

  function confirmarEntrega() {
    Alert.alert(
      "Informar entrega",
      "Você confirma que entregou os alimentos ao beneficiário?",
      [
        { text: "Voltar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: () => alterarStatus("entregue"),
        },
      ],
    );
  }

  function confirmarCancelamento() {
    Alert.alert(
      "Cancelar doação",
      "Deseja cancelar esta doação? A solicitação ficará disponível novamente.",
      [
        { text: "Voltar", style: "cancel" },
        {
          text: "Cancelar doação",
          style: "destructive",
          onPress: () => alterarStatus("cancelada"),
        },
      ],
    );
  }

  if (loadingDoacoes || loadingSolicitacoes) {
    return (
      <View style={estilos.solicitacaoCarregando}>
        <ActivityIndicator size="large" color={cores.primary} />
      </View>
    );
  }

  if (!doacao) {
    return (
      <View style={estilos.solicitacaoCarregando}>
        <Text style={estilos.solicitacoesVazioTitulo}>
          Doação não encontrada
        </Text>
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
          <Text style={estilos.cadastroTitulo}>Detalhes da doação</Text>

          <Text style={estilos.cadastroSubtitulo}>
            Acompanhe sua contribuição.
          </Text>
        </View>

        <View style={estilos.solicitacaoDetalhesCard}>
          <Text style={estilos.solicitacaoDetalhesTitulo}>
            {solicitacao?.titulo ?? "Solicitação indisponível"}
          </Text>

          <Text style={estilos.solicitacaoDetalhesLabel}>Status</Text>

          <Text style={estilos.solicitacaoDetalhesValor}>
            {formatarStatus(doacao.status)}
          </Text>

          <Text style={estilos.solicitacaoDetalhesLabel}>Data de início</Text>

          <Text style={estilos.solicitacaoDetalhesValor}>
            {formatarData(doacao.dataCriacao)}
          </Text>

          {doacao.dataConclusao && (
            <>
              <Text style={estilos.solicitacaoDetalhesLabel}>
                Data de conclusão
              </Text>

              <Text style={estilos.solicitacaoDetalhesValor}>
                {formatarData(doacao.dataConclusao)}
              </Text>
            </>
          )}

          {solicitacao && (
            <>
              <View style={estilos.solicitacaoDetalhesDivisor} />

              <Text style={estilos.solicitacaoDetalhesLabel}>
                Descrição da solicitação
              </Text>

              <Text style={estilos.solicitacaoDetalhesDescricao}>
                {solicitacao.descricao}
              </Text>

              {solicitacao.tipoAjuda === "especifico" &&
                solicitacao.itens.map((item) => (
                  <View key={item.id} style={estilos.solicitacaoItem}>
                    <Text style={estilos.solicitacaoItemNome}>{item.nome}</Text>

                    <Text style={estilos.solicitacaoItemQuantidade}>
                      {item.quantidade} {item.unidade}
                    </Text>
                  </View>
                ))}
            </>
          )}
        </View>

        {doacao.status !== "cancelada" && (
          <View style={estilos.solicitacaoDetalhesSecao}>
            <Text style={estilos.cadastroSecaoTitulo}>Comunicação</Text>

            <Text style={estilos.cadastroAjuda}>
              Converse com o beneficiário para combinar os detalhes da entrega
              dos alimentos.
            </Text>

            <Pressable
              style={estilos.doadorQueroAjudar}
              onPress={abrirChat}
              disabled={abrindoChat}
            >
              {abrindoChat ? (
                <ActivityIndicator color={cores.white} />
              ) : (
                <Text style={estilos.doadorQueroAjudarTexto}>
                  Conversar com beneficiário
                </Text>
              )}
            </Pressable>
          </View>
        )}

        {doacao.status === "em_andamento" && (
          <View style={estilos.solicitacaoDetalhesSecao}>
            <Text style={estilos.cadastroSecaoTitulo}>Gerenciar doação</Text>

            <Text style={estilos.cadastroAjuda}>
              Após realizar a entrega, informe para que o beneficiário possa
              confirmar o recebimento.
            </Text>

            <Pressable
              style={estilos.doadorQueroAjudar}
              onPress={confirmarEntrega}
              disabled={salvando}
            >
              <Text style={estilos.doadorQueroAjudarTexto}>
                Informar entrega
              </Text>
            </Pressable>

            <Pressable onPress={confirmarCancelamento} disabled={salvando}>
              <Text style={estilos.solicitacaoVoltar}>Cancelar doação</Text>
            </Pressable>
          </View>
        )}

        {doacao.status === "entregue" && (
          <Text style={estilos.cadastroAjuda}>
            Entrega informada. Aguardando a confirmação do beneficiário.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
