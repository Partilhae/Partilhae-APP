import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Input from "../Input";
import Botao from "../Botao";
import styles from "../../estilos/estilo";
import { DoadorTipo, PerfilDoadorFormData } from "../../types/Doador";

type Props = {
  dadosIniciais: PerfilDoadorFormData;
  onSubmit: (dados: PerfilDoadorFormData) => void;
  loading?: boolean;
  salvamentoDisponivel?: boolean;
};

export default function PerfilDoadorForm({
  dadosIniciais,
  onSubmit,
  loading = false,
  salvamentoDisponivel = false,
}: Props) {
  const [form, setForm] = useState(dadosIniciais);
  const [erros, setErros] = useState<
    Partial<Record<keyof PerfilDoadorFormData, string>>
  >({});

  useEffect(() => {
    setForm(dadosIniciais);
  }, [dadosIniciais]);

  function atualizar(campo: keyof PerfilDoadorFormData, valor: string) {
    setForm((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));

    setErros((anterior) => ({
      ...anterior,
      [campo]: undefined,
    }));
  }

  async function buscarCep() {
    const cep = form.cep.replace(/\D/g, "");

    if (cep.length !== 8) return;

    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

      if (!resposta.ok) {
        throw new Error("Erro na consulta.");
      }

      const endereco = await resposta.json();

      if (endereco.erro) {
        setErros((anterior) => ({
          ...anterior,
          cep: "CEP não encontrado.",
        }));
        return;
      }

      setForm((anterior) => ({
        ...anterior,
        endereco: endereco.logradouro || anterior.endereco,
        bairro: endereco.bairro || anterior.bairro,
        cidade: endereco.localidade || anterior.cidade,
        estado: endereco.uf || anterior.estado,
      }));
    } catch {
      setErros((anterior) => ({
        ...anterior,
        cep: "Não foi possível consultar o CEP.",
      }));
    }
  }

  function validar() {
    const novosErros: typeof erros = {};

    if (!form.nomeUsuario.trim()) novosErros.nomeUsuario = "Informe seu nome.";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      novosErros.email = "Informe um e-mail válido.";

    if (form.telefone.replace(/\D/g, "").length < 10)
      novosErros.telefone = "Informe um telefone válido.";

    if (form.cep.replace(/\D/g, "").length !== 8)
      novosErros.cep = "Informe um CEP válido.";

    if (!form.endereco.trim()) novosErros.endereco = "Informe o endereço.";

    if (!form.numero.trim()) novosErros.numero = "Informe o número.";

    if (!form.bairro.trim()) novosErros.bairro = "Informe o bairro.";

    if (!form.cidade.trim()) novosErros.cidade = "Informe a cidade.";

    if (!form.estado.trim()) novosErros.estado = "Informe o estado.";

    if (
      form.tipoDoador !== "pessoaFisica" &&
      !form.nomeEstabelecimento.trim()
    ) {
      novosErros.nomeEstabelecimento =
        "Informe o nome do estabelecimento ou projeto.";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  function enviar() {
    if (!salvamentoDisponivel || loading) return;
    if (validar()) onSubmit(form);
  }

  return (
    <View style={styles.form}>
      <Text style={styles.sectionTitle}>Dados pessoais</Text>

      <Input
        label="Nome"
        value={form.nomeUsuario}
        onChangeText={(v) => atualizar("nomeUsuario", v)}
        error={erros.nomeUsuario}
      />

      <Input
        label="E-mail"
        value={form.email}
        onChangeText={(v) => atualizar("email", v)}
        keyboardType="email-address"
        autoCapitalize="none"
        error={erros.email}
      />

      <Input
        label="Telefone"
        value={form.telefone}
        onChangeText={(v) => atualizar("telefone", v)}
        keyboardType="phone-pad"
        error={erros.telefone}
      />

      <Text style={styles.sectionTitle}>Endereço</Text>

      <Input
        label="CEP"
        value={form.cep}
        onChangeText={(v) => atualizar("cep", v)}
        onBlur={buscarCep}
        keyboardType="numeric"
        error={erros.cep}
      />

      <Input
        label="Logradouro"
        value={form.endereco}
        onChangeText={(v) => atualizar("endereco", v)}
        error={erros.endereco}
      />

      <Input
        label="Número"
        value={form.numero}
        onChangeText={(v) => atualizar("numero", v)}
        error={erros.numero}
      />

      <Input
        label="Bairro"
        value={form.bairro}
        onChangeText={(v) => atualizar("bairro", v)}
        error={erros.bairro}
      />

      <Input
        label="Cidade"
        value={form.cidade}
        onChangeText={(v) => atualizar("cidade", v)}
        error={erros.cidade}
      />

      <Input
        label="Estado"
        value={form.estado}
        onChangeText={(v) => atualizar("estado", v)}
        error={erros.estado}
      />

      <Text style={styles.sectionTitle}>Informações do doador</Text>

      <Text style={styles.inputLabel}>Tipo de doador</Text>

      <View style={styles.toggle}>
        {(
          [
            ["pessoaFisica", "Pessoa física"],
            ["estabelecimento", "Estabelecimento"],
            ["projetoSocial", "Projeto social"],
          ] as [DoadorTipo, string][]
        ).map(([tipo, titulo]) => (
          <Pressable
            key={tipo}
            style={[
              styles.toggleBtn,
              form.tipoDoador === tipo && styles.toggleActive,
            ]}
            onPress={() => atualizar("tipoDoador", tipo)}
          >
            <Text
              style={[
                styles.toggleText,
                form.tipoDoador === tipo && styles.toggleTextActive,
              ]}
            >
              {titulo}
            </Text>
          </Pressable>
        ))}
      </View>

      {form.tipoDoador !== "pessoaFisica" && (
        <Input
          label="Nome do estabelecimento ou projeto"
          value={form.nomeEstabelecimento}
          onChangeText={(v) => atualizar("nomeEstabelecimento", v)}
          error={erros.nomeEstabelecimento}
        />
      )}

      <Input
        label="Disponibilidade"
        value={form.disponibilidade}
        onChangeText={(v) => atualizar("disponibilidade", v)}
      />

      <Input
        label="Observações"
        value={form.observacao}
        onChangeText={(v) => atualizar("observacao", v)}
      />

      {!salvamentoDisponivel && (
        <Text style={styles.disabledText}>
          O salvamento estará disponível após a integração com a API Java.
        </Text>
      )}

      {salvamentoDisponivel && (
        <Botao label="Salvar alterações" onPress={enviar} loading={loading} />
      )}
    </View>
  );
}
