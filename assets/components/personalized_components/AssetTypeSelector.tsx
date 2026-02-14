import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import AssetsStyles from "../../styles/Assets_style";

const AssetTypeSelector = ({ selectedType, onSelectType }) => {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const assetTypes = [
    // Liquidità
    { value: "LIQUIDITY", icon: "account-balance-wallet", color: "#4CAF50" },
    { value: "SAVINGS_ACCOUNT", icon: "savings", color: "#66BB6A" },
    { value: "DEPOSIT_ACCOUNT", icon: "lock", color: "#81C784" },
    
    // Investimenti azionari
    { value: "STOCK", icon: "show-chart", color: "#E91E63" },
    { value: "ETF", icon: "pie-chart", color: "#42A5F5" },
    { value: "MUTUAL_FUND", icon: "account-balance", color: "#64B5F6" },
    
    // Obbligazioni e Titoli
    { value: "BONDS", icon: "insert-chart", color: "#795548" },
    { value: "GOVERNMENT_BONDS", icon: "account-balance", color: "#8D6E63" },
    
    // Prodotti Postali
    { value: "BUONI_POSTALI", icon: "local-post-office", color: "#FFB300" },
    { value: "LIBRETTO_POSTALE", icon: "book", color: "#FFA726" },
    
    // Previdenza
    { value: "PENSION_FUND", icon: "elderly", color: "#00897B" },
    { value: "PIP", icon: "security", color: "#00ACC1" },
    
    // Criptovalute
    { value: "CRYPTO", icon: "currency-bitcoin", color: "#9C27B0" },
    
    // Immobili
    { value: "REAL_ESTATE", icon: "home", color: "#607D8B" },
    
    // Materie Prime
    { value: "COMMODITIES", icon: "grain", color: "#FFC107" },
    { value: "GOLD", icon: "star", color: "#FFD54F" },

    // Altro
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

            <ScrollView 
              style={AssetsStyles.modalContent}
              contentContainerStyle={{ paddingBottom: 40 }}
            >
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