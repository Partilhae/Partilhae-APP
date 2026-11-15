import { useCallback, useState } from "react";
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
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";

import estilos, { cores } from "../../estilos/estilo";
import { useSolicitacoes } from "../../context/SolicitacoesContext";
import { buscarUsuarioLogado } from "../../services/AuthService";
import { Solicitacao, StatusSolicitacao } from "../../types/Solicitacao";
import { BeneficiarioStackParamlist } from "../../types/Navigation";

export default function MinhasSolicitacoesScreen() {
  const navigation =
    useNavigation<NavigationProp<BeneficiarioStackParamlist>>();

  const { solicitacoes, loading } = useSolicitacoes();

  const [idReceptor, setIdReceptor] = useState<number | null>(null);
  const [carregandoUsuario, setCarregandoUsuario] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      async function carregarUsuario() {
        try {
          setCarregandoUsuario(true);

          const usuario = await buscarUsuarioLogado();

          if (!ativo) return;

          if (!usuario?.idReceptor) {
            setIdReceptor(null);
            Alert.alert("Erro", "Não foi possível identificar o beneficiário.");
            return;
          }

          setIdReceptor(usuario.idReceptor);
        } catch (error) {
          console.log("Erro ao buscar beneficiário:", error);

          if (ativo) {
            setIdReceptor(null);
            Alert.alert("Erro", "Não foi possível carregar suas solicitações.");
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

  const minhasSolicitacoes = solicitacoes
    .filter((solicitacao) => solicitacao.idReceptor === idReceptor)
    .sort(
      (a, b) =>
        new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime(),
    );

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

  function renderizarSolicitacao({ item }: { item: Solicitacao }) {
    return (
      <Pressable
        style={estilos.solicitacaoCard}
        onPress={() =>
          navigation.navigate("DetalhesSolicitacaoBeneficiario", {
            idSolicitacao: item.id,
          })
        }
      >
        <View style={estilos.solicitacaoCardTopo}>
          <Text style={estilos.solicitacaoCardTitulo}>{item.titulo}</Text>

          <View style={estilos.solicitacaoStatus}>
            <Text style={estilos.solicitacaoStatusTexto}>
              {formatarStatus(item.status)}
            </Text>
          </View>
        </View>

        <Text style={estilos.solicitacaoCardDescricao} numberOfLines={2}>
          {item.descricao}
        </Text>

        <Text style={estilos.solicitacaoCardInfo}>
          {item.tipoAjuda === "geral" ? "Ajuda geral" : "Ajuda específica"}
        </Text>

        {item.tipoAjuda === "especifico" && (
          <Text style={estilos.solicitacaoCardInfo}>
            {item.itens.length} alimento(s) solicitado(s)
          </Text>
        )}

        <Text style={estilos.solicitacaoCardData}>
          Publicada em {formatarData(item.dataCriacao)}
        </Text>
      </Pressable>
    );
  }

  if (loading || carregandoUsuario) {
    return (
      <View style={estilos.solicitacaoCarregando}>
        <ActivityIndicator size="large" color={cores.primary} />
        <Text style={estilos.cadastroAjuda}>
          Carregando suas solicitações...
        </Text>
      </View>
    );
  }

  return (
    <View style={estilos.safe}>
      <FlatList
        data={minhasSolicitacoes}
        keyExtractor={(item) => item.id}
        renderItem={renderizarSolicitacao}
        contentContainerStyle={estilos.solicitacoesScroll}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={estilos.solicitacoesHeader}>
            <Text style={estilos.cadastroTitulo}>Minhas solicitações</Text>

            <Text style={estilos.cadastroSubtitulo}>
              Acompanhe seus pedidos de ajuda e veja o andamento de cada
              solicitação.
            </Text>

            <Pressable
              style={estilos.solicitacoesNovoBotao}
              onPress={() => navigation.navigate("NovaSolicitacaoBeneficiario")}
            >
              <Text style={estilos.solicitacoesNovoTexto}>
                + Nova solicitação
              </Text>
            </Pressable>
          </View>
        }
        ListEmptyComponent={
          <View style={estilos.solicitacoesVazio}>
            <Text style={estilos.solicitacoesVazioTitulo}>
              Nenhuma solicitação ainda
            </Text>

            <Text style={estilos.solicitacoesVazioTexto}>
              Você ainda não publicou nenhum pedido de ajuda. Que tal criar sua
              primeira solicitação?
            </Text>
          </View>
        }
      />
    </View>
  );
}
