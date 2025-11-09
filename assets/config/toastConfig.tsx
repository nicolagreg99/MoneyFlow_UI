import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const toastConfig = {
  success: ({ text1 }: { text1: string }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#16A085",
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 10,
        marginHorizontal: 18,
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
      }}
    >
      <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
      <Text
        style={{
          color: "#fff",
          fontSize: 15,
          fontWeight: "500",
          marginLeft: 8,
        }}
      >
        {text1}
      </Text>
    </View>
  ),

  error: ({ text1 }: { text1: string }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E74C3C",
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 10,
        marginHorizontal: 18,
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
      }}
    >
      <Ionicons name="alert-circle-outline" size={20} color="#fff" />
      <Text
        style={{
          color: "#fff",
          fontSize: 15,
          fontWeight: "500",
          marginLeft: 8,
        }}
      >
        {text1}
      </Text>
    </View>
  ),
};
