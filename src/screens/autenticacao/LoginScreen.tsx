import { Alert, ScrollView, Text, View } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import LoginForm from "../../components/forms/LoginForm";
import Botao from "../../components/Botao";
import estilos, { cores } from "../../estilos/estilo";
import { LoginFormData } from "../../types/Auth";
import { AuthStackParamList } from "../../types/Navigation";

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  function handleLogin(dados: LoginFormData) {
    Alert.alert(
      "Login",
      "A autenticação será habilitada quando integrarmos a API Java.",
    );
  }

  return (
    <ScrollView
      style={estilos.container}
      contentContainerStyle={[estilos.conteudo, { justifyContent: "center" }]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ gap: 12, marginBottom: 32 }}>
        <Text style={estilos.titulo}>Partilhaê</Text>

        <Text style={estilos.subtitulo}>Compartilhar transforma vidas.</Text>

        <Text
          style={{
            textAlign: "center",
            color: cores.cinza,
            marginTop: 12,
          }}
        >
          Entre na sua conta para continuar.
        </Text>
      </View>

      <LoginForm onSubmit={handleLogin} loading={false} />

      <View style={{ marginTop: 32, gap: 12 }}>
        <Text
          style={{
            textAlign: "center",
            color: cores.texto,
            fontWeight: "600",
          }}
        >
          Ainda não tem uma conta?
        </Text>

        <Botao
          label="Quero doar"
          variant="outline"
          onPress={() => navigation.navigate("CadastroDoador")}
        />

        <Botao
          label="Preciso de ajuda"
          variant="outline"
          onPress={() => navigation.navigate("CadastroBeneficiario")}
        />
      </View>
    </ScrollView>
  );
}
