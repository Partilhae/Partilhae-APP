import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DoadorTabParamlist } from "../types/Navigation";
import estilos, { cores } from "../estilos/estilo";
import { Ionicons } from "@expo/vector-icons";
import DashboardDoadorScreen from "../screens/doador/DashboardDoadorScreen";
import ExplorarSolicitacoesScreen from "../screens/doador/ExplorarSolicitacoesDoadorScreen";
import MinhasDoacoesScreen from "../screens/doador/MinhasDoacoesDoadorScreen";
import PerfilDoadorScreen from "../screens/doador/PerfilDoadorScreen";
import ConversasScreen from "../screens/usuarios/ConversasScreen";

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
        name="Solicitacoes"
        component={ExplorarSolicitacoesScreen}
        options={{
          title: "Ajudar",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="MinhasDoacoes"
        component={MinhasDoacoesScreen}
        options={{
          title: "Doações",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="gift-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Conversas"
        component={ConversasScreen}
        options={{
          title: "Conversas",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-outline" color={color} size={size} />
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
