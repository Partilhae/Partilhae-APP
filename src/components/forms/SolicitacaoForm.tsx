import { useState } from "react";
import {
  ItemSolicitacao,
  NovaSolicitacao,
  TipoAjuda,
} from "../../types/Solicitacao";
import { Alert, Pressable, Text, View } from "react-native";
import estilos from "../../estilos/estilo";
import Input from "../Input";
import Botao from "../Botao";

type SolicitacaoFormProps = {
  onSubmit: (dados: NovaSolicitacao) => void;
  loading?: boolean;
  dadosIniciais?: NovaSolicitacao;
};

export default function SolicitacaoForm({
  onSubmit,
  loading = false,
  dadosIniciais,
}: SolicitacaoFormProps) {
  const [titulo, setTitulo] = useState(
    dadosIniciais?.titulo ?? "",
  );

  const [descricao, setDescricao] = useState(
    dadosIniciais?.descricao ?? "",
  );

  const [tipoAjuda, setTipoAjuda] = useState<TipoAjuda>(
    dadosIniciais?.tipoAjuda ?? "geral",
  );

  const [itens, setItens] = useState<ItemSolicitacao[]>(
    dadosIniciais?.itens ?? [],
  );

  const [nomeItem, setNomeItem] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [unidade, setUnidade] = useState("");

  const [erros, setErros] = useState({
    titulo: "",
    descricao: "",
  });


  function selecionarTipo(tipo: TipoAjuda) {
    setTipoAjuda(tipo);
  }

  function adicionarItem() {
    if (!nomeItem.trim()) {
      Alert.alert("Atenção", "Informe o nome do alimento.");
      return;
    }
    const qtd = Number(quantidade.replace(",", "."));

    if (!Number.isFinite(qtd) || qtd <= 0) {
      Alert.alert("Atenção", "Informe uma quantidade válida.");
      return;
    }
    if (!unidade.trim()) {
      Alert.alert("Atenção", "Informe a unidade de medida.");
      return;
    }

    const novoItem: ItemSolicitacao = {
      id: `${Date.now()}-${Math.random()}`,
      nome: nomeItem.trim(),
      quantidade: qtd,
      unidade: unidade.trim(),
    };

    setItens((anteriores) => [...anteriores, novoItem]);

    setNomeItem("");
    setQuantidade("");
    setUnidade("");
  }

  function removerItem(id: string) {
    setItens((anteriores) => anteriores.filter((item) => item.id !== id));
  }

  function validar() {
    const novosErros = {
      titulo: "",
      descricao: "",
    };

    if (!titulo.trim()) {
      novosErros.titulo = "Informe o título da solicitação.";
    }
    if (!descricao.trim()) {
      novosErros.descricao = "Descreva a sua necessidade.";
    }

    setErros(novosErros);

    if (novosErros.titulo || novosErros.descricao) {
      return false;
    }

    if (tipoAjuda === "especifico" && itens.length === 0) {
      Alert.alert(
        "Atenção",
        "Adicione pelo menos um alimento à sua solicitação.",
      );
      return false;
    }

    return true;
  }

  function handleSubmit() {
    if (loading || !validar()) return;

    onSubmit({
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      tipoAjuda,
      itens: tipoAjuda === "especifico" ? itens : [],
    });
  }

  return (
    <View style={estilos.cadastroForm}>
      <View style={estilos.cadastroSecao}>
        <Text style={estilos.cadastroSecaoTitulo}>Sobre a solicitação</Text>

        <Input
          label="Título"
          placeholder="Ex.: Preciso de alimentos básicos"
          value={titulo}
          onChangeText={setTitulo}
          error={erros.titulo}
        />
        <Input
          label="Descrição"
          placeholder="Conte um pouco sobre a sua necessidade"
          value={descricao}
          onChangeText={setDescricao}
          error={erros.descricao}
        />
      </View>
      <View style={estilos.cadastroSecao}>
        <Text style={estilos.cadastroSecaoTitulo}>Tipo de ajuda</Text>
        <Text style={estilos.cadastroAjuda}>
          Escolha como deseja receber ajuda.
        </Text>

        <View style={estilos.cadastroOpcoes}>
          {(
            [
              ["geral", "Ajuda geral"],
              ["especifico", "Ajuda específica"],
            ] as const
          ).map(([tipo, label]) => (
            <Pressable
              key={tipo}
              style={[
                estilos.cadastroOpcao,
                tipoAjuda === tipo && estilos.cadastroOpcaoAtiva,
              ]}
              onPress={() => selecionarTipo(tipo)}
            >
              <Text
                style={[
                  estilos.cadastroOpcaoTexto,
                  tipoAjuda === tipo && estilos.cadastroOpcaoTextoAtivo,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {tipoAjuda === "especifico" && (
        <View style={estilos.cadastroSecao}>
          <Text style={estilos.cadastroSecaoTitulo}>Alimentos necessários</Text>
          <Text style={estilos.cadastroAjuda}>
            Adicione os alimentos que você precisa.
          </Text>
          <Input
            label="Nome do alimento"
            placeholder="Ex.: Arroz"
            value={nomeItem}
            onChangeText={setNomeItem}
          />

          <View style={estilos.cadastroLinha}>
            <View style={estilos.cadastroCampoMenor}>
              <Input
                label="Quantidade"
                placeholder="Ex.: 5"
                value={quantidade}
                onChangeText={setQuantidade}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={estilos.cadastroCampoMaior}>
              <Input
                label="Unidade"
                placeholder="Ex.: kg, pacote, litro"
                value={unidade}
                onChangeText={setUnidade}
              />
            </View>
            <Pressable
              style={estilos.solicitacaoAdicionar}
              onPress={adicionarItem}
            >
              <Text style={estilos.solicitacaoAdicionarTexto}>
                + Adicionar alimento
              </Text>
            </Pressable>
          </View>
          {itens.length > 0 && (
            <View style={estilos.solicitacaoLista}>
              <Text style={estilos.cadastroCampoTitulo}>
                Alimentos adicionados ({itens.length})
              </Text>

              {itens.map((item) => (
                <View key={item.id} style={estilos.solicitacaoItem}>
                  <View style={{ flex: 1 }}>
                    <Text style={estilos.solicitacaoItemNome}>{item.nome}</Text>

                    <Text style={estilos.solicitacaoItemQuantidade}>
                      {item.quantidade} {item.unidade}
                    </Text>
                  </View>

                  <Pressable
                    onPress={() => removerItem(item.id)}
                    style={estilos.solicitacaoRemover}
                  >
                    <Text style={estilos.solicitacaoRemoverTexto}>Remover</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      <Botao
        label={
          dadosIniciais
          ? "Salvar alterações" 
          : "Publicar solicitação"
        }
        onPress={handleSubmit}
        loading={loading}
      />
    </View>
  );
}
