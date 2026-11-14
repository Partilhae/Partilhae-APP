import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import LoginForm from "../../components/forms/LoginForm";
import estilos from "../../estilos/estilo";
import { LoginRequest, UserTipo } from "../../types/Auth";
import { RootStackParamList } from "../../types/Navigation";
import { useState } from "react";
import { logarUsuario } from "../../services/Auth";

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);

  async function handleLogin(dados: LoginRequest) {
    try {
      setLoading(true);

      const resultado = await logarUsuario(dados.email, dados.senha);

      if (!resultado) {
        Alert.alert("Login inválido", "E-mail ou senha incorretos");
        return;
      }

      if (resultado.role === "DOADOR") {
        navigation.navigate("Doador");
      } else {
        navigation.navigate("Beneficiario");
      }
    } catch (error) {
      console.log("Erro na tela de login:", error);

      Alert.alert("Erro", "Não foi possível realizar o login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={estilos.safe}>
      <ScrollView
        contentContainerStyle={estilos.loginScroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={estilos.loginHeader}>
          <Image
            source={require("../../../assets/LogoPartilhae.png")}
            style={estilos.loginLogo}
            resizeMode="contain"
          />
          <Text style={estilos.loginTitle}>Que bom ter você por aqui!</Text>
          <Text style={estilos.loginSubtitle}>
            Entre na sua conta e continue fazendo parte dessa rede de
            solidariedade.
          </Text>
        </View>

        <LoginForm onSubmit={handleLogin} loading={loading} />

        <View style={estilos.loginFooter}>
          <Text style={estilos.loginFooterText}>
            Ainda não possui uma conta?
          </Text>

          <Pressable
            onPress={() => navigation.navigate("CadastroBeneficiario")}
          >
            <Text style={estilos.loginFooterLink}>
              Criar conta como beneficiário
            </Text>
          </Pressable>

          <Pressable onPress={() => navigation.navigate("CadastroDoador")}>
            <Text style={estilos.loginFooterLink}>Criar conta como doador</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
