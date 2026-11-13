import { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import PerfilBeneficiarioForm from "../../components/forms/PerfilBeneficiarioForm";
import styles, { cores } from "../../estilos/estilo";
import { PerfilBeneficiarioFormData } from "../../types/Beneficiario";
import { buscarUsuarioLogado } from "../../services/Auth";

const dadosVazios: PerfilBeneficiarioFormData = {
  nomeUsuario: "",
  email: "",
  telefone: "",
  cep: "",
  endereco: "",
  numero: "",
  bairro: "",
  cidade: "",
  estado: "",
  tipoBeneficiario: "pessoaFisica",
  nomeOrganizacao: "",
  raioBuscaKm: 5,
  quantidadePessoasFamilia: "",
  possuiCriancas: null,
  restricaoAlimentar: "",
  observacao: "",
};

export default function EditarPerfilBeneficiarioScreen() {
  const [dados, setDados] = useState(dadosVazios);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      async function carregar() {
        try {
          setLoading(true);

          const usuario = await buscarUsuarioLogado();

          if (ativo && usuario) {
            setDados({
              ...dadosVazios,
              nomeUsuario: usuario.nomeUsuario,
              email: usuario.email,
            });
          }
        } finally {
          if (ativo) setLoading(false);
        }
      }

      carregar();

      return () => {
        ativo = false;
      };
    }, []),
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={cores.primary} />
      </View>
    );
  }

  return (
    <View style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.pageContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerText}>
          <Text style={styles.pageTitle}>Editar perfil</Text>
          <Text style={styles.pageSubtitle}>
            Atualize suas informações e necessidades
          </Text>
        </View>

        <PerfilBeneficiarioForm
          dadosIniciais={dados}
          onSubmit={() => {}}
          salvamentoDisponivel={false}
        />
      </ScrollView>
    </View>
  );
}
