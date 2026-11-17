import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import styles, { cores } from "../../estilos/estilo";
import { buscarUsuarioLogado, logoutUsuario } from "../../services/AuthService";
import { BeneficiarioNavigation } from "../../types/Navigation";
import { BeneficiarioResponse } from "../../types/Beneficiario";
import { buscarBeneficiario } from "../../services/BeneficiarioService";
import estilos from "../../estilos/estilo";

export default function PerfilBeneficiarioScreen() {
  const navigation = useNavigation<BeneficiarioNavigation>();
  const [perfil, setPerfil] = useState<BeneficiarioResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      carregarPerfil();
    }, []),
  );

  async function carregarPerfil() {
    try {
      setLoading(true);

      const usuario = await buscarUsuarioLogado();

      if (!usuario || !usuario.idReceptor) {
        return;
      }

      const beneficiario = await buscarBeneficiario(usuario.idReceptor);

      setPerfil(beneficiario);
    } catch (error) {
      console.log("Erro ao carregar perfil:", error);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await logoutUsuario();

    navigation
      .getParent()
      ?.getParent()
      ?.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
  }

  if (loading) {
    return (
      <View style={styles.safe}>
        <ActivityIndicator size="large" color={cores.primary} />
      </View>
    );
  }

  if (!perfil) {
    return (
      <View style={styles.safe}>
        <Text>Não foi possível carregar o perfil.</Text>
      </View>
    );
  }

  return (
    <View style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <View style={styles.profileAvatar}>
            <Ionicons name="person-outline" size={48} color={cores.primary} />
          </View>

          <Text style={styles.profileName}>{perfil.nomeUsuario}</Text>

          <Text style={styles.profileEmail}>{perfil.email}</Text>

          <View style={styles.profileBadge}>
            <Text style={styles.profileBadgeText}>Beneficiário</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados da conta</Text>

          <View style={styles.card}>
            <View style={styles.detailRow}>
              <Ionicons name="call-outline" size={20} color={cores.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Telefone</Text>
                <Text style={styles.detailValue}>{perfil.telefone}</Text>
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.detailRow}>
              <Ionicons
                name="location-outline"
                size={20}
                color={cores.primary}
              />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Endereço</Text>
                <Text style={styles.detailValue}>
                  {perfil.endereco}, {perfil.numero}
                </Text>
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.detailRow}>
              <Ionicons name="map-outline" size={20} color={cores.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Estado e cidade</Text>
                <Text style={styles.detailValue}>
                  {perfil.estado}, {perfil.cidade}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações</Text>

          <Pressable
            style={({ pressed }) => [
              estilos.settingsRow,
              pressed && { opacity: 0.7 },
            ]}
            onPress={() =>
              navigation.navigate("ConfiguracoesPerfilBeneficiario")
            }
          >
            <View style={styles.card}>
              <Ionicons name="create-outline" size={22} color={cores.muted} />
              <Text style={styles.settingsText}>
                Edite seus dados e gerencie sua conta.
              </Text>
            </View>
          </Pressable>

          <View style={styles.separator} />

          <View style={styles.card}>
            <Pressable
              style={({ pressed }) => [
                styles.settingsRow,
                pressed && { opacity: 0.7 },
              ]}
              onPress={logout}
            >
              <Ionicons
                name="log-out-outline"
                size={22}
                color={cores.primary}
              />
              <Text style={styles.settingsText}>Sair da conta</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
