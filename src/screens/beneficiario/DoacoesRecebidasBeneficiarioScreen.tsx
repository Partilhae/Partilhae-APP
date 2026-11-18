import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";

import estilos, { cores } from "../../estilos/estilo";
import { useDoacoes } from "../../context/DoacoesContext";
import { useSolicitacoes } from "../../context/SolicitacoesContext";
import { buscarUsuarioLogado } from "../../services/AuthService";
import { Doacao, StatusDoacao } from "../../types/Doacao";
import { useNavigation } from "@react-navigation/native";
import { BeneficiarioNavigation } from "../../types/Navigation";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DoacoesRecebidasBeneficiarioScreen() {
  const navigation = useNavigation<BeneficiarioNavigation>();
  const { doacoes, loading } = useDoacoes();
  const { solicitacoes, loading: loadingSolicitacoes } = useSolicitacoes();

  const [idReceptor, setIdReceptor] = useState<number | null>(null);
  const [carregandoUsuario, setCarregandoUsuario] = useState(true);
  const [erroUsuario, setErroUsuario] = useState(false);

  useEffect(() => {
    carregarUsuario();
  }, []);

  async function carregarUsuario() {
    try {
      setCarregandoUsuario(true);
      setErroUsuario(false);

      const usuario = await buscarUsuarioLogado();

      if (usuario?.idReceptor == null) {
        setErroUsuario(true);
        return;
      }

      setIdReceptor(usuario.idReceptor);
    } catch (error) {
      console.log("Erro ao carregar beneficiário:", error);
      setErroUsuario(true);
    } finally {
      setCarregandoUsuario(false);
    }
  }

  function formatarStatus(status: StatusDoacao) {
    switch (status) {
      case "em_andamento":
        return "Em andamento";
      case "entregue":
        return "Aguardando confirmação";
      case "concluida":
        return "Concluída";
      case "cancelada":
        return "Cancelada";
    }
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

  function formatarData(data: string) {
    return new Date(data).toLocaleDateString("pt-BR");
  }

  const minhasDoacoes = doacoes
    .filter((doacao) => doacao.idReceptor === idReceptor)
    .sort(
      (a, b) =>
        new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime(),
    );

  function renderizarDoacao({ item }: { item: Doacao }) {
    const solicitacao = solicitacoes.find(
      (solicitacao) => solicitacao.id === item.idSolicitacao,
    );

    return (
      <Pressable
        style={estilos.solicitacaoCard}
        onPress={() =>
          navigation.navigate("DetalhesDoacoesRecebidasBeneficiario", {
            idDoacao: item.id,
          })
        }
      >
        <View style={estilos.solicitacaoCardTopo}>
          <Text style={estilos.solicitacaoCardTitulo} numberOfLines={2}>
            {solicitacao?.titulo ?? "Solicitação indisponível"}
          </Text>

          <View style={[estilos.statusBadge, estiloStatus(item.status).fundo]}>
            <Text
              style={[estilos.statusBadgeText, estiloStatus(item.status).texto]}
            >
              {formatarStatus(item.status)}
            </Text>
          </View>
        </View>

        <Text style={estilos.solicitacaoCardData}>
          Iniciada em {formatarData(item.dataCriacao)}
        </Text>

        {item.status === "concluida" && item.dataConclusao && (
          <Text style={estilos.solicitacaoCardData}>
            Concluída em {formatarData(item.dataConclusao)}
          </Text>
        )}
        <View style={estilos.explorarVerDetalhes}>
          <Text style={estilos.explorarVerDetalhesTexto}>Ver detalhes</Text>
        </View>
      </Pressable>
    );
  }

  if (loading || loadingSolicitacoes || carregandoUsuario) {
    return (
      <View style={estilos.solicitacaoCarregando}>
        <ActivityIndicator size="large" color={cores.primary} />
      </View>
    );
  }

  if (erroUsuario) {
    return (
      <View style={estilos.solicitacaoCarregando}>
        <Text style={estilos.solicitacoesVazioTitulo}>
          Não foi possível carregar suas doações
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={estilos.safe} edges={["top"]}>
      <FlatList
        data={minhasDoacoes}
        keyExtractor={(item) => item.id}
        renderItem={renderizarDoacao}
        contentContainerStyle={estilos.solicitacoesScroll}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={estilos.solicitacoesHeader}>
            <Text style={estilos.cadastroTitulo}>Ajudas recebidas</Text>
            <Text style={estilos.cadastroSubtitulo}>
              Veja quem está ajudando você.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={estilos.solicitacoesVazio}>
            <Text style={estilos.solicitacoesVazioTitulo}>
              Nenhuma ajuda recebida
            </Text>

            <Text style={estilos.solicitacoesVazioTexto}>
              Quando alguém aceitar lhe ajudar, a situação aparecerá aqui.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
