import React from "react";
import { ActivityIndicator, Pressable, Text, ViewStyle } from "react-native";
import styles, { cores } from "../estilos/estilo";

type BotaoProps = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  variant?: "primary" | "outline";
  style?: ViewStyle;
};

const Botao: React.FC<BotaoProps> = ({
  label,
  onPress,
  loading = false,
  variant = "primary",
  style,
}) => {
  const isPrimary = variant === "primary";

  return (
    <Pressable
      style={({ pressed }) => [
        styles.botao,
        !isPrimary && {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: cores.primaria,
        },
        style,
        pressed && !loading && { opacity: 0.85 },
      ]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? cores.branco : cores.primaria} />
      ) : (
        <Text
          style={[styles.botaoTexto, !isPrimary && { color: cores.primaria }]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
};

export default Botao;
