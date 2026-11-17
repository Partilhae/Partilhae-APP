import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import estilos, { cores } from "../../estilos/estilo";
import { buscarUsuarioLogado } from "../../services/AuthService";
import { listarMinhasDenuncias } from "../../services/DenunciasService";
import { DenunciaResponse } from "../../types/Denuncia";
import Botao from "../../components/Botao";

export default function MinhasDenunciasScreen() {
  const [denuncias, setDenuncias] = useState<DenunciaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);
  const [tentativa, setTentativa] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      async function carregarDenuncias() {
        setLoading(true);
        setErro(false);
        setDenuncias([]);

        try {
          const usuario = await buscarUsuarioLogado();

          if (!usuario) {
            throw new Error("Usuário não autenticado.");
          }

          const dados = await listarMinhasDenuncias(usuario.idUsuario);

          if (ativo) {
            setDenuncias(dados);
          }
        } catch (error) {
          console.log("Erro ao carregar denúncias:", error);

          if (ativo) {
            setErro(true);
          }
        } finally {
          if (ativo) {
            setLoading(false);
          }
        }
      }

      carregarDenuncias();

      return () => {
        ativo = false;
      };
    }, [tentativa]),
  );

  function renderizarDenuncia({ item }: { item: DenunciaResponse }) {
    return (
      <View style={estilos.card}>
        <Text style={estilos.itemTitle}>Denúncia #{item.idDenuncia}</Text>

        <Text style={estilos.itemSubtitle}>
          Registrada em:{" "}
          {new Date(item.dataDenuncia).toLocaleDateString("pt-BR")}
        </Text>

        <View style={estilos.separator} />

        <Text style={estilos.itemTitle}>Motivo</Text>
        <Text style={estilos.cardDescription}>{item.motivo}</Text>

        <Text style={estilos.itemTitle}>Status</Text>
        <Text style={estilos.cardDescription}>{item.status}</Text>

        {item.resolucao ? (
          <>
            <Text style={estilos.itemTitle}>Resolução</Text>
            <Text style={estilos.cardDescription}>{item.resolucao}</Text>
          </>
        ) : null}
      </View>
    );
  }

  if (loading) {
    return (
      <View style={estilos.loading}>
        <ActivityIndicator size="large" color={cores.primary} />
      </View>
    );
  }

  if (erro) {
    return (
      <View style={estilos.emptyState}>
        <Text style={estilos.emptyTitle}>
          Não foi possível carregar suas denúncias
        </Text>

        <Text style={estilos.emptyText}>
          Verifique sua conexão e tente novamente.
        </Text>

        <Botao
          label="Tentar novamente"
          onPress={() => setTentativa((atual) => atual + 1)}
        />
      </View>
    );
  }

  return (
    <View style={[estilos.safe, { flex: 1 }]}>
      <View style={estilos.header}>
        <Text style={estilos.pageTitle}>Minhas denúncias</Text>

        <Text style={estilos.pageSubtitle}>
          Acompanhe as denúncias que você registrou.
        </Text>
      </View>

      <FlatList
        data={[...denuncias].sort(
          (a, b) =>
            new Date(b.dataDenuncia).getTime() -
            new Date(a.dataDenuncia).getTime(),
        )}
        keyExtractor={(item) => item.idDenuncia.toString()}
        renderItem={renderizarDenuncia}
        contentContainerStyle={[estilos.pageContent, { flexGrow: 1 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={estilos.emptyState}>
            <Text style={estilos.emptyTitle}>Nenhuma denúncia encontrada</Text>

            <Text style={estilos.emptyText}>
              Você ainda não registrou nenhuma denúncia.
            </Text>
          </View>
        }
      />
    </View>
  );
}
