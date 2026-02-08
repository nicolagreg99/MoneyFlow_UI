import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import AssetsStyles from "../../styles/Assets_style";

const BankSelector = ({ selectedBank, onSelectBank }) => {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [customBank, setCustomBank] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const commonBanks = [
    { name: "Revolut", icon: "account-balance" },
    { name: "N26", icon: "account-balance" },
    { name: "Wise", icon: "account-balance" },
    { name: "Intesa Sanpaolo", icon: "account-balance" },
    { name: "UniCredit", icon: "account-balance" },
    { name: "BNL", icon: "account-balance" },
    { name: "Fineco", icon: "account-balance" },
    { name: "ING", icon: "account-balance" },
    { name: "Mediolanum", icon: "account-balance" },
    { name: "Poste Italiane", icon: "account-balance" },
    { name: "Binance", icon: "currency-bitcoin" },
    { name: "Coinbase", icon: "currency-bitcoin" },
    { name: "Interactive Brokers", icon: "trending-up" },
    { name: "Degiro", icon: "trending-up" },
    { name: "Trading212", icon: "trending-up" },
  ];

  const handleSelect = (bankName) => {
    onSelectBank(bankName);
    setModalVisible(false);
    setShowCustomInput(false);
    setCustomBank("");
  };

  const handleCustomBank = () => {
    if (customBank.trim()) {
      handleSelect(customBank.trim());
    }
  };

  return (
    <>
      <TouchableOpacity
        style={AssetsStyles.selectorButton}
        onPress={() => setModalVisible(true)}
      >
        <View style={AssetsStyles.selectorContent}>
          {selectedBank ? (
            <>
              <MaterialIcons name="account-balance" size={24} color="#007BFF" />
              <Text style={AssetsStyles.selectorText}>{selectedBank}</Text>
            </>
          ) : (
            <Text style={AssetsStyles.selectorPlaceholder}>{t("select_bank")}</Text>
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
              <Text style={AssetsStyles.modalTitle}>{t("select_bank")}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={AssetsStyles.modalContent}>
              {/* Common Banks */}
              {commonBanks.map((bank) => (
                <TouchableOpacity
                  key={bank.name}
                  style={[
                    AssetsStyles.modalOption,
                    selectedBank === bank.name && AssetsStyles.modalOptionSelected,
                  ]}
                  onPress={() => handleSelect(bank.name)}
                >
                  <View style={AssetsStyles.modalOptionContent}>
                    <MaterialIcons name={bank.icon} size={24} color="#007BFF" />
                    <Text style={AssetsStyles.modalOptionText}>{bank.name}</Text>
                  </View>
                  {selectedBank === bank.name && (
                    <MaterialIcons name="check" size={24} color="#007BFF" />
                  )}
                </TouchableOpacity>
              ))}

              {/* Custom Bank Option */}
              <TouchableOpacity
                style={[AssetsStyles.modalOption, AssetsStyles.customBankOption]}
                onPress={() => setShowCustomInput(!showCustomInput)}
              >
                <View style={AssetsStyles.modalOptionContent}>
                  <MaterialIcons name="add-circle-outline" size={24} color="#007BFF" />
                  <Text style={[AssetsStyles.modalOptionText, { color: "#007BFF" }]}>
                    {t("add_custom_bank")}
                  </Text>
                </View>
                <MaterialIcons
                  name={showCustomInput ? "expand-less" : "expand-more"}
                  size={24}
                  color="#007BFF"
                />
              </TouchableOpacity>

              {showCustomInput && (
                <View style={AssetsStyles.customBankContainer}>
                  <TextInput
                    style={AssetsStyles.customBankInput}
                    value={customBank}
                    onChangeText={setCustomBank}
                    placeholder={t("enter_bank_name")}
                    placeholderTextColor="#999"
                    autoFocus
                  />
                  <TouchableOpacity
                    style={AssetsStyles.customBankButton}
                    onPress={handleCustomBank}
                  >
                    <Text style={AssetsStyles.customBankButtonText}>{t("add")}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default BankSelector;