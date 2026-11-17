import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import DoadorForm from "../../components/forms/DoadorForm";
import estilos from "../../estilos/estilo";
import { CadastroDoador } from "../../types/Doador";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types/Navigation";
import { useState } from "react";
import { cadastrarDoador } from "../../services/DoadorService";
import { logarUsuario } from "../../services/AuthService";

export default function CadastroDoadorScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);

  async function handleRegister(dados: CadastroDoador) {
      try {
        setLoading(true);
  
        const beneficiario = await cadastrarDoador(dados);
  
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
  
        if(usuario.role !== "DOADOR"){
          Alert.alert("Erro", "O perfil retornado não corresponde o de doador.");
          return;
        }
  
        navigation.reset({
          index: 0,
          routes: [{ name: "Doador" }],
        });
      } catch (error) {
        console.log("Erro ao cadastrar doador:", error);
  
        Alert.alert("Erro", "Não foi possível concluir o cadastro. Tente novamente.");
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
