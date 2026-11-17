import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

import AuthNavigator from "./src/navigation/AppStack";
import { SolicitacoesProvider } from "./src/context/SolicitacoesContext";
import { DoacoesProvider } from "./src/context/DoacoesContext";
import { ConversasProvider } from "./src/context/ConversasContext";

export default function App() {
  return (
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
  );
}