import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import estilos, { cores } from "../../estilos/estilo";
import { buscarUsuarioLogado, logoutUsuario } from "../../services/AuthService";
import { DoadorStackParamlist } from "../../types/Navigation";
import { DoadorResponse } from "../../types/Doador";
import { buscarDoador } from "../../services/DoadorService";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PerfilDoadorScreen() {
  const navigation = useNavigation<NavigationProp<DoadorStackParamlist>>();
  const [perfil, setPerfil] = useState<DoadorResponse | null>(null);
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

      if (!usuario || !usuario.idDoador) {
        return;
      }

      const doador = await buscarDoador(usuario.idDoador);

      setPerfil(doador);
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
      <View style={estilos.loading}>
        <ActivityIndicator size="large" color={cores.primary} />
      </View>
    );
  }

  if (!perfil) {
    return (
      <View style={estilos.loading}>
        <Text>Não foi possível carregar o perfil.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={estilos.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={estilos.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={estilos.profileHeader}>
          <View style={estilos.profileAvatar}>
            <Ionicons name="person-outline" size={48} color={cores.primary} />
          </View>

          <Text style={estilos.profileName}>{perfil.nomeUsuario}</Text>

          <Text style={estilos.profileEmail}>{perfil.email}</Text>

          <View style={estilos.profileBadge}>
            <Text style={estilos.profileBadgeText}>Doador</Text>
          </View>
        </View>

        <View style={estilos.section}>
          <Text style={estilos.sectionTitle}>Dados da conta</Text>

          <View style={estilos.card}>
            <View style={estilos.detailRow}>
              <Ionicons name="call-outline" size={20} color={cores.primary} />
              <View style={estilos.detailContent}>
                <Text style={estilos.detailLabel}>Telefone</Text>
                <Text style={estilos.detailValue}>{perfil.telefone}</Text>
              </View>
            </View>

            <View style={estilos.separator} />

            <View style={estilos.detailRow}>
              <Ionicons
                name="location-outline"
                size={20}
                color={cores.primary}
              />
              <View style={estilos.detailContent}>
                <Text style={estilos.detailLabel}>Endereço</Text>
                <Text style={estilos.detailValue}>
                  {perfil.endereco}, {perfil.numero}
                </Text>
              </View>
            </View>

            <View style={estilos.separator} />

            <View style={estilos.detailRow}>
              <Ionicons name="map-outline" size={20} color={cores.primary} />
              <View style={estilos.detailContent}>
                <Text style={estilos.detailLabel}>Estado e cidade</Text>
                <Text style={estilos.detailValue}>
                  {perfil.estado}, {perfil.cidade}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={estilos.section}>
          <Text style={estilos.sectionTitle}>Configurações</Text>

          <View style={estilos.card}>
            <Pressable
              style={({ pressed }) => [
                estilos.settingsRow,
                pressed && { opacity: 0.7 },
              ]}
              onPress={() => navigation.navigate("ConfiguracoesPerfilDoador")}
            >
              <Ionicons name="settings-outline" size={22} color={cores.muted} />
              <View style={estilos.detailContent}>
                <Text style={estilos.itemTitle}>Gerenciar conta</Text>
                <Text style={estilos.itemSubtitle}>
                  Edite seus dados e acesse as configurações.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={cores.muted} />
            </Pressable>
            <View style={estilos.separator} />
            <Pressable
              style={({ pressed }) => [
                estilos.settingsRow,
                pressed && { opacity: 0.7 },
              ]}
              onPress={logout}
            >
              <Ionicons
                name="log-out-outline"
                size={22}
                color={cores.primary}
              />
              <View style={estilos.detailContent}>
                <Text style={estilos.itemTitle}>Sair da conta</Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color={cores.muted} />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
