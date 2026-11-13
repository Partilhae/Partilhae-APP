import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import styles, { cores } from "../../estilos/estilo";
import { UsuarioLogado } from "../../types/Auth";
import { buscarUsuarioLogado, logoutUsuario } from "../../services/Auth";

export default function PerfilDoadorScreen() {
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);
  const [loading, setLoading] = useState(true);
  const [saindo, setSaindo] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      async function carregar() {
        try {
          setLoading(true);
          const dados = await buscarUsuarioLogado();

          if (ativo) setUsuario(dados);
        } catch {
          Alert.alert("Erro", "Não foi possível carregar o perfil.");
        } finally {
          if (ativo) setLoading(false);
        }
      }

      carregar();

      return () => {
        ativo = false;
      };
    }, []),
  );

  function confirmarLogout() {
    Alert.alert("Sair da conta", "Deseja realmente sair do Partilhaê?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        onPress: async () => {
          try {
            setSaindo(true);
            await logoutUsuario();
            Alert.alert("Sessão encerrada", "Você saiu da sua conta.");
          } catch {
            Alert.alert("Erro", "Não foi possível sair.");
          } finally {
            setSaindo(false);
          }
        },
      },
    ]);
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={cores.primary} />
      </View>
    );
  }

  return (
    <View style={styles.safe}>
      <ScrollView contentContainerStyle={styles.pageContent}>
        <View style={styles.headerText}>
          <Text style={styles.pageTitle}>Meu perfil</Text>
          <Text style={styles.pageSubtitle}>
            Suas informações e configurações
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.profileHeader}>
            <View style={styles.profileAvatar}>
              <Ionicons name="person-outline" size={36} color={cores.primary} />
            </View>

            <Text style={styles.profileName}>
              {usuario?.nomeUsuario || "Nome não disponível"}
            </Text>

            <Text style={styles.profileEmail}>
              {usuario?.email || "E-mail não disponível"}
            </Text>

            <View style={styles.profileBadge}>
              <Text style={styles.profileBadgeText}>Doador</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados da conta</Text>

          <View style={styles.card}>
            <View style={styles.detailRow}>
              <Ionicons name="person-outline" size={20} color={cores.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Nome</Text>
                <Text style={styles.detailValue}>
                  {usuario?.nomeUsuario || "Não informado"}
                </Text>
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.detailRow}>
              <Ionicons name="mail-outline" size={20} color={cores.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>E-mail</Text>
                <Text style={styles.detailValue}>
                  {usuario?.email || "Não informado"}
                </Text>
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.detailRow}>
              <Ionicons name="heart-outline" size={20} color={cores.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Tipo de conta</Text>
                <Text style={styles.detailValue}>Doador</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações</Text>

          <View style={styles.card}>
            <View style={styles.settingsRow}>
              <Ionicons name="create-outline" size={22} color={cores.muted} />
              <Text style={styles.settingsText}>Editar perfil</Text>
              <Text style={styles.disabledText}>Em breve</Text>
            </View>

            <View style={styles.separator} />

            <Pressable
              style={styles.settingsRow}
              onPress={confirmarLogout}
              disabled={saindo}
            >
              <Ionicons
                name="log-out-outline"
                size={22}
                color={cores.primary}
              />
              <Text style={styles.settingsText}>Sair da conta</Text>
              {saindo ? (
                <ActivityIndicator color={cores.primary} />
              ) : (
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={cores.muted}
                />
              )}
            </Pressable>

            <View style={styles.separator} />

            <View style={styles.settingsRow}>
              <Ionicons name="trash-outline" size={22} color={cores.danger} />
              <Text style={[styles.settingsText, styles.settingsDangerText]}>
                Excluir conta
              </Text>
              <Text style={styles.disabledText}>Em breve</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
