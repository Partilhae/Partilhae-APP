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
        isPrimary ? styles.primaryBtn : styles.outlineBtn,
        style,
        pressed && { opacity: 0.85 },
      ]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? cores.white : cores.primary} />
      ) : (
        <Text
          style={
            isPrimary ? styles.primaryBtnText : styles.outlineBtnText
          }
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
};

export default Botao;
