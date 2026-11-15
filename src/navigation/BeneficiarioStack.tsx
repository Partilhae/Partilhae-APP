import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BeneficiarioStackParamlist } from "../types/Navigation";
import BeneficiarioTabs from "./BeneficiarioTabNavigation";
import EditarPerfilBeneficiarioScreen from "../screens/beneficiario/EditarPerfilBeneficiarioScreen";
import NovaSolicitacaoBeneficiarioScreen from "../screens/beneficiario/NovaSolicitacaoBeneficiarioScreen";
import DetalhesSolicitacaoScreen from "../screens/beneficiario/DetalhesSolicitacoesBeneficiarioScreen";
import EditarSolicitacaoBeneficiarioScreen from "../screens/beneficiario/EditarSolicitacaoBeneficiarioScreen";

const Stack = createNativeStackNavigator<BeneficiarioStackParamlist>();

export default function BeneficiarioStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="BeneficiarioTabs" component={BeneficiarioTabs} />
        <Stack.Screen name="NovaSolicitacaoBeneficiario" component={NovaSolicitacaoBeneficiarioScreen} />
        <Stack.Screen name="EditarPerfilBeneficiario" component={EditarPerfilBeneficiarioScreen} />
        <Stack.Screen name = "DetalhesSolicitacaoBeneficiario" component={DetalhesSolicitacaoScreen} />
        <Stack.Screen name = "EditarSolicitacaoBeneficiario" component={EditarSolicitacaoBeneficiarioScreen} />
    </Stack.Navigator>
  );
}
