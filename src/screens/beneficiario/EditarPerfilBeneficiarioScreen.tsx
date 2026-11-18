import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import PerfilBeneficiarioForm from "../../components/forms/PerfilBeneficiarioForm";
import estilos, { cores } from "../../estilos/estilo";
import {
  BeneficiarioUpdateRequest,
  PerfilBeneficiarioFormData,
} from "../../types/Beneficiario";
import { buscarUsuarioLogado } from "../../services/AuthService";
import {
  atualizarBeneficiario,
  buscarBeneficiario,
} from "../../services/BeneficiarioService";

const dadosVazios: PerfilBeneficiarioFormData = {
  nomeUsuario: "",
  email: "",
  telefone: "",
  cep: "",
  endereco: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  estado: "",
  tipoBeneficiario: "pessoaFisica",
  nomeOrganizacao: "",
  quantidadePessoasFamilia: "",
  possuiCriancas: null,
  restricaoAlimentar: "",
  observacao: "",
};

export default function EditarPerfilBeneficiarioScreen() {
  const navigation = useNavigation();

  const [idBeneficiario, setIdBeneficiario] = useState<number | null>(null);
  const [dados, setDados] = useState<PerfilBeneficiarioFormData>(dadosVazios);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erroCarregamento, setErroCarregamento] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      async function carregar() {
        try {
          setLoading(true);
          setErroCarregamento(false);
          setIdBeneficiario(null);

          const usuario = await buscarUsuarioLogado();

          if (!usuario?.idReceptor) {
            if (ativo) setErroCarregamento(true);
            return;
          }

          const perfil = await buscarBeneficiario(usuario.idReceptor);

          if (!ativo) return;

          if (!perfil) {
            setErroCarregamento(true);
            return;
          }

          setIdBeneficiario(usuario.idReceptor);

          setDados({
            nomeUsuario: perfil.nomeUsuario,
            email: perfil.email,
            telefone: perfil.telefone ?? "",
            cep: perfil.cep ?? "",
            endereco: perfil.endereco ?? "",
            numero: perfil.numero ?? "",
            complemento: perfil.complemento ?? "",
            bairro: perfil.bairro ?? "",
            cidade: perfil.cidade ?? "",
            estado: perfil.estado ?? "",
            tipoBeneficiario: perfil.tipoBeneficiario,
            nomeOrganizacao: perfil.nomeOrganizacao ?? "",
            quantidadePessoasFamilia:
              perfil.quantidadePessoasFamilia?.toString() ?? "",
            possuiCriancas: perfil.possuiCriancas ?? null,
            restricaoAlimentar: perfil.restricaoAlimentar ?? "",
            observacao: perfil.observacao ?? "",
          });
        } catch (error) {
          console.log("Erro ao carregar perfil:", error);

          if (ativo) setErroCarregamento(true);
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

  async function salvar(dadosFormulario: PerfilBeneficiarioFormData) {
    if (idBeneficiario === null || salvando) return;

    try {
      setSalvando(true);

      const cepLimpo = dadosFormulario.cep.replace(/\D/g, "");

      const dadosAtualizados: BeneficiarioUpdateRequest = {
        nomeUsuario: dadosFormulario.nomeUsuario.trim(),
        email: dadosFormulario.email.trim().toLowerCase(),
        telefone: dadosFormulario.telefone.replace(/\D/g, ""),
        cep: `${cepLimpo.slice(0, 5)}-${cepLimpo.slice(5)}`,
        endereco: dadosFormulario.endereco.trim(),
        numero: dadosFormulario.numero.trim(),
        complemento: dadosFormulario.complemento.trim(),
        bairro: dadosFormulario.bairro.trim(),
        cidade: dadosFormulario.cidade.trim(),
        estado: dadosFormulario.estado.trim(),
        tipoBeneficiario: dadosFormulario.tipoBeneficiario,
        nomeOrganizacao:
          dadosFormulario.tipoBeneficiario === "ONG"
            ? dadosFormulario.nomeOrganizacao.trim()
            : "",
        possuiCriancas: dadosFormulario.possuiCriancas,
        restricaoAlimentar: dadosFormulario.restricaoAlimentar.trim(),
        observacao: dadosFormulario.observacao.trim(),
      };

      if (dadosFormulario.quantidadePessoasFamilia.trim()) {
        dadosAtualizados.quantidadePessoasFamilia = Number(
          dadosFormulario.quantidadePessoasFamilia,
        );
      }

      if (dadosFormulario.possuiCriancas !== null) {
        dadosAtualizados.possuiCriancas = dadosFormulario.possuiCriancas;
      }

      const resultado = await atualizarBeneficiario(
        idBeneficiario,
        dadosAtualizados,
      );

      if (!resultado) return;

      Alert.alert(
        "Perfil atualizado",
        "Suas informações foram salvas com sucesso.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error) {
      console.log("Erro ao salvar perfil:", error);
      Alert.alert("Erro", "Não foi possível salvar as alterações.");
    } finally {
      setSalvando(false);
    }
  }

  if (loading) {
    return (
      <View style={estilos.loading}>
        <ActivityIndicator size="large" color={cores.primary} />
      </View>
    );
  }

  if (erroCarregamento) {
    return (
      <SafeAreaView style={estilos.safe} edges={["top", "bottom"]}>
        <View style={estilos.pageContent}>
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={estilos.solicitacaoVoltar}>← Voltar</Text>
          </Pressable>

          <Text style={estilos.pageSubtitle}>
            Não foi possível carregar os dados do perfil.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={estilos.safe} edges={["top", "bottom"]}>
      <ScrollView
        contentContainerStyle={estilos.pageContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={estilos.solicitacaoVoltar}>← Voltar</Text>
        </Pressable>

        <View style={estilos.cadastroHeader}>
          <Text style={estilos.cadastroTitulo}>Editar perfil</Text>

          <Text style={estilos.cadastroSubtitulo}>
            Atualize suas informações pessoais.
          </Text>
        </View>

        <PerfilBeneficiarioForm
          dadosIniciais={dados}
          onSubmit={salvar}
          loading={salvando}
          salvamentoDisponivel={idBeneficiario !== null}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
