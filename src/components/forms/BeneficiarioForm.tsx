import { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import estilos, { cores } from "../../estilos/estilo";
import Input from "../Input";
import Botao from "../Botao";
import {
  CadastroBeneficiario,
  BeneficiarioErros,
  BeneficiarioTipo,
} from "../../types/Beneficiario";
import { buscarCep } from "../../services/ViaCepService";

type BeneficiarioFormProps = {
  onSubmit: (dados: CadastroBeneficiario) => void;
  loading?: boolean;
};

export default function BeneficiarioForm({
  onSubmit,
  loading = false,
}: BeneficiarioFormProps) {
  const [form, setForm] = useState<CadastroBeneficiario>({
    tipo: "beneficiario",
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
    tipoBeneficiario: "pessoaFisica",
    nomeOrganizacao: "",
    raioBuscaKm: 10,
  });

  const [erros, setErros] = useState<BeneficiarioErros>({});
  const [buscandoCep, setBuscandoCep] = useState(false);

  function setField(campo: keyof CadastroBeneficiario, valor: string) {
    setForm((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  function selecionarTipo(tipoBeneficiario: BeneficiarioTipo) {
    setForm((prev) => ({
      ...prev,
      tipoBeneficiario,
      nomeOrganizacao:
        tipoBeneficiario === "pessoaFisica" ? "" : prev.nomeOrganizacao,
    }));
  }

  function selecionarRaio(raioBuscaKm: 5 | 10 | 20) {
    setForm((prev) => ({
      ...prev,
      raioBuscaKm,
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
    const novosErros: BeneficiarioErros = {};

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

    if (form.tipoBeneficiario === "ONG" && !form.nomeOrganizacao?.trim()) {
      novosErros.nomeOrganizacao = "Informe o nome da ONG.";
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
    if (!validar()) {
      return;
    }

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
      nomeOrganizacao:
        form.tipoBeneficiario === "ONG"
          ? form.nomeOrganizacao?.trim()
          : undefined,
    });
  }

  
return (
  <View style={estilos.cadastroForm}>
    {/* DADOS PESSOAIS */}
    <View style={estilos.cadastroSecao}>
      <Text style={estilos.cadastroSecaoTitulo}>
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

      <Text style={estilos.cadastroCampoTitulo}>
        Tipo de beneficiário
      </Text>

      <View style={estilos.cadastroOpcoes}>
        <Pressable
          style={[
            estilos.cadastroOpcao,
            form.tipoBeneficiario === "pessoaFisica" &&
              estilos.cadastroOpcaoAtiva,
          ]}
          onPress={() => selecionarTipo("pessoaFisica")}
        >
          <Text
            style={[
              estilos.cadastroOpcaoTexto,
              form.tipoBeneficiario === "pessoaFisica" &&
                estilos.cadastroOpcaoTextoAtivo,
            ]}
          >
            Pessoa física
          </Text>
        </Pressable>

        <Pressable
          style={[
            estilos.cadastroOpcao,
            form.tipoBeneficiario === "ONG" &&
              estilos.cadastroOpcaoAtiva,
          ]}
          onPress={() => selecionarTipo("ONG")}
        >
          <Text
            style={[
              estilos.cadastroOpcaoTexto,
              form.tipoBeneficiario === "ONG" &&
                estilos.cadastroOpcaoTextoAtivo,
            ]}
          >
            ONG
          </Text>
        </Pressable>
      </View>

      {form.tipoBeneficiario === "ONG" && (
        <Input
          label="Nome da ONG"
          placeholder="Nome da organização"
          value={form.nomeOrganizacao || ""}
          onChangeText={(value) =>
            setField("nomeOrganizacao", value)
          }
          error={erros.nomeOrganizacao}
        />
      )}
    </View>

    {/* ENDEREÇO */}
    <View style={estilos.cadastroSecao}>
      <Text style={estilos.cadastroSecaoTitulo}>
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
        <Text style={estilos.cadastroAjuda}>
          Buscando endereço...
        </Text>
      )}

      <Input
        label="Rua"
        placeholder="Rua ou avenida"
        value={form.logradouro}
        onChangeText={(value) =>
          setField("logradouro", value)
        }
        error={erros.logradouro}
      />

      <View style={estilos.cadastroLinha}>
        <View style={estilos.cadastroCampoMenor}>
          <Input
            label="Número"
            placeholder="Número"
            value={form.numero}
            onChangeText={(value) =>
              setField("numero", value)
            }
            error={erros.numero}
          />
        </View>

        <View style={estilos.cadastroCampoMaior}>
          <Input
            label="Complemento"
            placeholder="Opcional"
            value={form.complemento}
            onChangeText={(value) =>
              setField("complemento", value)
            }
          />
        </View>
      </View>

      <Input
        label="Bairro"
        placeholder="Bairro"
        value={form.bairro}
        onChangeText={(value) => setField("bairro", value)}
        error={erros.bairro}
      />

      <View style={estilos.cadastroLinha}>
        <View style={estilos.cadastroCampoMaior}>
          <Input
            label="Cidade"
            placeholder="Cidade"
            value={form.cidade}
            onChangeText={(value) =>
              setField("cidade", value)
            }
            error={erros.cidade}
          />
        </View>

        <View style={estilos.cadastroCampoMenor}>
          <Input
            label="Estado"
            placeholder="UF"
            value={form.estado}
            onChangeText={(value) =>
              setField("estado", value)
            }
            autoCapitalize="characters"
            error={erros.estado}
          />
        </View>
      </View>
    </View>

    {/* PREFERÊNCIAS */}
    <View style={estilos.cadastroSecao}>
      <Text style={estilos.cadastroSecaoTitulo}>
        Preferências de busca
      </Text>

      <Text style={estilos.cadastroAjuda}>
        Escolha a distância máxima para encontrar solicitações
        próximas de você.
      </Text>

      <View style={estilos.cadastroOpcoes}>
        {([5, 10, 20] as const).map((raio) => (
          <Pressable
            key={raio}
            style={[
              estilos.cadastroOpcao,
              form.raioBuscaKm === raio &&
                estilos.cadastroOpcaoAtiva,
            ]}
            onPress={() => selecionarRaio(raio)}
          >
            <Text
              style={[
                estilos.cadastroOpcaoTexto,
                form.raioBuscaKm === raio &&
                  estilos.cadastroOpcaoTextoAtivo,
              ]}
            >
              {raio} km
            </Text>
          </Pressable>
        ))}
      </View>
    </View>

    {/* SEGURANÇA */}
    <View style={estilos.cadastroSecao}>
      <Text style={estilos.cadastroSecaoTitulo}>
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

      <Text style={estilos.cadastroAjuda}>
        Sua senha deve ter pelo menos 6 caracteres.
      </Text>
    </View>

    <Botao
      label="Criar conta"
      onPress={handleSubmit}
      loading={loading || buscandoCep}
    />
  </View>
);

}
