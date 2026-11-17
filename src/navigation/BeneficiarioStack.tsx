import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BeneficiarioStackParamlist } from "../types/Navigation";
import BeneficiarioTabs from "./BeneficiarioTabNavigation";
import EditarPerfilBeneficiarioScreen from "../screens/beneficiario/EditarPerfilBeneficiarioScreen";
import NovaSolicitacaoBeneficiarioScreen from "../screens/beneficiario/NovaSolicitacaoBeneficiarioScreen";
import DetalhesSolicitacaoScreen from "../screens/beneficiario/DetalhesSolicitacoesBeneficiarioScreen";
import EditarSolicitacaoBeneficiarioScreen from "../screens/beneficiario/EditarSolicitacaoBeneficiarioScreen";
import ConfiguracoesPerfilBeneficiarioScreen from "../screens/beneficiario/ConfiguracoesPerfilBeneficiarioScreen";
import DetalhesDoacaoRecebidaBeneficiarioScreen from "../screens/beneficiario/DetalhesDoacoesRecebidasBeneficiarioScreen";
import ConversasScreen from "../screens/usuarios/ConversasScreen";
import ChatScreen from "../screens/usuarios/ChatScreen";
import NovaDenunciaScreen from "../screens/usuarios/NovaDenunciaScreen";
import MinhasDenunciasScreen from "../screens/usuarios/MinhasDenunciasScreen";

const Stack = createNativeStackNavigator<BeneficiarioStackParamlist>();

export default function BeneficiarioStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="BeneficiarioTabs" component={BeneficiarioTabs} />
        <Stack.Screen name="NovaSolicitacaoBeneficiario" component={NovaSolicitacaoBeneficiarioScreen} />
        <Stack.Screen name="EditarPerfilBeneficiario" component={EditarPerfilBeneficiarioScreen} />
        <Stack.Screen name = "DetalhesSolicitacaoBeneficiario" component={DetalhesSolicitacaoScreen} />
        <Stack.Screen name = "EditarSolicitacaoBeneficiario" component={EditarSolicitacaoBeneficiarioScreen} />
        <Stack.Screen name="ConfiguracoesPerfilBeneficiario" component={ConfiguracoesPerfilBeneficiarioScreen} />
        <Stack.Screen name="DetalhesDoacoesRecebidasBeneficiario" component={DetalhesDoacaoRecebidaBeneficiarioScreen} />
        <Stack.Screen name = "Conversas" component={ConversasScreen} /> 
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="NovaDenuncia" component={NovaDenunciaScreen} />
        <Stack.Screen name="MinhasDenuncias" component={MinhasDenunciasScreen} />
    </Stack.Navigator>
  );
}
