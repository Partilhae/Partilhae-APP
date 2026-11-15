import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

import estilos, { cores } from "../../estilos/estilo";
import { useDoacoes } from "../../context/DoacoesContext";
import { useSolicitacoes } from "../../context/SolicitacoesContext";
import { buscarUsuarioLogado } from "../../services/AuthService";
import { Doacao, StatusDoacao } from "../../types/Doacao";

export default function DoacoesRecebidasBeneficiarioScreen() {
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
      <View style={estilos.solicitacaoCard}>
        <Text style={estilos.solicitacaoCardTitulo}>
          {solicitacao?.titulo ?? "Solicitação indisponível"}
        </Text>

        <Text style={estilos.solicitacaoCardDescricao} numberOfLines={3}>
          {solicitacao?.descricao ??
            "Não foi possível carregar os detalhes da solicitação."}
        </Text>

        <Text style={estilos.solicitacaoCardData}>
          Status: {formatarStatus(item.status)}
        </Text>

        <Text style={estilos.solicitacaoCardData}>
          Iniciada em {formatarData(item.dataCriacao)}
        </Text>

        {item.status === "concluida" && item.dataConclusao && (
          <Text style={estilos.solicitacaoCardData}>
            Concluída em {formatarData(item.dataConclusao)}
          </Text>
        )}
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
      </View>
    );
  }

  return (
    <View style={estilos.safe}>
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
              Acompanhe as doações iniciadas para suas solicitações.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={estilos.solicitacoesVazio}>
            <Text style={estilos.solicitacoesVazioTitulo}>
              Nenhuma ajuda recebida
            </Text>

            <Text style={estilos.solicitacoesVazioTexto}>
              Quando um doador escolher ajudar em uma das suas solicitações, a
              doação aparecerá aqui.
            </Text>
          </View>
        }
      />
    </View>
  );
}
