import { useNavigation } from "@react-navigation/native";
import { DoadorNavigation } from "../../types/Navigation";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { buscarUsuarioLogado, logoutUsuario } from "../../services/AuthService";
import estilos, { cores } from "../../estilos/estilo";
import { deletarDoador } from "../../services/DoadorService";

export default function ConfiguracoesPerfilDoadorScreen() {
  const navigation = useNavigation<DoadorNavigation>();

  function excluirConta() {
    Alert.alert(
      "Excluir conta",
      "Tem certeza que deseja excluir sua conta? Esta ação não poderá ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: confirmarExclusao,
        },
      ],
    );
  }

  async function confirmarExclusao() {
    try {
      const usuario = await buscarUsuarioLogado();

      if (!usuario?.idDoador) {
        Alert.alert("Erro", "Não foi possível identificar o doador.");
        return;
      }

      const excluiu = await deletarDoador(usuario.idDoador);

      if (!excluiu) return;

      await logoutUsuario();

      navigation.getParent()?.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.log("Erro ao excluir conta:", error);
      Alert.alert("Erro", "Não foi possível excluir sua conta.");
    }
  }

  return (
    <View style={estilos.safe}>
      <ScrollView
        contentContainerStyle={estilos.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Pressable style={estilos.backBtn} onPress={() => navigation.goBack()}>
          <Text style={estilos.backBtnText}>← Voltar</Text>
        </Pressable>

        <View>
          <Text style={estilos.title}>Configurações</Text>
          <Text style={estilos.pageSubtitle}>Gerencie sua conta.</Text>
        </View>

        <View style={estilos.section}>
          <Text style={estilos.sectionTitle}>Perfil</Text>

          <Text style={estilos.pageSubtitle}>
            Atualize suas informações pessoais.
          </Text>

          <Pressable
            style={({ pressed }) => [
              estilos.settingsRow,
              pressed && { opacity: 0.7 },
            ]}
            onPress={() => navigation.navigate("EditarPerfilDoador")}
          >
            <View style={estilos.detailIcon}>
              <Ionicons name="person-outline" size={21} color={cores.primary} />
            </View>

            <View style={estilos.detailContent}>
              <Text style={estilos.itemTitle}>Editar perfil</Text>
              <Text style={estilos.itemSubtitle}>
                Nome, telefone, localização e outros dados.
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color={cores.muted} />
          </Pressable>
        </View>

        <View style={estilos.separator} />

        <View style={estilos.section}>
          <Text style={estilos.sectionTitle}>Segurança</Text>

          <Text style={estilos.pageSubtitle}>
            Acompanhe as denúncias que você registrou.
          </Text>

          <Pressable
            style={({ pressed }) => [
              estilos.settingsRow,
              pressed && { opacity: 0.7 },
            ]}
            onPress={() => navigation.navigate("MinhasDenuncias")}
          >
            <View style={estilos.detailIcon}>
              <Ionicons
                name="shield-checkmark-outline"
                size={21}
                color={cores.primary}
              />
            </View>

            <View style={estilos.detailContent}>
              <Text style={estilos.itemTitle}>Minhas denúncias</Text>

              <Text style={estilos.itemSubtitle}>
                Consulte o status e a resolução das suas denúncias.
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color={cores.muted} />
          </Pressable>
        </View>

        <View style={estilos.separator} />

        <View style={estilos.section}>
          <Text style={estilos.sectionTitle}>Conta</Text>

          <Text style={estilos.pageSubtitle}>
            Ações relacionadas à sua conta.
          </Text>

          <Pressable
            style={({ pressed }) => [
              estilos.settingsRow,
              pressed && { opacity: 0.7 },
            ]}
            onPress={excluirConta}
          >
            <View style={estilos.detailIcon}>
              <Ionicons name="trash-outline" size={21} color={cores.danger} />
            </View>

            <View style={estilos.detailContent}>
              <Text style={[estilos.itemTitle, estilos.settingsDangerText]}>
                Excluir conta
              </Text>

              <Text style={estilos.itemSubtitle}>
                Remove permanentemente sua conta e seus dados.
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color={cores.muted} />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
