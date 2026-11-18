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
  const [titulo, setTitulo] = useState(dadosIniciais?.titulo ?? "");

  const [descricao, setDescricao] = useState(dadosIniciais?.descricao ?? "");

  const [tipoAjuda, setTipoAjuda] = useState<TipoAjuda>(
    dadosIniciais?.tipoAjuda ?? "geral",
  );

  const [estado, setEstado] = useState(dadosIniciais?.estado ?? "");
  const [cidade, setCidade] = useState(dadosIniciais?.cidade ?? "");
  const [bairro, setBairro] = useState(dadosIniciais?.bairro ?? "");

  const [itens, setItens] = useState<ItemSolicitacao[]>(
    dadosIniciais?.itens ?? [],
  );

  const [nomeItem, setNomeItem] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [unidade, setUnidade] = useState("");

  const [erros, setErros] = useState({
    titulo: "",
    descricao: "",
    estado: "",
    cidade: "",
    bairro: "",
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
      estado: "",
      cidade: "",
      bairro: "",
    };

    if (!titulo.trim()) {
      novosErros.titulo = "Informe o título da solicitação.";
    }
    if (!descricao.trim()) {
      novosErros.descricao = "Descreva a sua necessidade.";
    }
    if (!estado.trim()) {
      novosErros.estado = "Informe o estado.";
    } else if (!/^[a-zA-Z]{2}$/.test(estado.trim())) {
      novosErros.estado = "Informe a sigla do estado com 2 letras.";
    }

    if (!cidade.trim()) {
      novosErros.cidade = "Informe a cidade.";
    }

    if (!bairro.trim()) {
      novosErros.bairro = "Informe o bairro.";
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
      estado: estado.trim().toUpperCase(),
      cidade: cidade.trim(),
      bairro: bairro.trim(),
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
        <Text style={estilos.cadastroSecaoTitulo}>Região da solicitação</Text>

        <Text style={estilos.cadastroAjuda}>
          Informe a região onde você precisa receber ajuda. Não é necessário
          compartilhar seu endereço completo.
        </Text>

        <Input
          label="Estado (UF)"
          placeholder="Ex.: SP"
          value={estado}
          onChangeText={setEstado}
          error={erros.estado}
          autoCapitalize="characters"
          maxLength={2}
        />

        <Input
          label="Cidade"
          placeholder="Ex.: São Paulo"
          value={cidade}
          onChangeText={setCidade}
          error={erros.cidade}
        />

        <Input
          label="Bairro"
          placeholder="Ex.: Bela Vista"
          value={bairro}
          onChangeText={setBairro}
          error={erros.bairro}
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

        <Text style={estilos.cadastroAjuda}>
          {tipoAjuda === "geral"
            ? "Para pedidos de alimentos variados, sem uma lista definida."
            : "Para pedidos com alimentos e quantidades específicas."}
        </Text>
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
          </View>
          <Pressable
            style={estilos.solicitacaoAdicionar}
            onPress={adicionarItem}
          >
            <Text style={estilos.solicitacaoAdicionarTexto}>
              + Adicionar alimento
            </Text>
          </Pressable>
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
        label={dadosIniciais ? "Salvar alterações" : "Publicar solicitação"}
        onPress={handleSubmit}
        loading={loading}
      />
    </View>
  );
}
