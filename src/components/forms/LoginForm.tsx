import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import estilos from "../../estilos/estilo";
import Input from "../Input";
import Botao from "../Botao";
import { LoginErros, LoginFormData, UserTipo } from "../../types/Auth";

type LoginFormProps = {
  onSubmit: (dados: LoginFormData) => void;
  loading?: boolean;
};

export default function LoginForm({
  onSubmit,
  loading = false,
}: LoginFormProps) {
  const [form, setForm] = useState<LoginFormData>({
    tipo: "beneficiario",
    email: "",
    senha: "",
  });

  const [erros, setErros] = useState<LoginErros>({});

  function setField(campo: keyof LoginFormData, valor: string) {
    setForm((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  function selecionarTipo(tipo: UserTipo) {
    setForm((prev) => ({
      ...prev,
      tipo,
    }));
  }

  function validar() {
    const novosErros: LoginErros = {};

    if (!form.email.trim()) {
      novosErros.email = "Informe seu e-mail.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      novosErros.email = "Informe um e-mail válido.";
    }

    if (!form.senha.trim()) {
      novosErros.senha = "Informe sua senha.";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  function handleSubmit() {
    if (!validar()) {
      return;
    }

    onSubmit({
      ...form,
      email: form.email.trim().toLowerCase(),
    });
  }

  return (
    <View style={estilos.form}>
      <View style={estilos.toggle}>
        <Pressable
          style={({ pressed }) => [
            estilos.toggleBtn,
            form.tipo === "beneficiario" && estilos.toggleActive,
            pressed && { opacity: 0.8 },
          ]}
          onPress={() => selecionarTipo("beneficiario")}
        >
          <Text
            style={[
              estilos.toggleText,
              form.tipo === "beneficiario" && estilos.toggleTextActive,
            ]}
          >
            Beneficiário
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            estilos.toggleBtn,
            form.tipo === "doador" && estilos.toggleActive,
            pressed && { opacity: 0.8 },
          ]}
          onPress={() => selecionarTipo("doador")}
        >
          <Text
            style={[
              estilos.toggleText,
              form.tipo === "doador" && estilos.toggleTextActive,
            ]}
          >
            Doador
          </Text>
        </Pressable>
      </View>

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
        label="Senha"
        placeholder="Digite sua senha"
        value={form.senha}
        onChangeText={(value) => setField("senha", value)}
        isSenha
        error={erros.senha}
      />

      <Botao label="Entrar" onPress={handleSubmit} loading={loading} />
    </View>
  );
}
