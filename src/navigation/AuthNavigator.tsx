import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../types/Navigation";
import { cores } from "../estilos/estilo";

import LoginScreen from "../screens/autenticacao/LoginScreen";
import CadastroDoadorScreen from "../screens/autenticacao/CadastroDoadorScreen";
import CadastroBeneficiarioScreen from "../screens/autenticacao/CadastroBeneficiarioScreen";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: {
          backgroundColor: cores.fundo,
        },
        headerTintColor: cores.primaria,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        contentStyle: {
          backgroundColor: cores.fundo,
        },
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="CadastroDoador"
        component={CadastroDoadorScreen}
        options={{
          title: "Cadastro de Doador",
        }}
      />

      <Stack.Screen
        name="CadastroBeneficiario"
        component={CadastroBeneficiarioScreen}
        options={{
          title: "Cadastro de Beneficiário",
        }}
      />
    </Stack.Navigator>
  );
}
