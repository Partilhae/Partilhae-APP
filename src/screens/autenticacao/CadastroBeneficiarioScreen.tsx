import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import estilos from "../../estilos/estilo";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types/Navigation";
import { useState } from "react";
import { cadastrarBeneficiario, cadastrarDoador } from "../../services/Auth";
import { CadastroBeneficiario } from "../../types/Beneficiario";
import BeneficiarioForm from "../../components/forms/BeneficiarioForm";

export default function CadastroBeneficiarioScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);

  async function handleRegister(dados: CadastroBeneficiario) {
    try {
      setLoading(true);

      const beneficiario = await cadastrarBeneficiario(dados);

      if (!beneficiario) {
        return;
      }

      Alert.alert("Sucesso", "Beneficiário cadastrado com sucesso.", [
        {
          text: "Entrar",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.log("Erro ao cadastrar beneficiário:", error);

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
          <Text style={[estilos.title, estilos.textCenter]}>Receba ajuda</Text>
          <Text style={[estilos.subtitle, estilos.textCenter]}>
            Faça parte de uma rede de solidariedade.
          </Text>
        </View>

        <BeneficiarioForm onSubmit={handleRegister} loading={loading} />
        <Pressable
          style={({ pressed }) => [estilos.footer, pressed && { opacity: 0.7 }]}
          onPress={() => navigation.navigate("CadastroDoador")}
        >
          <Text style={estilos.footerLink}>Quer doar? Cadastre-se como doador</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
