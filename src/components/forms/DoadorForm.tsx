import { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import estilos, { cores } from "../../estilos/estilo";
import Input from "../Input";
import Botao from "../Botao";
import { CadastroDoador, DoadorErros, DoadorTipo } from "../../types/Doador";
import { buscarCep } from "../../services/ViaCepService";

type DoadorFormProps = {
  onSubmit: (dados: CadastroDoador) => void;
  loading?: boolean;
};

export default function DoadorForm({
  onSubmit,
  loading = false,
}: DoadorFormProps) {
  const [form, setForm] = useState<CadastroDoador>({
    tipo: "doador",
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    senha: "",
    tipoDoador: "pessoaFisica",
    nomeEstabelecimento: "",
  });

  const [erros, setErros] = useState<DoadorErros>({});
  const [buscandoCep, setBuscandoCep] = useState(false);

  function setField(campo: keyof CadastroDoador, valor: string) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  function selecionarTipo(tipoDoador: DoadorTipo) {
    setForm((prev) => ({
      ...prev,
      tipoDoador,
      nomeEstabelecimento:
        tipoDoador === "pessoaFisica" ? "" : prev.nomeEstabelecimento,
    }));
  }

  async function consultarCep(cep: string) {
    const cepLimpo = cep.replace(/\D/g, "");

    setField("cep", cep);

    if (cepLimpo.length !== 8) {
      return;
    }

    try {
      setBuscandoCep(true);

      const endereco = await buscarCep(cepLimpo);

      setForm((prev) => ({
        ...prev,
        logradouro: endereco.logradouro,
        bairro: endereco.bairro,
        cidade: endereco.cidade,
        estado: endereco.estado,
      }));
    } catch (error) {
      Alert.alert(
        "Erro ao buscar CEP",
        error instanceof Error
          ? error.message
          : "Não foi possível consultar o CEP.",
      );
    } finally {
      setBuscandoCep(false);
    }
  }

  function validar() {
    const novosErros: DoadorErros = {};

    if (!form.nome.trim()) {
      novosErros.nome = "Nome é obrigatório.";
    }

    if (!form.email.trim()) {
      novosErros.email = "E-mail é obrigatório.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      novosErros.email = "Informe um e-mail válido.";
    }

    if (form.cpf.replace(/\D/g, "").length !== 11) {
      novosErros.cpf = "CPF deve possuir 11 números.";
    }

    const telefone = form.telefone.replace(/\D/g, "");
    if (telefone.length < 10 || telefone.length > 11) {
      novosErros.telefone = "Informe um telefone válido.";
    }

    if (form.cep.replace(/\D/g, "").length !== 8) {
      novosErros.cep = "CEP deve possuir 8 números.";
    }

    if (!form.logradouro.trim()) {
      novosErros.logradouro = "Informe a rua.";
    }

    if (!form.numero.trim()) {
      novosErros.numero = "Informe o número.";
    }

    if (!form.bairro.trim()) {
      novosErros.bairro = "Informe o bairro.";
    }

    if (!form.cidade.trim()) {
      novosErros.cidade = "Informe a cidade.";
    }

    if (!/^[A-Za-z]{2}$/.test(form.estado.trim())) {
      novosErros.estado = "Informe a UF com 2 letras.";
    }

    if (
      form.tipoDoador !== "pessoaFisica" &&
      !form.nomeEstabelecimento?.trim()
    ) {
      novosErros.nomeEstabelecimento =
        "Informe o nome do estabelecimento ou projeto.";
    }

    if (!form.senha) {
      novosErros.senha = "Senha é obrigatória.";
    } else if (form.senha.length < 6) {
      novosErros.senha = "A senha deve ter no mínimo 6 caracteres.";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  function handleSubmit() {
    if (loading || buscandoCep) return;
    if (!validar()) return;

    onSubmit({
      ...form,
      nome: form.nome.trim(),
      email: form.email.trim().toLowerCase(),
      cpf: form.cpf.replace(/\D/g, ""),
      telefone: form.telefone.replace(/\D/g, ""),
      cep: form.cep.replace(/\D/g, ""),
      logradouro: form.logradouro.trim(),
      numero: form.numero.trim(),
      complemento: form.complemento.trim(),
      bairro: form.bairro.trim(),
      cidade: form.cidade.trim(),
      estado: form.estado.trim().toUpperCase(),
      nomeEstabelecimento:
        form.tipoDoador === "pessoaFisica"
          ? undefined
          : form.nomeEstabelecimento?.trim(),
    });
  }

  return (
    <View style={estilos.form}>
      <Text style={estilos.sectionTitle}>
        Dados pessoais
      </Text>

      <Input
        label="Nome completo"
        placeholder="Seu nome completo"
        value={form.nome}
        onChangeText={(value) => setField("nome", value)}
        error={erros.nome}
      />

      <Input
        label="E-mail"
        placeholder="seu@email.com"
        value={form.email}
        onChangeText={(value) => setField("email", value)}
        keyboardType="email-address"
        autoCapitalize="none"
        error={erros.email}
      />

      <Input
        label="CPF"
        placeholder="000.000.000-00"
        value={form.cpf}
        onChangeText={(value) => setField("cpf", value)}
        keyboardType="numeric"
        error={erros.cpf}
      />

      <Input
        label="Telefone"
        placeholder="(11) 99999-9999"
        value={form.telefone}
        onChangeText={(value) => setField("telefone", value)}
        keyboardType="phone-pad"
        error={erros.telefone}
      />

      <Text style={estilos.sectionTitle}>
        Tipo de doador
      </Text>

      <View style={estilos.toggle}>
        {(
          [
            ["pessoaFisica", "Pessoa física"],
            ["estabelecimento", "Estabelecimento"],
            ["projetoSocial", "Projeto social"],
          ] as const
        ).map(([tipo, label]) => (
          <Pressable
            key={tipo}
            style={({ pressed }) => [
              estilos.toggleBtn,
              form.tipoDoador === tipo && estilos.toggleActive,
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => selecionarTipo(tipo)}
          >
            <Text
              style={[
                estilos.toggleText,
                form.tipoDoador === tipo && estilos.toggleTextActive,
              ]}
            >
              {label}
            </Text>
          </Pressable>
        ))}
      </View>

      {form.tipoDoador !== "pessoaFisica" && (
        <Input
          label={
            form.tipoDoador === "estabelecimento"
              ? "Nome do estabelecimento"
              : "Nome do projeto social"
          }
          placeholder="Digite o nome"
          value={form.nomeEstabelecimento || ""}
          onChangeText={(value) => setField("nomeEstabelecimento", value)}
          error={erros.nomeEstabelecimento}
        />
      )}

      <Text style={estilos.sectionTitle}>
        Endereço
      </Text>

      <Input
        label="CEP"
        placeholder="00000-000"
        value={form.cep}
        onChangeText={consultarCep}
        keyboardType="numeric"
        error={erros.cep}
      />

      {buscandoCep && (
        <Text style={{ color: cores.textSecondary }}>Buscando endereço...</Text>
      )}

      <Input
        label="Rua"
        placeholder="Rua ou avenida"
        value={form.logradouro}
        onChangeText={(value) => setField("logradouro", value)}
        error={erros.logradouro}
      />

      <Input
        label="Número"
        placeholder="Número"
        value={form.numero}
        onChangeText={(value) => setField("numero", value)}
        error={erros.numero}
      />

      <Input
        label="Complemento"
        placeholder="Opcional"
        value={form.complemento}
        onChangeText={(value) => setField("complemento", value)}
      />

      <Input
        label="Bairro"
        placeholder="Bairro"
        value={form.bairro}
        onChangeText={(value) => setField("bairro", value)}
        error={erros.bairro}
      />

      <Input
        label="Cidade"
        placeholder="Cidade"
        value={form.cidade}
        onChangeText={(value) => setField("cidade", value)}
        error={erros.cidade}
      />

      <Input
        label="Estado"
        placeholder="UF"
        value={form.estado}
        onChangeText={(value) => setField("estado", value)}
        autoCapitalize="characters"
        error={erros.estado}
      />

      <Text style={estilos.sectionTitle}>
        Segurança
      </Text>

      <Input
        label="Senha"
        placeholder="Crie uma senha"
        value={form.senha}
        onChangeText={(value) => setField("senha", value)}
        isSenha
        error={erros.senha}
      />

      <Botao label="Criar conta" onPress={handleSubmit} loading={loading || buscandoCep} />
    </View>
  );
}
