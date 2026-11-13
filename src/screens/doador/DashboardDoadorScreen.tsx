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

import styles, { cores } from "../../estilos/estilo";
import { DoadorTabParamlist } from "../../types/Navigation";
import { UsuarioLogado } from "../../types/Auth";
import { buscarUsuarioLogado } from "../../services/Auth";
import { useSolicitacoes } from "../../context/SolicitacoesContext";
import { useDoacoes } from "../../context/DoacoesContext";

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
      <View style={styles.loading}>
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
    <View style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.pageContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.headerBrand}>PARTILHAÊ 💛</Text>

            <Text style={styles.pageTitle}>
              Olá, {usuario?.nomeUsuario || "bem-vindo"}!
            </Text>

            <Text style={styles.pageSubtitle}>
              Pequenos gestos transformam vidas.
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons name="heart-outline" size={27} color={cores.primary} />
          </View>
        </View>

        <View style={styles.indicatorRow}>
          <View style={styles.indicator}>
            <Ionicons name="cube-outline" size={24} color={cores.primary} />

            <Text style={styles.indicatorValue}>
              {doacoesEmAndamento.length}
            </Text>

            <Text style={styles.indicatorLabel}>Doações em andamento</Text>
          </View>

          <View style={styles.indicator}>
            <Ionicons
              name="checkmark-circle-outline"
              size={24}
              color={cores.success}
            />

            <Text style={styles.indicatorValue}>
              {doacoesConcluidas.length}
            </Text>

            <Text style={styles.indicatorLabel}>Doações concluídas</Text>
          </View>
        </View>

        <View style={styles.highlightCard}>
          <View style={styles.header}>
            <Ionicons name="heart-outline" size={25} color={cores.primary} />

            <Text style={styles.cardTitle}>
              Que tal fazer a diferença hoje?
            </Text>
          </View>

          <Text style={styles.cardDescription}>
            Existem pessoas que podem precisar da sua ajuda. Explore os pedidos
            e escolha como contribuir.
          </Text>

          <Pressable
            style={styles.actionButton}
            onPress={() => navigation.navigate("Solicitacoes")}
          >
            <Ionicons name="search-outline" size={20} color={cores.white} />

            <Text style={styles.actionButtonText}>Explorar solicitações</Text>
          </Pressable>
        </View>

        <View style={styles.headerInline}>
          <Text style={styles.sectionTitle}>Pedidos recentes</Text>

          <Pressable onPress={() => navigation.navigate("Solicitacoes")}>
            <Text style={styles.linkText}>Ver todos</Text>
          </Pressable>
        </View>

        {solicitacoesRecentes.length > 0 ? (
          <View style={styles.list}>
            {solicitacoesRecentes.map((solicitacao) => (
              <View key={solicitacao.id} style={styles.card}>
                <View style={styles.cardRow}>
                  <Text style={[styles.itemTitle, {flex: 1}]}>{solicitacao.titulo}</Text>

                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: cores.successSoft,
                      },
                    ]}
                  >
                    <Text
                      style={[styles.statusBadgeText, { color: cores.success }]}
                    >
                      Aberta
                    </Text>
                  </View>
                </View>

                <Text style={styles.itemSubtitle} numberOfLines={2}>
                  {solicitacao.descricao}
                </Text>

                <View style={styles.infoRow}>
                  <Ionicons
                    name="calendar-outline"
                    size={15}
                    color={cores.textSecondary}
                  />

                  <Text style={styles.infoText}>
                    {new Date(solicitacao.dataCriacao).toLocaleDateString(
                      "pt-BR",
                    )}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons
                    name={
                      solicitacao.tipoAjuda === "especifico"
                        ? "list-outline"
                        : "basket-outline"
                    }
                    size={15}
                    color={cores.primaryMedium}
                  />

                  <Text style={styles.infoText}>
                    {solicitacao.tipoAjuda === "especifico"
                      ? "Pedido de itens específicos"
                      : "Pedido de ajuda geral"}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="file-tray-outline"
                size={32}
                color={cores.primaryMedium}
              />
            </View>

            <Text style={styles.emptyTitle}>Nenhum pedido disponível</Text>

            <Text style={styles.emptyText}>
              Quando os beneficiários criarem solicitações, elas aparecerão
              aqui.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
