import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/Navigation";
import { useEffect, useState } from "react";
import { buscarUsuarioLogado } from "../services/Auth";
import { ActivityIndicator, View } from "react-native";
import LoginScreen from "../screens/autenticacao/LoginScreen";
import CadastroDoadorScreen from "../screens/autenticacao/CadastroDoadorScreen";
import CadastroBeneficiarioScreen from "../screens/autenticacao/CadastroBeneficiarioScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppStack(){
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList>("Login");

  useEffect(() => {
    verificarSessao();
  }, []);

  async function verificarSessao(){
    try {
      const usuario = await buscarUsuarioLogado();

      if(!usuario){
        setInitialRoute("Login");
        return;
      }
      if(usuario.role === "RECEPTOR"){
        setInitialRoute("Beneficiario");
        return;
      }
      if(usuario.role === "DOADOR"){
        setInitialRoute("Doador");
        return;
      }

      setInitialRoute("Login");
    } catch (error) {
      console.log("Erro ao verificar sessão:", error);

      setInitialRoute("Login");
    } finally {
      setLoading(false);
    }
  }

  if(loading){
    return (
      <View style={{flex: 1, justifyContent: "center", alignItems:"center"}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return(
    <Stack.Navigator 
    initialRouteName={initialRoute}
    screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="CadastroDoador" component={CadastroDoadorScreen} />
      <Stack.Screen name="CadastroBeneficiario" component={CadastroBeneficiarioScreen} />
    </Stack.Navigator>
  )
}