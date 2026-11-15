import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {  DoadorStackParamlist } from "../types/Navigation";
import EditarPerfilDoadorScreen from "../screens/doador/EditarPerfilDoadorScreen";
import DoadorTabs from "./DoadorTabNavigation";
import DetalhesSolicitacaoDoadorScreen from "../screens/doador/DetalhesSolicitacaoDoadorScreen";

const Stack = createNativeStackNavigator<DoadorStackParamlist>();

export default function DoadorStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="DoadorTabs" component={DoadorTabs} />
        <Stack.Screen name="DetalhesSolicitacaoDoador" component={DetalhesSolicitacaoDoadorScreen} />
        <Stack.Screen name="EditarPerfilDoador" component={EditarPerfilDoadorScreen} />
    </Stack.Navigator>
  );
}
