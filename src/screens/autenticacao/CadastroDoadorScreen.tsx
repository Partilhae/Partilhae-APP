import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import DoadorForm from "../../components/forms/DoadorForm";
import estilos, { cores } from "../../estilos/estilo";
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
        contentContainerStyle={estilos.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={estilos.headerCenter}>
          <Text style={[estilos.title, estilos.textCenter]}>
            Seja um doador
          </Text>
          <Text style={[estilos.subtitle, estilos.textCenter]}>
            Compartilhe o que puder e faça a diferença na sua comunidade.
          </Text>
        </View>

        <DoadorForm onSubmit={handleRegister} loading={loading} />
        <Pressable
          style={({ pressed }) => [estilos.footer, pressed && { opacity: 0.7 }]}
          onPress={() => navigation.navigate("CadastroBeneficiario")}
        >
          <Text style={estilos.footerLink}>Precisa de ajuda? Cadastre-se como beneficiário</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
