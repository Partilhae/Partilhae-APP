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
import { JavaAPI } from "../../services/API/JavaAPI";

import { DoadorNavigation } from "../../types/Navigation";
import { Solicitacao } from "../../types/Solicitacao";
import { BeneficiarioResponse } from "../../types/Beneficiario";

type Localizacao = {
  bairro: string;
  cidade: string;
  estado: string;
};

export default function ExplorarSolicitacoesScreen() {
  const navigation = useNavigation<DoadorNavigation>();

  const { solicitacoes, loading } = useSolicitacoes();

  const [localizacoes, setLocalizacoes] = useState<Record<number, Localizacao>>(
    {},
  );

  const [carregandoLocalizacoes, setCarregandoLocalizacoes] = useState(true);

  const [erroLocalizacoes, setErroLocalizacoes] = useState(false);

  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");

  const [carregandoRegiao, setCarregandoRegiao] = useState(true);

  const filtrosAlterados = useRef(false);

  // Solicitações abertas, ordenadas pelas mais recentes
  const solicitacoesAbertas = useMemo(() => {
    return solicitacoes
      .filter((item) => item.status === "aberta")
      .sort(
        (a, b) =>
          new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime(),
      );
  }, [solicitacoes]);

  // Buscar a região cadastrada do doador
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

  // Buscar a localização dos beneficiários
  useEffect(() => {
    if (loading) return;

    let ativo = true;

    async function carregarLocalizacoes() {
      setCarregandoLocalizacoes(true);
      setErroLocalizacoes(false);

      try {
        const idsBeneficiarios = [
          ...new Set(solicitacoesAbertas.map((item) => item.idReceptor)),
        ];

        if (idsBeneficiarios.length === 0) {
          if (ativo) {
            setLocalizacoes({});
          }
          return;
        }

        const resultados = await Promise.all(
          idsBeneficiarios.map(async (id) => {
            try {
              const { data } = await JavaAPI.get<BeneficiarioResponse>(
                `/beneficiarios/${id}`,
              );

              return {
                id,
                localizacao: {
                  bairro: data.bairro ?? "",
                  cidade: data.cidade ?? "",
                  estado: data.estado ?? "",
                },
              };
            } catch (error) {
              console.log(
                `Erro ao buscar localização do beneficiário ${id}:`,
                error,
              );

              return null;
            }
          }),
        );

        if (!ativo) return;

        const novasLocalizacoes: Record<number, Localizacao> = {};

        resultados.forEach((resultado) => {
          if (resultado) {
            novasLocalizacoes[resultado.id] = resultado.localizacao;
          }
        });

        setLocalizacoes(novasLocalizacoes);

        setErroLocalizacoes(resultados.some((resultado) => resultado === null));
      } catch (error) {
        console.log("Erro ao carregar localizações:", error);

        if (ativo) {
          setErroLocalizacoes(true);
        }
      } finally {
        if (ativo) {
          setCarregandoLocalizacoes(false);
        }
      }
    }

    carregarLocalizacoes();

    return () => {
      ativo = false;
    };
  }, [loading, solicitacoesAbertas]);

  // Normalizar texto sem causar erro com undefined ou null
  function normalizar(texto?: string | null) {
    return (texto ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase();
  }

  // Filtrar solicitações por localização
  const solicitacoesFiltradas = useMemo(() => {
    return solicitacoesAbertas.filter((item) => {
      const localizacao = localizacoes[item.idReceptor];

      const possuiFiltros =
        estado.trim() !== "" || cidade.trim() !== "" || bairro.trim() !== "";

      // Sem localização, só aparece quando não há filtros
      if (!localizacao) {
        return !possuiFiltros;
      }

      const correspondeEstado =
        !estado.trim() || normalizar(localizacao.estado) === normalizar(estado);

      const correspondeCidade =
        !cidade.trim() ||
        normalizar(localizacao.cidade).includes(normalizar(cidade));

      const correspondeBairro =
        !bairro.trim() ||
        normalizar(localizacao.bairro).includes(normalizar(bairro));

      return correspondeEstado && correspondeCidade && correspondeBairro;
    });
  }, [solicitacoesAbertas, localizacoes, estado, cidade, bairro]);

  // Alterar filtros manualmente
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

  // Renderizar cada solicitação
  function renderizarSolicitacao({ item }: { item: Solicitacao }) {
    const localizacao = localizacoes[item.idReceptor];

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

        {localizacao &&
          (localizacao.bairro || localizacao.cidade || localizacao.estado) && (
            <Text style={estilos.solicitacaoCardData}>
              {[localizacao.bairro, localizacao.cidade, localizacao.estado]
                .filter(Boolean)
                .join(", ")}
            </Text>
          )}

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

  // Carregamento inicial das solicitações
  if (loading) {
    return (
      <View style={estilos.solicitacaoCarregando}>
        <ActivityIndicator size="large" color={cores.primary} />
      </View>
    );
  }

  const carregando = carregandoRegiao || carregandoLocalizacoes;

  return (
    <View style={estilos.safe}>
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

            {erroLocalizacoes && !carregandoLocalizacoes && (
              <Text style={estilos.cadastroAjuda}>
                Não foi possível consultar a localização de alguns
                beneficiários.
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
    </View>
  );
}
