import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import estilos from "../../estilos/estilo";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types/Navigation";
import { useState } from "react";
import { CadastroBeneficiario } from "../../types/Beneficiario";
import BeneficiarioForm from "../../components/forms/BeneficiarioForm";
import { cadastrarBeneficiario } from "../../services/BeneficiarioService";
import { logarUsuario } from "../../services/AuthService";
import { SafeAreaView } from "react-native-safe-area-context";

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

      const usuario = await logarUsuario(dados.email, dados.senha);

      if(!usuario){
        Alert.alert("Cadastro realizao", "Sua conta foi criada com sucesso. Faça login para continuar",
          [
            {
              text: "Ir para Login",
              onPress: () =>
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Login" }],
                }),
            }
          ]
        )
        return;
      }

      if(usuario.role !== "RECEPTOR"){
        Alert.alert("Erro", "O perfil retornado não corresponde o de beneficiário.");
        return;
      }

      navigation.reset({
        index: 0,
        routes: [{ name: "Beneficiario" }],
      });
    } catch (error) {
      console.log("Erro ao cadastrar beneficiário:", error);

      Alert.alert("Erro", "Não foi possível concluir o cadastro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={estilos.safe} edges={["top", "bottom"]}>
      <ScrollView
        contentContainerStyle={estilos.cadastroScroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable style={estilos.backBtn} onPress={() => navigation.goBack()}>
          <Text style={estilos.backBtnText}>← Voltar</Text>
        </Pressable>
        
        <View style={estilos.cadastroHeader}>
          <Text style={estilos.cadastroTitulo}>Receba ajuda</Text>

          <Text style={estilos.cadastroSubtitulo}>
            Faça parte de uma rede de solidariedade. Preencha seus dados para
            começar.
          </Text>
        </View>

        <BeneficiarioForm onSubmit={handleRegister} loading={loading} />

        <View style={estilos.cadastroFooter}>
          <Text style={estilos.loginFooterText}>
            Quer compartilhar alimentos?
          </Text>

          <Pressable onPress={() => navigation.navigate("CadastroDoador")}>
            <Text style={estilos.footerLink}>Cadastre-se como doador</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
