import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import estilos, { cores } from "../../estilos/estilo";
import Input from "../../components/Input";

import { useSolicitacoes } from "../../context/SolicitacoesContext";
import { buscarUsuarioLogado } from "../../services/AuthService";
import { buscarDoador } from "../../services/DoadorService";

import { DoadorNavigation } from "../../types/Navigation";
import { Solicitacao } from "../../types/Solicitacao";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExplorarSolicitacoesScreen() {
  const navigation = useNavigation<DoadorNavigation>();

  const { solicitacoes, loading } = useSolicitacoes();

  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");

  const [carregandoRegiao, setCarregandoRegiao] = useState(true);

  const filtrosAlterados = useRef(false);

  const solicitacoesAbertas = useMemo(() => {
    return solicitacoes
      .filter((item) => item.status === "aberta")
      .sort(
        (a, b) =>
          new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime(),
      );
  }, [solicitacoes]);

  useEffect(() => {
    let ativo = true;

    async function carregarRegiaoDoador() {
      try {
        setCarregandoRegiao(true);

        const usuario = await buscarUsuarioLogado();

        if (!usuario?.idDoador) {
          return;
        }

        const doador = await buscarDoador(usuario.idDoador);

        if (!ativo || !doador || filtrosAlterados.current) {
          return;
        }

        setEstado(doador.estado ?? "");
        setCidade(doador.cidade ?? "");
      } catch (error) {
        console.log("Erro ao carregar região do doador:", error);
      } finally {
        if (ativo) {
          setCarregandoRegiao(false);
        }
      }
    }

    carregarRegiaoDoador();

    return () => {
      ativo = false;
    };
  }, []);

  function normalizar(texto?: string | null) {
    return (texto ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase();
  }


  const solicitacoesFiltradas = useMemo(() => {
    return solicitacoesAbertas.filter((item) => {
      const correspondeEstado =
        !estado.trim() || normalizar(item.estado) === normalizar(estado);

      const correspondeCidade =
        !cidade.trim() || normalizar(item.cidade).includes(normalizar(cidade));

      const correspondeBairro =
        !bairro.trim() || normalizar(item.bairro).includes(normalizar(bairro));

      return correspondeEstado && correspondeCidade && correspondeBairro;
    });
  }, [solicitacoesAbertas, estado, cidade, bairro]);


  function alterarEstado(valor: string) {
    filtrosAlterados.current = true;
    setEstado(valor);
  }

  function alterarCidade(valor: string) {
    filtrosAlterados.current = true;
    setCidade(valor);
  }

  function alterarBairro(valor: string) {
    filtrosAlterados.current = true;
    setBairro(valor);
  }

  function limparFiltros() {
    filtrosAlterados.current = true;

    setEstado("");
    setCidade("");
    setBairro("");
  }

  function formatarData(data: string) {
    return new Date(data).toLocaleDateString("pt-BR");
  }

  function abrirDetalhes(id: string) {
    navigation.navigate("DetalhesSolicitacaoDoador", {
      idSolicitacao: id,
    });
  }

  function renderizarSolicitacao({ item }: { item: Solicitacao }) {
    const localizacao = [item.bairro, item.cidade, item.estado]
      .filter(Boolean)
      .join(", ");

    return (
      <View style={estilos.solicitacaoCard}>
        <View style={estilos.solicitacaoCardTopo}>
          <Text style={estilos.solicitacaoCardTitulo}>{item.titulo}</Text>
        </View>

        <Text style={estilos.solicitacaoCardDescricao} numberOfLines={3}>
          {item.descricao}
        </Text>

        <Text style={estilos.solicitacaoCardInfo}>
          {item.tipoAjuda === "geral" ? "Ajuda geral" : "Ajuda específica"}
        </Text>

        <Text style={estilos.solicitacaoCardData}>
          {localizacao || "Localização não disponível"}
        </Text>

        <Text style={estilos.solicitacaoCardData}>
          Publicada em {formatarData(item.dataCriacao)}
        </Text>

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

  const carregando = carregandoRegiao;

  return (
    <SafeAreaView style={estilos.safe} edges={["top"]}>
      <FlatList
        data={carregando ? [] : solicitacoesFiltradas}
        keyExtractor={(item) => item.id}
        renderItem={renderizarSolicitacao}
        contentContainerStyle={estilos.solicitacoesScroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={estilos.solicitacoesHeader}>
            <Text style={estilos.cadastroTitulo}>Encontre quem ajudar</Text>

            <Text style={estilos.cadastroSubtitulo}>
              Encontre pessoas que precisam de apoio na sua região. Você também
              pode explorar solicitações de outras localidades.
            </Text>

            <View style={estilos.card}>
              <Text style={estilos.sectionTitle}>Filtrar por localização</Text>

              <Input
                label="Estado"
                placeholder="Ex.: SP"
                value={estado}
                onChangeText={alterarEstado}
                autoCapitalize="characters"
              />

              <Input
                label="Cidade"
                placeholder="Digite a cidade"
                value={cidade}
                onChangeText={alterarCidade}
              />

              <Input
                label="Bairro"
                placeholder="Digite o bairro"
                value={bairro}
                onChangeText={alterarBairro}
              />

              <Pressable onPress={limparFiltros}>
                <Text style={estilos.linkText}>Limpar filtros</Text>
              </Pressable>
            </View>

            {!carregando && (
              <Text style={estilos.cadastroAjuda}>
                {solicitacoesFiltradas.length} solicitação(ões) encontrada(s)
              </Text>
            )}
          </View>
        }
        ListEmptyComponent={
          carregando ? (
            <View style={estilos.solicitacaoCarregando}>
              <ActivityIndicator size="large" color={cores.primary} />

              <Text style={estilos.cadastroAjuda}>
                Carregando solicitações da região...
              </Text>
            </View>
          ) : (
            <View style={estilos.solicitacoesVazio}>
              <Text style={estilos.solicitacoesVazioTitulo}>
                Nenhuma solicitação encontrada
              </Text>

              <Text style={estilos.solicitacoesVazioTexto}>
                Não encontramos solicitações para os filtros selecionados. Tente
                outra localização ou limpe os filtros.
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}
