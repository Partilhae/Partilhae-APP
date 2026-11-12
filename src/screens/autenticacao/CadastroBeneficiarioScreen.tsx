import { Alert, ScrollView, Text, View } from "react-native";
import BeneficiarioForm from "../../components/forms/BeneficiarioForm";
import estilos, { cores } from "../../estilos/estilo";
import { CadastroBeneficiario } from "../../types/Beneficiario";

export default function CadastroBeneficiarioScreen() {
  function handleCadastro(dados: CadastroBeneficiario) {
    Alert.alert(
      "Cadastro de beneficiário",
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
        <Text style={estilos.titulo}>Receba ajuda</Text>

        <Text style={estilos.subtitulo}>
          Faça parte de uma rede de solidariedade.
        </Text>

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

      <BeneficiarioForm onSubmit={handleCadastro} loading={false} />
    </ScrollView>
  );
}
