import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import AssetsStyles from "../../styles/Assets_style";

const AssetTypeSelector = ({ selectedType, onSelectType }) => {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const assetTypes = [
    { value: "LIQUIDITY", icon: "account-balance-wallet", color: "#4CAF50" },
    { value: "STOCK", icon: "trending-up", color: "#2196F3" },
    { value: "ETF", icon: "pie-chart", color: "#FF9800" },
    { value: "CRYPTO", icon: "currency-bitcoin", color: "#9C27B0" },
    { value: "BOND", icon: "insert-chart", color: "#795548" },
    { value: "REAL_ESTATE", icon: "home", color: "#607D8B" },
    { value: "COMMODITY", icon: "grain", color: "#FFC107" },
    { value: "OTHER", icon: "category", color: "#9E9E9E" },
  ];

  const handleSelect = (type) => {
    onSelectType(type);
    setModalVisible(false);
  };

  const selectedAssetType = assetTypes.find((type) => type.value === selectedType);

  return (
    <>
      <TouchableOpacity
        style={AssetsStyles.selectorButton}
        onPress={() => setModalVisible(true)}
      >
        <View style={AssetsStyles.selectorContent}>
          {selectedAssetType ? (
            <>
              <MaterialIcons
                name={selectedAssetType.icon}
                size={24}
                color={selectedAssetType.color}
              />
              <Text style={AssetsStyles.selectorText}>{t(selectedType)}</Text>
            </>
          ) : (
            <Text style={AssetsStyles.selectorPlaceholder}>{t("select_asset_type")}</Text>
          )}
        </View>
        <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={AssetsStyles.modalOverlay}>
          <View style={AssetsStyles.modalContainer}>
            <View style={AssetsStyles.modalHeader}>
              <Text style={AssetsStyles.modalTitle}>{t("select_asset_type")}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={AssetsStyles.modalContent}>
              {assetTypes.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    AssetsStyles.modalOption,
                    selectedType === type.value && AssetsStyles.modalOptionSelected,
                  ]}
                  onPress={() => handleSelect(type.value)}
                >
                  <View style={AssetsStyles.modalOptionContent}>
                    <View style={[AssetsStyles.modalOptionIcon, { backgroundColor: type.color }]}>
                      <MaterialIcons name={type.icon} size={24} color="#fff" />
                    </View>
                    <Text style={AssetsStyles.modalOptionText}>{t(type.value)}</Text>
                  </View>
                  {selectedType === type.value && (
                    <MaterialIcons name="check" size={24} color="#007BFF" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default AssetTypeSelector;