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
import { Doacao, FiltroDoacao, StatusDoacao } from "../../types/Doacao";
import { DoadorNavigation } from "../../types/Navigation";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MinhasDoacoesScreen() {
  const navigation = useNavigation<DoadorNavigation>();
  const { doacoes, loading } = useDoacoes();
  const { solicitacoes, loading: loadingSolicitacoes } = useSolicitacoes();

  const [idDoador, setIdDoador] = useState<number | null>(null);
  const [carregandoUsuario, setCarregandoUsuario] = useState(true);
  const [erroUsuario, setErroUsuario] = useState(false);

  const [filtro, setFiltro] = useState<FiltroDoacao>("em_andamento");

  useEffect(() => {
    carregarUsuario();
  }, []);

  async function carregarUsuario() {
    try {
      setCarregandoUsuario(true);
      setErroUsuario(false);

      const usuario = await buscarUsuarioLogado();

      if (usuario?.idDoador == null) {
        setErroUsuario(true);
        return;
      }

      setIdDoador(usuario.idDoador);
    } catch (error) {
      console.log("Erro ao carregar doador:", error);
      setErroUsuario(true);
    } finally {
      setCarregandoUsuario(false);
    }
  }

  function abrirDetalhes(idDoacao: string) {
    navigation.navigate("DetalhesDoacaoDoador", {
      idDoacao,
    });
  }

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
    .filter((doacao) => doacao.idDoador === idDoador)
    .filter((doacao) => {
      if (filtro === "em_andamento") {
        return doacao.status === "em_andamento" || doacao.status === "entregue";
      }
      return doacao.status === filtro;
    })
    .sort(
      (a, b) =>
        new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime(),
    );

  function renderizarDoacao({ item }: { item: Doacao }) {
    const solicitacao = solicitacoes.find(
      (solicitacao) => solicitacao.id === item.idSolicitacao,
    );

    return (
      <View style={estilos.solicitacaoCard}>
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

        <Pressable
          style={estilos.explorarVerDetalhes}
          onPress={() => abrirDetalhes(item.id)}
        >
          <Text style={estilos.explorarVerDetalhesTexto}>Ver detalhes</Text>
        </Pressable>
      </View>
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

        <Pressable onPress={carregarUsuario}>
          <Text style={estilos.solicitacaoVoltar}>Tentar novamente</Text>
        </Pressable>
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
            <Text style={estilos.cadastroTitulo}>Minhas doações</Text>

            <Text style={estilos.cadastroSubtitulo}>
              Acompanhe o andamento das suas doações.
            </Text>

            <View style={estilos.doacoesFiltros}>
              <Pressable
                style={[
                  estilos.doacoesFiltro,
                  filtro === "em_andamento" && estilos.doacoesFiltroAtivo,
                ]}
                onPress={() => setFiltro("em_andamento")}
              >
                <Text
                  style={[
                    estilos.doacoesFiltroTexto,
                    filtro === "em_andamento" &&
                      estilos.doacoesFiltroTextoAtivo,
                  ]}
                >
                  Em andamento
                </Text>
              </Pressable>

              <Pressable
                style={[
                  estilos.doacoesFiltro,
                  filtro === "concluida" && estilos.doacoesFiltroAtivo,
                ]}
                onPress={() => setFiltro("concluida")}
              >
                <Text
                  style={[
                    estilos.doacoesFiltroTexto,
                    filtro === "concluida" && estilos.doacoesFiltroTextoAtivo,
                  ]}
                >
                  Concluídas
                </Text>
              </Pressable>

              <Pressable
                style={[
                  estilos.doacoesFiltro,
                  filtro === "cancelada" && estilos.doacoesFiltroAtivo,
                ]}
                onPress={() => setFiltro("cancelada")}
              >
                <Text
                  style={[
                    estilos.doacoesFiltroTexto,
                    filtro === "cancelada" && estilos.doacoesFiltroTextoAtivo,
                  ]}
                >
                  Canceladas
                </Text>
              </Pressable>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={estilos.solicitacoesVazio}>
            <Text style={estilos.solicitacoesVazioTitulo}>
              {filtro === "em_andamento"
                ? "Nenhuma doação em andamento"
                : filtro === "concluida"
                  ? "Nenhuma doação concluída"
                  : "Nenhuma doação cancelada"}
            </Text>

            <Text style={estilos.solicitacoesVazioTexto}>
              {filtro === "em_andamento"
                ? "Quando você iniciar uma ajuda, ela aparecerá aqui."
                : filtro === "concluida"
                  ? "Suas doações finalizadas aparecerão aqui."
                  : "Suas doações canceladas aparecerão aqui."}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
