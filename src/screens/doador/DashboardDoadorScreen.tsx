import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import estilos, { cores } from "../../estilos/estilo";
import { DoadorTabParamlist } from "../../types/Navigation";
import { UsuarioLogado } from "../../types/Auth";
import { buscarUsuarioLogado } from "../../services/AuthService";
import { useSolicitacoes } from "../../context/SolicitacoesContext";
import { useDoacoes } from "../../context/DoacoesContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DashboardDoadorScreen() {
  const navigation = useNavigation<NavigationProp<DoadorTabParamlist>>();

  const { solicitacoes, loading: loadingSolicitacoes } = useSolicitacoes();
  const { doacoes, loading: loadingDoacoes } = useDoacoes();

  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);
  const [loadingUsuario, setLoadingUsuario] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      async function carregarUsuario() {
        try {
          setLoadingUsuario(true);

          const dados = await buscarUsuarioLogado();

          if (ativo) {
            setUsuario(dados);
          }
        } catch (error) {
          console.log("Erro ao carregar doador:", error);

          if (ativo) {
            setUsuario(null);
          }
        } finally {
          if (ativo) {
            setLoadingUsuario(false);
          }
        }
      }

      carregarUsuario();

      return () => {
        ativo = false;
      };
    }, []),
  );

  if (loadingUsuario || loadingSolicitacoes || loadingDoacoes) {
    return (
      <View style={estilos.loading}>
        <ActivityIndicator size="large" color={cores.primary} />
      </View>
    );
  }

  const minhasDoacoes = doacoes.filter(
    (doacao) =>
      usuario?.idDoador != null && doacao.idDoador === usuario.idDoador,
  );

  const doacoesEmAndamento = minhasDoacoes.filter(
    (doacao) =>
      doacao.status === "em_andamento" || doacao.status === "entregue",
  );

  const doacoesConcluidas = minhasDoacoes.filter(
    (doacao) => doacao.status === "concluida",
  );

  const solicitacoesRecentes = solicitacoes
    .filter((solicitacao) => solicitacao.status === "aberta")
    .sort(
      (a, b) =>
        new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime(),
    )
    .slice(0, 3);

  return (
    <SafeAreaView style={estilos.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={estilos.pageContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={estilos.header}>
          <View style={estilos.headerText}>
            <Text style={estilos.pageTitle}>
              Olá, {usuario?.nomeUsuario || "bem-vindo"}!
            </Text>

            <Text style={estilos.pageSubtitle}>
              Pequenos gestos transformam vidas.
            </Text>
          </View>

          <View style={estilos.headerIcon}>
            <Ionicons name="heart-outline" size={27} color={cores.primary} />
          </View>
        </View>

        <View style={estilos.indicatorRow}>
          <View style={estilos.indicator}>
            <Ionicons name="cube-outline" size={24} color={cores.primary} />

            <Text style={estilos.indicatorValue}>
              {doacoesEmAndamento.length}
            </Text>

            <Text style={estilos.indicatorLabel}>Doações em andamento</Text>
          </View>

          <View style={estilos.indicator}>
            <Ionicons
              name="checkmark-circle-outline"
              size={24}
              color={cores.success}
            />

            <Text style={estilos.indicatorValue}>
              {doacoesConcluidas.length}
            </Text>

            <Text style={estilos.indicatorLabel}>Doações concluídas</Text>
          </View>
        </View>

        <View style={estilos.highlightCard}>
          <View style={estilos.header}>
            <Ionicons name="heart-outline" size={25} color={cores.primary} />

            <Text style={estilos.cardTitle}>
              Que tal fazer a diferença hoje?
            </Text>
          </View>

          <Text style={estilos.cardDescription}>
            Existem pessoas que podem precisar da sua ajuda. Explore os pedidos
            e escolha como contribuir.
          </Text>

          <Pressable
            style={estilos.actionButton}
            onPress={() => navigation.navigate("Solicitacoes")}
          >
            <Ionicons name="search-outline" size={20} color={cores.white} />

            <Text style={estilos.actionButtonText}>Explorar solicitações</Text>
          </Pressable>
        </View>

        <View style={estilos.headerInline}>
          <Text style={estilos.sectionTitle}>Pedidos recentes</Text>

          <Pressable onPress={() => navigation.navigate("Solicitacoes")}>
            <Text style={estilos.linkText}>Ver todos</Text>
          </Pressable>
        </View>

        {solicitacoesRecentes.length > 0 ? (
          <View style={estilos.list}>
            {solicitacoesRecentes.map((solicitacao) => (
              <View key={solicitacao.id} style={estilos.card}>
                <View style={estilos.cardRow}>
                  <Text style={[estilos.itemTitle, { flex: 1 }]}>
                    {solicitacao.titulo}
                  </Text>

                  <View
                    style={[
                      estilos.statusBadge,
                      {
                        backgroundColor: cores.successSoft,
                      },
                    ]}
                  >
                    <Text
                      style={[estilos.statusBadgeText, { color: cores.success }]}
                    >
                      Aberta
                    </Text>
                  </View>
                </View>

                <Text style={estilos.itemSubtitle} numberOfLines={2}>
                  {solicitacao.descricao}
                </Text>

                <View style={estilos.infoRow}>
                  <Ionicons
                    name="calendar-outline"
                    size={15}
                    color={cores.textSecondary}
                  />

                  <Text style={estilos.infoText}>
                    {new Date(solicitacao.dataCriacao).toLocaleDateString(
                      "pt-BR",
                    )}
                  </Text>
                </View>

                <View style={estilos.infoRow}>
                  <Ionicons
                    name={
                      solicitacao.tipoAjuda === "especifico"
                        ? "list-outline"
                        : "basket-outline"
                    }
                    size={15}
                    color={cores.primaryMedium}
                  />

                  <Text style={estilos.infoText}>
                    {solicitacao.tipoAjuda === "especifico"
                      ? "Pedido de itens específicos"
                      : "Pedido de ajuda geral"}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={estilos.emptyState}>
            <View style={estilos.emptyIcon}>
              <Ionicons
                name="file-tray-outline"
                size={32}
                color={cores.primaryMedium}
              />
            </View>

            <Text style={estilos.emptyTitle}>Nenhum pedido disponível</Text>

            <Text style={estilos.emptyText}>
              Quando os beneficiários criarem solicitações, elas aparecerão
              aqui.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
