import React, { useState } from "react";
import { Text, TextInput, TextInputProps, Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type InputProps = TextInputProps & {
  label: string;
  error?: string;
  isSenha?: boolean;
};

const Input: React.FC<InputProps> = ({
  label,
  error,
  isSenha = false,
  ...rest
}) => {
  const [mostrarSenha, setMostrarSenha] = useState(false);

  return (
    <View>
      <Text>{label}</Text>
      <View>
        <TextInput secureTextEntry={isSenha && !mostrarSenha} {...rest} />
        {isSenha && (
          <Pressable
            onPress={() => setMostrarSenha((valorAtual) => !valorAtual)}
            accessibilityLabel={
              mostrarSenha ? "Ocultar senha" : "Mostrar senha"
            }
          >
            <Ionicons
              name={mostrarSenha ? "eye-off-outline" : "eye-outline"}
              size={22}
            />
          </Pressable>
        )}
      </View>

      {error ? <Text>{error}</Text> : null}
    </View>
  );
};

export default Input;
