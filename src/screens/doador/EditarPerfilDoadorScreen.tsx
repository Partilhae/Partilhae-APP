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

import PerfilDoadorForm from "../../components/forms/PerfilDoadorForm";
import estilos, { cores } from "../../estilos/estilo";
import { DoadorUpdateRequest, PerfilDoadorFormData } from "../../types/Doador";
import { buscarUsuarioLogado } from "../../services/AuthService";
import { atualizarDoador, buscarDoador } from "../../services/DoadorService";

const dadosVazios: PerfilDoadorFormData = {
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
  tipoDoador: "pessoaFisica",
  nomeEstabelecimento: "",
  disponibilidade: "",
  observacao: "",
};

export default function EditarPerfilDoadorScreen() {
  const navigation = useNavigation();

  const [idDoador, setIdDoador] = useState<number | null>(null);
  const [dados, setDados] = useState<PerfilDoadorFormData>(dadosVazios);
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
          setIdDoador(null);

          const usuario = await buscarUsuarioLogado();

          if (!usuario?.idDoador) {
            if (ativo) setErroCarregamento(true);
            return;
          }

          const perfil = await buscarDoador(usuario.idDoador);

          if (!ativo) return;

          if (!perfil) {
            setErroCarregamento(true);
            return;
          }

          setIdDoador(usuario.idDoador);

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
            tipoDoador: perfil.tipoDoador,
            nomeEstabelecimento: perfil.nomeEstabelecimento ?? "",
            disponibilidade: perfil.disponibilidade ?? "",
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

  async function salvar(dadosFormulario: PerfilDoadorFormData) {
    if (idDoador === null || salvando) return;

    try {
      setSalvando(true);

      const cepLimpo = dadosFormulario.cep.replace(/\D/g, "");

      const dadosAtualizados: DoadorUpdateRequest = {
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
        tipoDoador: dadosFormulario.tipoDoador,
        nomeEstabelecimento:
          dadosFormulario.tipoDoador === "pessoaFisica"
            ? ""
            : dadosFormulario.nomeEstabelecimento.trim(),
        disponibilidade: dadosFormulario.disponibilidade.trim(),
        observacao: dadosFormulario.observacao.trim(),
      };

      const resultado = await atualizarDoador(idDoador, dadosAtualizados);

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

        <PerfilDoadorForm
          dadosIniciais={dados}
          onSubmit={salvar}
          loading={salvando}
          salvamentoDisponivel={idDoador !== null}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
