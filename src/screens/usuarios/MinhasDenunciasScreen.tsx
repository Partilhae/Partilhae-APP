import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import estilos, { cores } from "../../estilos/estilo";
import { buscarUsuarioLogado } from "../../services/AuthService";
import { listarMinhasDenuncias } from "../../services/DenunciasService";
import { DenunciaResponse } from "../../types/Denuncia";
import Botao from "../../components/Botao";

export default function MinhasDenunciasScreen() {
  const navigation = useNavigation();

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

          if (ativo) setErro(true);
        } finally {
          if (ativo) setLoading(false);
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Text style={[estilos.cardTitle, { flex: 1 }]}>
            Denúncia #{item.idDenuncia}
          </Text>

          <View
            style={{
              backgroundColor: cores.primarySoft,
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                color: cores.primary,
                fontSize: 12,
                fontWeight: "600",
              }}
            >
              {item.status}
            </Text>
          </View>
        </View>

        <Text style={estilos.itemSubtitle}>
          Registrada em{" "}
          {new Date(item.dataDenuncia).toLocaleDateString("pt-BR")}
        </Text>

        <View style={estilos.separator} />

        <View style={{ gap: 5 }}>
          <Text style={estilos.itemTitle}>Motivo</Text>

          <Text style={estilos.cardDescription}>{item.motivo}</Text>
        </View>

        {item.resolucao ? (
          <View style={{ gap: 5 }}>
            <View style={estilos.separator} />

            <Text style={estilos.itemTitle}>Resolução</Text>

            <Text style={estilos.cardDescription}>{item.resolucao}</Text>
          </View>
        ) : null}
      </View>
    );
  }

  return (
    <SafeAreaView style={estilos.safe} edges={["top", "bottom"]}>
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
        ListHeaderComponent={
          <View style={{ gap: 16, marginBottom: 8 }}>
            <Pressable onPress={() => navigation.goBack()}>
              <Text style={estilos.solicitacaoVoltar}>← Voltar</Text>
            </Pressable>

            <View style={estilos.cadastroHeader}>
              <Text style={estilos.cadastroTitulo}>Minhas denúncias</Text>

              <Text style={estilos.cadastroSubtitulo}>
                Acompanhe o andamento das denúncias que você registrou.
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <View style={estilos.emptyState}>
              <ActivityIndicator size="large" color={cores.primary} />
            </View>
          ) : erro ? (
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
          ) : (
            <View style={estilos.emptyState}>
              <Text style={estilos.emptyTitle}>
                Nenhuma denúncia encontrada
              </Text>

              <Text style={estilos.emptyText}>
                Você ainda não registrou nenhuma denúncia.
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}
