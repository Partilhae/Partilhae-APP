import { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import estilos, { cores } from "../../estilos/estilo";
import { useSolicitacoes } from "../../context/SolicitacoesContext";
import { DoadorStackParamlist } from "../../types/Navigation";
import { Solicitacao } from "../../types/Solicitacao";

type Navigation = NativeStackNavigationProp<DoadorStackParamlist>;

export default function ExplorarSolicitacoesScreen() {
  const navigation = useNavigation<Navigation>();

  const { solicitacoes, loading } = useSolicitacoes();

  const solicitacoesAbertas = useMemo(() => {
    return solicitacoes
      .filter((item) => item.status === "aberta")
      .sort(
        (a, b) =>
          new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime(),
      );
  }, [solicitacoes]);

  function formatarData(data: string) {
    return new Date(data).toLocaleDateString("pt-BR");
  }

  function abrirDetalhes(id: string) {
    navigation.navigate("DetalhesSolicitacaoDoador", {
      idSolicitacao: id,
    });
  }

  function renderizarSolicitacao({ item }: { item: Solicitacao }) {
    return (
      <View style={estilos.solicitacaoCard}>
        <View style={estilos.solicitacaoCardTopo}>
          <Text style={estilos.solicitacaoCardTitulo}>{item.titulo}</Text>
        </View>

        <Text style={estilos.solicitacaoCardDescricao} numberOfLines={3}>
          {item.descricao}
        </Text>

        <View style={estilos.solicitacaoCardInfo}>
          <Text style={estilos.solicitacaoCardData}>
            {item.tipoAjuda === "geral" ? "Ajuda geral" : "Ajuda específica"}
          </Text>

          <Text style={estilos.solicitacaoCardData}>
            {formatarData(item.dataCriacao)}
          </Text>
        </View>

        {item.tipoAjuda === "especifico" && (
          <Text style={estilos.solicitacaoCardData}>
            {item.itens.length} alimento(s) solicitado(s)
          </Text>
        )}

        <Pressable
          style={estilos.explorarVerDetalhes}
          onPress={() => abrirDetalhes(item.id)}
        >
          <Text style={estilos.explorarVerDetalhesTexto}>Ver solicitação</Text>
        </Pressable>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={estilos.solicitacaoCarregando}>
        <ActivityIndicator size="large" color={cores.primary} />
      </View>
    );
  }

  return (
    <View style={estilos.safe}>
      <FlatList
        data={solicitacoesAbertas}
        keyExtractor={(item) => item.id}
        renderItem={renderizarSolicitacao}
        contentContainerStyle={estilos.solicitacoesScroll}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={estilos.solicitacoesHeader}>
            <Text style={estilos.cadastroTitulo}>Encontre quem ajudar</Text>

            <Text style={estilos.cadastroSubtitulo}>
              Conheça solicitações de pessoas que precisam de apoio.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={estilos.solicitacoesVazio}>
            <Text style={estilos.solicitacoesVazioTitulo}>
              Nenhuma solicitação disponível
            </Text>

            <Text style={estilos.solicitacoesVazioTexto}>
              Ainda não há solicitações abertas. Volte mais tarde para conferir.
            </Text>
          </View>
        }
      />
    </View>
  );
}
