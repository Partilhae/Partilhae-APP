import { Alert, ScrollView, Text, View } from "react-native";
import DoadorForm from "../../components/forms/DoadorForm";
import estilos, { cores } from "../../estilos/estilo";
import { CadastroDoador } from "../../types/Doador";

export default function CadastroDoadorScreen() {
  function handleCadastro(dados: CadastroDoador) {
    Alert.alert(
      "Cadastro de doador",
      "O formulário foi validado. O cadastro será enviado quando integrarmos a API Java.",
    );
  }

  return (
    <ScrollView
      style={estilos.container}
      contentContainerStyle={estilos.conteudo}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ gap: 8, marginBottom: 24 }}>
        <Text style={estilos.titulo}>Seja um doador</Text>

        <Text style={estilos.subtitulo}>Cadastre-se e ajude quem precisa.</Text>

        <Text
          style={{
            color: cores.cinza,
            textAlign: "center",
            marginTop: 8,
          }}
        >
          Preencha seus dados para criar sua conta.
        </Text>
      </View>

      <DoadorForm onSubmit={handleCadastro} loading={false} />
    </ScrollView>
  );
}
