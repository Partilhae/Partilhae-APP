import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DoadorStackParamlist } from "../types/Navigation";
import EditarPerfilDoadorScreen from "../screens/doador/EditarPerfilDoadorScreen";
import DoadorTabs from "./DoadorTabNavigation";
import DetalhesSolicitacaoDoadorScreen from "../screens/doador/DetalhesSolicitacaoDoadorScreen";
import DetalhesDoacaoDoadorScreen from "../screens/doador/DetalhesDoacaoDoadorScreen";
import ConfiguracoesPerfilDoadorScreen from "../screens/doador/ConfiguracoesPerfilDoadorScreen";
import ConversasScreen from "../screens/usuarios/ConversasScreen";
import ChatScreen from "../screens/usuarios/ChatScreen";
import NovaDenunciaScreen from "../screens/usuarios/NovaDenunciaScreen";
import MinhasDenunciasScreen from "../screens/usuarios/MinhasDenunciasScreen";

const Stack = createNativeStackNavigator<DoadorStackParamlist>();

export default function DoadorStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DoadorTabs" component={DoadorTabs} />
      <Stack.Screen
        name="DetalhesSolicitacaoDoador"
        component={DetalhesSolicitacaoDoadorScreen}
      />
      <Stack.Screen
        name="DetalhesDoacaoDoador"
        component={DetalhesDoacaoDoadorScreen}
      />
      <Stack.Screen
        name="EditarPerfilDoador"
        component={EditarPerfilDoadorScreen}
      />
      <Stack.Screen
        name="ConfiguracoesPerfilDoador"
        component={ConfiguracoesPerfilDoadorScreen}
      />
      <Stack.Screen name="Conversas" component={ConversasScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="NovaDenuncia" component={NovaDenunciaScreen} />
      <Stack.Screen name="MinhasDenuncias" component={MinhasDenunciasScreen} />
    </Stack.Navigator>
  );
}
