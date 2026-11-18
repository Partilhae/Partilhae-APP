import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

import AuthNavigator from "./src/navigation/AppStack";
import { SolicitacoesProvider } from "./src/context/SolicitacoesContext";
import { DoacoesProvider } from "./src/context/DoacoesContext";
import { ConversasProvider } from "./src/context/ConversasContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";
import { configurarNotificacoes } from "./src/services/NotificacaoService";

export default function App() {
  useEffect(() => {
  configurarNotificacoes().catch((error) => {
    console.log("Erro ao configurar notificações:", error);
  });
}, []);
  return (
    <SafeAreaProvider>
      <SolicitacoesProvider>
        <DoacoesProvider>
          <ConversasProvider>
            <NavigationContainer>
              <AuthNavigator />
            </NavigationContainer>

            <StatusBar style="dark" />
          </ConversasProvider>
        </DoacoesProvider>
      </SolicitacoesProvider>
    </SafeAreaProvider>
  );
}
