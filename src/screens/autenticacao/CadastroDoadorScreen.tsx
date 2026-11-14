import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import DoadorForm from "../../components/forms/DoadorForm";
import estilos from "../../estilos/estilo";
import { CadastroDoador } from "../../types/Doador";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types/Navigation";
import { useState } from "react";
import { cadastrarDoador } from "../../services/Auth";

export default function CadastroDoadorScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);

  async function handleRegister(dados: CadastroDoador) {
    try {
      setLoading(true);

      const doador = await cadastrarDoador(dados);

      if (!doador) {
        return;
      }

      Alert.alert("Sucesso", "Doador cadastrado com sucesso.", [
        {
          text: "Entrar",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.log("Erro ao cadastrar doador:", error);

      Alert.alert("Erro", "Não foi possível realizar o cadastro.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={estilos.safe}>
      <ScrollView
        contentContainerStyle={estilos.cadastroScroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={estilos.cadastroHeader}>
          <Text style={estilos.cadastroTitulo}>Seja um doador</Text>

          <Text style={estilos.cadastroSubtitulo}>
            Compartilhe o que puder e faça a diferença na sua comunidade.
          </Text>
        </View>

        <DoadorForm onSubmit={handleRegister} loading={loading} />

        <View style={estilos.cadastroFooter}>
          <Text style={estilos.loginFooterText}>Precisa de ajuda?</Text>

          <Pressable
            onPress={() => navigation.navigate("CadastroBeneficiario")}
          >
            <Text style={estilos.footerLink}>
              Cadastre-se como beneficiário
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
