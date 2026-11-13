import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Input from "../Input";
import Botao from "../Botao";
import styles from "../../estilos/estilo";
import {
  BeneficiarioTipo,
  PerfilBeneficiarioFormData,
} from "../../types/Beneficiario";

type Props = {
  dadosIniciais: PerfilBeneficiarioFormData;
  onSubmit: (dados: PerfilBeneficiarioFormData) => void;
  loading?: boolean;
  salvamentoDisponivel?: boolean;
};

export default function PerfilBeneficiarioForm({
  dadosIniciais,
  onSubmit,
  loading = false,
  salvamentoDisponivel = false,
}: Props) {
  const [form, setForm] = useState(dadosIniciais);
  const [erros, setErros] = useState<
    Partial<Record<keyof PerfilBeneficiarioFormData, string>>
  >({});

  useEffect(() => {
    setForm(dadosIniciais);
  }, [dadosIniciais]);

  function atualizar(
    campo: keyof PerfilBeneficiarioFormData,
    valor: string | number | boolean | null,
  ) {
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

      if (!resposta.ok) throw new Error("Erro na consulta.");

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

    if (form.tipoBeneficiario === "ONG" && !form.nomeOrganizacao.trim()) {
      novosErros.nomeOrganizacao = "Informe o nome da organização.";
    }

    if (
      form.quantidadePessoasFamilia.trim() &&
      (!Number.isInteger(Number(form.quantidadePessoasFamilia)) ||
        Number(form.quantidadePessoasFamilia) < 1)
    ) {
      novosErros.quantidadePessoasFamilia = "Informe uma quantidade válida.";
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

      <Text style={styles.sectionTitle}>Informações do beneficiário</Text>

      <Text style={styles.inputLabel}>Tipo de beneficiário</Text>

      <View style={styles.toggle}>
        {(
          [
            ["pessoaFisica", "Pessoa física"],
            ["ONG", "ONG"],
          ] as [BeneficiarioTipo, string][]
        ).map(([tipo, titulo]) => (
          <Pressable
            key={tipo}
            style={[
              styles.toggleBtn,
              form.tipoBeneficiario === tipo && styles.toggleActive,
            ]}
            onPress={() => atualizar("tipoBeneficiario", tipo)}
          >
            <Text
              style={[
                styles.toggleText,
                form.tipoBeneficiario === tipo && styles.toggleTextActive,
              ]}
            >
              {titulo}
            </Text>
          </Pressable>
        ))}
      </View>

      {form.tipoBeneficiario === "ONG" && (
        <Input
          label="Nome da organização"
          value={form.nomeOrganizacao}
          onChangeText={(v) => atualizar("nomeOrganizacao", v)}
          error={erros.nomeOrganizacao}
        />
      )}

      <Text style={styles.inputLabel}>Raio de busca</Text>

      <View style={styles.toggle}>
        {([5, 10, 20] as const).map((raio) => (
          <Pressable
            key={raio}
            style={[
              styles.toggleBtn,
              form.raioBuscaKm === raio && styles.toggleActive,
            ]}
            onPress={() => atualizar("raioBuscaKm", raio)}
          >
            <Text
              style={[
                styles.toggleText,
                form.raioBuscaKm === raio && styles.toggleTextActive,
              ]}
            >
              {raio} km
            </Text>
          </Pressable>
        ))}
      </View>

      <Input
        label="Quantidade de pessoas na família"
        value={form.quantidadePessoasFamilia}
        onChangeText={(v) => atualizar("quantidadePessoasFamilia", v)}
        keyboardType="numeric"
        error={erros.quantidadePessoasFamilia}
      />

      <Text style={styles.inputLabel}>Possui crianças?</Text>

      <View style={styles.toggle}>
        {[
          { valor: true, titulo: "Sim" },
          { valor: false, titulo: "Não" },
          { valor: null, titulo: "Não informar" },
        ].map((opcao) => (
          <Pressable
            key={String(opcao.valor)}
            style={[
              styles.toggleBtn,
              form.possuiCriancas === opcao.valor && styles.toggleActive,
            ]}
            onPress={() => atualizar("possuiCriancas", opcao.valor)}
          >
            <Text
              style={[
                styles.toggleText,
                form.possuiCriancas === opcao.valor && styles.toggleTextActive,
              ]}
            >
              {opcao.titulo}
            </Text>
          </Pressable>
        ))}
      </View>

      <Input
        label="Restrições alimentares"
        value={form.restricaoAlimentar}
        onChangeText={(v) => atualizar("restricaoAlimentar", v)}
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
