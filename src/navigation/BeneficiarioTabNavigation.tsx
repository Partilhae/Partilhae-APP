import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BeneficiarioTabParamlist } from "../types/Navigation";
import estilos, { cores } from "../estilos/estilo";
import DashboardBeneficiarioScreen from "../screens/beneficiario/DashboardBeneficiarioScreen";
import { Ionicons } from "@expo/vector-icons";
import PerfilBeneficiarioScreen from "../screens/beneficiario/PerfilBeneficiarioScreen";

const Tab = createBottomTabNavigator<BeneficiarioTabParamlist>();

export default function BeneficiarioTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: cores.primary,
        tabBarInactiveTintColor: cores.textSecondary,
        tabBarStyle: estilos.tabBar,
        tabBarLabelStyle: estilos.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="InicioBeneficiario"
        component={DashboardBeneficiarioScreen}
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="PerfilBeneficiario"
        component={PerfilBeneficiarioScreen}
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
