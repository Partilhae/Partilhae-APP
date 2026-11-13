import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DoadorTabParamlist } from "../types/Navigation";
import estilos, { cores } from "../estilos/estilo";
import { Ionicons } from "@expo/vector-icons";
import DashboardDoadorScreen from "../screens/doador/DashboardDoadorScreen";
import PerfilDoadorScreen from "../screens/doador/PerfilDoadorScreen";

const Tab = createBottomTabNavigator<DoadorTabParamlist>();

export default function DoadorTabs() {
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
        name="InicioDoador"
        component={DashboardDoadorScreen}
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="PerfilDoador"
        component={PerfilDoadorScreen}
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
