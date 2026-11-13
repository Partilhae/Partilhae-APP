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
import { BeneficiarioTabParamlist } from "../../types/Navigation";
import { UsuarioLogado } from "../../types/Auth";
import { buscarUsuarioLogado } from "../../services/Auth";
import { useSolicitacoes } from "../../context/SolicitacoesContext";
import { Solicitacao } from "../../types/Solicitacao";

export default function DashboardBeneficiarioScreen() {
  const navigation = useNavigation<NavigationProp<BeneficiarioTabParamlist>>();

  const { solicitacoes, loading: loadingSolicitacoes } = useSolicitacoes();

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
          console.log("Erro ao carregar usuário:", error);
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

  function textoStatus(status: Solicitacao["status"]) {
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

  function corStatus(status: Solicitacao["status"]) {
    switch (status) {
      case "aberta":
        return cores.warning;
      case "em_andamento":
        return cores.info;
      case "concluida":
        return cores.success;
      case "cancelada":
        return cores.danger;
    }
  }

  function fundoStatus(status: Solicitacao["status"]) {
    switch (status) {
      case "aberta":
        return cores.warningSoft;
      case "em_andamento":
        return cores.infoSoft;
      case "concluida":
        return cores.successSoft;
      case "cancelada":
        return cores.dangerSoft;
    }
  }

  if (loadingUsuario || loadingSolicitacoes) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={cores.primary} />
      </View>
    );
  }

  const minhasSolicitacoes = solicitacoes.filter(
    (solicitacao) => solicitacao.idReceptor === usuario?.idReceptor,
  );

  const solicitacoesAbertas = minhasSolicitacoes.filter(
    (solicitacao) => solicitacao.status === "aberta",
  );

  const solicitacoesConcluidas = minhasSolicitacoes.filter(
    (solicitacao) => solicitacao.status === "concluida",
  );

  const solicitacoesRecentes = [...minhasSolicitacoes]
    .sort(
      (a, b) =>
        new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime(),
    )
    .slice(0, 2);

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
              Sua rede de apoio começa aqui.
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons name="heart-outline" size={27} color={cores.primary} />
          </View>
        </View>

        <View style={styles.indicatorRow}>
          <View style={styles.indicator}>
            <Ionicons
              name="document-text-outline"
              size={24}
              color={cores.primary}
            />

            <Text style={styles.indicatorValue}>
              {solicitacoesAbertas.length}
            </Text>

            <Text style={styles.indicatorLabel}>Solicitações abertas</Text>
          </View>

          <View style={styles.indicator}>
            <Ionicons
              name="heart-circle-outline"
              size={24}
              color={cores.success}
            />

            <Text style={styles.indicatorValue}>
              {solicitacoesConcluidas.length}
            </Text>

            <Text style={styles.indicatorLabel}>Solicitações concluídas</Text>
          </View>
        </View>

        <View style={styles.highlightCard}>
          <View style={styles.header}>
            <Ionicons
              name="hand-left-outline"
              size={24}
              color={cores.primary}
            />

            <Text style={styles.cardTitle}>Precisa de uma mãozinha?</Text>
          </View>

          <Text style={styles.cardDescription}>
            Conte o que você precisa e conecte-se a pessoas dispostas a ajudar.
          </Text>

          <Pressable
            style={styles.actionButton}
            onPress={() => navigation.navigate("NovaSolicitacao")}
          >
            <Ionicons name="add" size={20} color={cores.white} />

            <Text style={styles.actionButtonText}>Criar solicitação</Text>
          </Pressable>
        </View>

        <View style={styles.headerInline}>
          <Text style={styles.sectionTitle}>Suas solicitações</Text>

          <Pressable onPress={() => navigation.navigate("MinhasSolicitacoes")}>
            <Text style={styles.linkText}>Ver todas</Text>
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
                        backgroundColor: fundoStatus(solicitacao.status),
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        {
                          color: corStatus(solicitacao.status),
                        },
                      ]}
                    >
                      {textoStatus(solicitacao.status)}
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

            <Text style={styles.emptyTitle}>Nenhuma solicitação por aqui</Text>

            <Text style={styles.emptyText}>
              Quando você criar um pedido, poderá acompanhar o andamento dele
              aqui.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
