import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";

import estilos, { cores } from "../../estilos/estilo";
import { useSolicitacoes } from "../../context/SolicitacoesContext";
import { DoadorStackParamlist } from "../../types/Navigation";
import { StatusSolicitacao } from "../../types/Solicitacao";

type DetalhesRoute = RouteProp<
  DoadorStackParamlist,
  "DetalhesSolicitacaoDoador"
>;

export default function DetalhesSolicitacaoDoadorScreen() {
  const navigation = useNavigation();
  const route = useRoute<DetalhesRoute>();

  const { idSolicitacao } = route.params;

  const { solicitacoes, loading } = useSolicitacoes();

  const solicitacao = solicitacoes.find((item) => item.id === idSolicitacao);

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

  if (loading) {
    return (
      <View style={estilos.solicitacaoCarregando}>
        <ActivityIndicator size="large" color={cores.primary} />
      </View>
    );
  }

  if (!solicitacao || solicitacao.status !== "aberta") {
    return (
      <View style={estilos.solicitacaoCarregando}>
        <Text style={estilos.solicitacoesVazioTitulo}>
          Solicitação indisponível
        </Text>

        <Text style={estilos.solicitacoesVazioTexto}>
          Esta solicitação não está mais disponível para receber ajuda.
        </Text>

        <Pressable onPress={() => navigation.goBack()}>
          <Text style={estilos.solicitacaoVoltar}>Voltar</Text>
        </Pressable>
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
          <Text style={estilos.cadastroTitulo}>Detalhes da solicitação</Text>

          <Text style={estilos.cadastroSubtitulo}>
            Conheça este pedido e veja como você pode ajudar.
          </Text>
        </View>

        {/* INFORMAÇÕES DA SOLICITAÇÃO */}
        <View style={estilos.solicitacaoDetalhesCard}>
          <Text style={estilos.solicitacaoDetalhesTitulo}>
            {solicitacao.titulo}
          </Text>

          <View style={estilos.solicitacaoDetalhesStatus}>
            <Text style={estilos.solicitacaoStatusTexto}>
              {formatarStatus(solicitacao.status)}
            </Text>
          </View>

          <Text style={estilos.solicitacaoDetalhesLabel}>Descrição</Text>

          <Text style={estilos.solicitacaoDetalhesDescricao}>
            {solicitacao.descricao}
          </Text>

          <View style={estilos.solicitacaoDetalhesDivisor} />

          <Text style={estilos.solicitacaoDetalhesLabel}>Tipo de ajuda</Text>

          <Text style={estilos.solicitacaoDetalhesValor}>
            {solicitacao.tipoAjuda === "geral"
              ? "Ajuda geral"
              : "Ajuda específica"}
          </Text>

          <Text style={estilos.solicitacaoDetalhesLabel}>
            Data de publicação
          </Text>

          <Text style={estilos.solicitacaoDetalhesValor}>
            {formatarData(solicitacao.dataCriacao)}
          </Text>
        </View>

        {/* ALIMENTOS SOLICITADOS */}
        {solicitacao.tipoAjuda === "especifico" && (
          <View style={estilos.solicitacaoDetalhesSecao}>
            <Text style={estilos.cadastroSecaoTitulo}>
              Alimentos solicitados
            </Text>

            {solicitacao.itens.length === 0 ? (
              <Text style={estilos.cadastroAjuda}>
                Nenhum alimento informado.
              </Text>
            ) : (
              solicitacao.itens.map((item) => (
                <View key={item.id} style={estilos.solicitacaoItem}>
                  <View style={{ flex: 1 }}>
                    <Text style={estilos.solicitacaoItemNome}>{item.nome}</Text>

                    <Text style={estilos.solicitacaoItemQuantidade}>
                      {item.quantidade} {item.unidade}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* AÇÃO DO DOADOR */}
        <View style={estilos.solicitacaoDetalhesSecao}>
          <Text style={estilos.cadastroSecaoTitulo}>Deseja ajudar?</Text>

          <Text style={estilos.cadastroAjuda}>
            Converse com o beneficiário para combinar como você pode contribuir.
          </Text>

          <Pressable style={estilos.doadorQueroAjudar} disabled>
            <Text style={estilos.doadorQueroAjudarTexto}>Quero ajudar</Text>
          </Pressable>

          <Text style={estilos.cadastroAjuda}>
            A conversa estará disponível quando integrarmos o chat.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
