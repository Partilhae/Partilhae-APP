import { useState } from "react";
import { Text, TextInput, TextInputProps, Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import estilos, { cores } from "../estilos/estilo";

type InputProps = TextInputProps & {
  label: string;
  error?: string;
  isSenha?: boolean;
};

export default function Input({
  label,
  error,
  isSenha = false,
  onFocus,
  onBlur,
  style,
  ...rest
}: InputProps) {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [focado, setFocado] = useState(false);

  return (
    <View style={estilos.wrapper}>
      <Text style={estilos.inputLabel}>{label}</Text>

      <View style={estilos.inputRow}>
        <TextInput
          {...rest}
          style={[
            estilos.input,
            focado && {
              borderColor: cores.yellow,
              borderWidth: 1.5,
            },
            error ? estilos.inputError : null,
            style,
          ]}
          placeholderTextColor={cores.placeholder}
          secureTextEntry={isSenha && !mostrarSenha}
          onFocus={(event) => {
            setFocado(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocado(false);
            onBlur?.(event);
          }}
        />

        {isSenha && (
          <Pressable
            style={estilos.eyeBtn}
            onPress={() => setMostrarSenha(!mostrarSenha)}
            accessibilityRole="button"
            accessibilityLabel={
              mostrarSenha ? "Ocultar senha" : "Mostrar senha"
            }
          >
            <Ionicons
              name={mostrarSenha ? "eye-off-outline" : "eye-outline"}
              size={22}
              color={cores.primary}
            />
          </Pressable>
        )}
      </View>

      {error ? <Text style={estilos.errorText}>{error}</Text> : null}
    </View>
  );
}
