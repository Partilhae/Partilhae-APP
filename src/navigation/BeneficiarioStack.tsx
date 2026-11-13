import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BeneficiarioStackParamlist } from "../types/Navigation";
import BeneficiarioTabs from "./BeneficiarioTabNavigation";
import EditarPerfilBeneficiarioScreen from "../screens/beneficiario/EditarPerfilBeneficiarioScreen";

const Stack = createNativeStackNavigator<BeneficiarioStackParamlist>();

export default function BeneficiarioStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="BeneficiarioTabs" component={BeneficiarioTabs} />
        <Stack.Screen name="EditarPerfilBeneficiario" component={EditarPerfilBeneficiarioScreen} />
    </Stack.Navigator>
  );
}
