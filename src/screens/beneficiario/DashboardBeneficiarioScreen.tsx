import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import estilos, { cores } from "../../estilos/estilo";
import { BeneficiarioNavigation } from "../../types/Navigation";
import { UsuarioLogado } from "../../types/Auth";
import { buscarUsuarioLogado } from "../../services/AuthService";
import { useSolicitacoes } from "../../context/SolicitacoesContext";
import { Solicitacao } from "../../types/Solicitacao";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DashboardBeneficiarioScreen() {
  const navigation = useNavigation<BeneficiarioNavigation>();

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

  function estiloStatus(status: Solicitacao["status"]) {
    switch (status) {
      case "aberta":
        return {
          fundo: estilos.conversaStatusEmAndamento,
          texto: estilos.conversaStatusTextoEmAndamento,
        };

      case "em_andamento":
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

  if (loadingUsuario || loadingSolicitacoes) {
    return (
      <View style={estilos.loading}>
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
              Sua rede de apoio começa aqui.
            </Text>
          </View>

          <View style={estilos.headerIcon}>
            <Ionicons name="heart-outline" size={27} color={cores.primary} />
          </View>
        </View>

        <View style={estilos.indicatorRow}>
          <View style={estilos.indicator}>
            <Ionicons
              name="document-text-outline"
              size={24}
              color={cores.primary}
            />

            <Text style={estilos.indicatorValue}>
              {solicitacoesAbertas.length}
            </Text>

            <Text style={estilos.indicatorLabel}>Solicitações abertas</Text>
          </View>

          <View style={estilos.indicator}>
            <Ionicons
              name="heart-circle-outline"
              size={24}
              color={cores.success}
            />

            <Text style={estilos.indicatorValue}>
              {solicitacoesConcluidas.length}
            </Text>

            <Text style={estilos.indicatorLabel}>Solicitações concluídas</Text>
          </View>
        </View>

        <View style={estilos.highlightCard}>
          <View style={estilos.header}>
            <Ionicons
              name="hand-left-outline"
              size={24}
              color={cores.primary}
            />

            <Text style={estilos.cardTitle}>Precisa de uma mãozinha?</Text>
          </View>

          <Text style={estilos.cardDescription}>
            Conte o que você precisa e conecte-se a pessoas dispostas a ajudar.
          </Text>

          <Pressable
            style={estilos.actionButton}
            onPress={() => navigation.navigate("NovaSolicitacaoBeneficiario")}
          >
            <Ionicons name="add" size={20} color={cores.white} />

            <Text style={estilos.actionButtonText}>Criar solicitação</Text>
          </Pressable>
        </View>

        <View style={estilos.headerInline}>
          <Text style={estilos.sectionTitle}>Suas solicitações</Text>

          <Pressable onPress={() => navigation.navigate("MinhasSolicitacoes")}>
            <Text style={estilos.linkText}>Ver todas</Text>
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
                      estiloStatus(solicitacao.status).fundo,
                    ]}
                  >
                    <Text
                      style={[
                        estilos.statusBadgeText,
                        estiloStatus(solicitacao.status).texto,
                      ]}
                    >
                      {textoStatus(solicitacao.status)}
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

            <Text style={estilos.emptyTitle}>Nenhuma solicitação por aqui</Text>

            <Text style={estilos.emptyText}>
              Quando você criar um pedido, poderá acompanhar o andamento dele
              aqui.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
