import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Modal, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import AssetsStyles from "../../styles/Assets_style";
import { getCurrencyFlag } from "./CurrencyPicker";

const AssetsList = ({ 
  assets, 
  onAssetPress, 
  sortBy, 
  onSortChange, 
  order, 
  onOrderChange,
  showPayableOnly,
  onPayableFilterChange 
}) => {
  const { t } = useTranslation();
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const getAssetIcon = (assetType) => {
    const icons = {
      LIQUIDITY: "account-balance-wallet",
      SAVINGS_ACCOUNT: "savings",
      DEPOSIT_ACCOUNT: "lock",
      STOCK: "show-chart",
      ETF: "pie-chart",
      MUTUAL_FUND: "account-balance",
      BONDS: "insert-chart",
      GOVERNMENT_BONDS: "account-balance",
      BUONI_POSTALI: "local-post-office",
      LIBRETTO_POSTALE: "book",
      PENSION_FUND: "elderly",
      PIP: "security",
      CRYPTO: "currency-bitcoin",
      REAL_ESTATE: "home",
      COMMODITIES: "grain",
      GOLD: "star",
      OTHER: "category",
    };
    return icons[assetType] || "category";
  };

  const getAssetColor = (assetType) => {
    const colors = {
      LIQUIDITY: "#4CAF50",
      SAVINGS_ACCOUNT: "#66BB6A",
      DEPOSIT_ACCOUNT: "#81C784",
      STOCK: "#E91E63",
      ETF: "#42A5F5",
      MUTUAL_FUND: "#64B5F6",
      BONDS: "#795548",
      GOVERNMENT_BONDS: "#8D6E63",
      BUONI_POSTALI: "#FFB300",
      LIBRETTO_POSTALE: "#FFA726",
      PENSION_FUND: "#00897B",
      PIP: "#00ACC1",
      CRYPTO: "#9C27B0",
      REAL_ESTATE: "#607D8B",
      COMMODITIES: "#FFC107",
      GOLD: "#FFD54F",
      OTHER: "#9E9E9E",
    };
    return colors[assetType] || "#9E9E9E";
  };

  const sortOptions = [
    { value: "amount", label: t("sort_by_amount"), icon: "attach-money" },
    { value: "bank", label: t("sort_by_bank"), icon: "account-balance" },
    { value: "currency", label: t("sort_by_currency"), icon: "monetization-on" },
    { value: "asset_type", label: t("sort_by_type"), icon: "category" },
  ];

  const getSortLabel = () => {
    const option = sortOptions.find(opt => opt.value === sortBy);
    return option ? option.label : t("sort_by_amount");
  };

  const renderAssetItem = ({ item }) => (
    <TouchableOpacity
      style={AssetsStyles.listItem}
      onPress={() => onAssetPress(item)}
      activeOpacity={0.7}
    >
      <View style={[AssetsStyles.listItemIcon, { backgroundColor: getAssetColor(item.asset_type) }]}>
        <MaterialIcons name={getAssetIcon(item.asset_type)} size={28} color="#fff" />
      </View>

      <View style={AssetsStyles.listItemContent}>
        <Text style={AssetsStyles.listItemBank} numberOfLines={2} ellipsizeMode="tail">
          {item.bank}
        </Text>
        <View style={AssetsStyles.listItemDetails}>
          <Text style={AssetsStyles.listItemType}>{t(item.asset_type)}</Text>
          {item.is_payable && (
            <View style={AssetsStyles.payableBadge}>
              <MaterialIcons name="check-circle" size={12} color="#4CAF50" />
              <Text style={AssetsStyles.payableBadgeText}>{t("payable")}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={AssetsStyles.listItemRight}>
        <Text style={AssetsStyles.listItemAmount} numberOfLines={1}>
          {parseFloat(item.amount).toLocaleString("it-IT", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>
        <View style={AssetsStyles.currencyContainer}>
          <Text style={AssetsStyles.currencyFlag}>{getCurrencyFlag(item.currency)}</Text>
          <Text style={AssetsStyles.listItemCurrency}>{item.currency}</Text>
        </View>
      </View>

      <MaterialIcons name="chevron-right" size={24} color="#BDBDBD" style={AssetsStyles.chevronIcon} />
    </TouchableOpacity>
  );

  if (!assets || assets.length === 0) {
    return (
      <View style={AssetsStyles.emptyContainer}>
        <MaterialIcons name="inbox" size={64} color="#BDBDBD" />
        <Text style={AssetsStyles.emptyText}>{t("no_assets_found")}</Text>
        <Text style={AssetsStyles.emptySubtext}>{t("add_your_first_asset")}</Text>
      </View>
    );
  }

  return (
    <View>
      {/* Filter Button Wrapper */}
      <View style={AssetsStyles.filterButtonWrapper}>
        <TouchableOpacity
          style={AssetsStyles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <View style={{ flex: 1 }}>
            <View style={AssetsStyles.filterButtonTopRow}>
              <MaterialIcons name="filter-list" size={20} color="#007BFF" />
              <View style={AssetsStyles.filterButtonTextContainer}>
                <Text style={AssetsStyles.filterButtonText}>
                  {getSortLabel()} • {order === "asc" ? t("ascending") : t("descending")}
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#007BFF" />
            </View>
            {showPayableOnly && (
              <View style={AssetsStyles.filterActiveBadge}>
                <Text style={AssetsStyles.filterActiveBadgeText}>{t("payable")}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={AssetsStyles.modalOverlay}>
          <View style={AssetsStyles.filterModalContainer}>
            {/* Modal Header */}
            <View style={AssetsStyles.modalHeader}>
              <Text style={AssetsStyles.modalTitle}>{t("filter_and_sort")}</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Modal Content - Scrollable */}
            <ScrollView 
              style={AssetsStyles.filterModalScrollView}
              contentContainerStyle={{ paddingBottom: 40 }}
            >
              <View style={AssetsStyles.filterModalContent}>
                {/* Payable Filter */}
                <View style={AssetsStyles.filterSection}>
                  <Text style={AssetsStyles.filterSectionTitle}>{t("filters")}</Text>
                  <TouchableOpacity
                    style={AssetsStyles.filterCheckbox}
                    onPress={() => onPayableFilterChange(!showPayableOnly)}
                  >
                    <MaterialIcons
                      name={showPayableOnly ? "check-box" : "check-box-outline-blank"}
                      size={24}
                      color={showPayableOnly ? "#007BFF" : "#999"}
                    />
                    <Text style={AssetsStyles.filterCheckboxLabel}>{t("show_payable_only")}</Text>
                  </TouchableOpacity>
                </View>

                {/* Sort By */}
                <View style={AssetsStyles.filterSection}>
                  <Text style={AssetsStyles.filterSectionTitle}>{t("sort_by")}</Text>
                  {sortOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        AssetsStyles.filterOption,
                        sortBy === option.value && AssetsStyles.filterOptionActive,
                      ]}
                      onPress={() => onSortChange(option.value)}
                    >
                      <View style={AssetsStyles.filterOptionLeft}>
                        <MaterialIcons
                          name={option.icon}
                          size={20}
                          color={sortBy === option.value ? "#007BFF" : "#666"}
                        />
                        <Text
                          style={[
                            AssetsStyles.filterOptionText,
                            sortBy === option.value && AssetsStyles.filterOptionTextActive,
                          ]}
                        >
                          {option.label}
                        </Text>
                      </View>
                      {sortBy === option.value && (
                        <MaterialIcons name="check" size={20} color="#007BFF" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Order */}
                <View style={AssetsStyles.filterSection}>
                  <Text style={AssetsStyles.filterSectionTitle}>{t("order")}</Text>
                  <TouchableOpacity
                    style={[
                      AssetsStyles.filterOption,
                      order === "desc" && AssetsStyles.filterOptionActive,
                    ]}
                    onPress={() => onOrderChange("desc")}
                  >
                    <View style={AssetsStyles.filterOptionLeft}>
                      <MaterialIcons
                        name="arrow-downward"
                        size={20}
                        color={order === "desc" ? "#007BFF" : "#666"}
                      />
                      <Text
                        style={[
                          AssetsStyles.filterOptionText,
                          order === "desc" && AssetsStyles.filterOptionTextActive,
                        ]}
                      >
                        {t("descending")}
                      </Text>
                    </View>
                    {order === "desc" && (
                      <MaterialIcons name="check" size={20} color="#007BFF" />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      AssetsStyles.filterOption,
                      order === "asc" && AssetsStyles.filterOptionActive,
                    ]}
                    onPress={() => onOrderChange("asc")}
                  >
                    <View style={AssetsStyles.filterOptionLeft}>
                      <MaterialIcons
                        name="arrow-upward"
                        size={20}
                        color={order === "asc" ? "#007BFF" : "#666"}
                      />
                      <Text
                        style={[
                          AssetsStyles.filterOptionText,
                          order === "asc" && AssetsStyles.filterOptionTextActive,
                        ]}
                      >
                        {t("ascending")}
                      </Text>
                    </View>
                    {order === "asc" && (
                      <MaterialIcons name="check" size={20} color="#007BFF" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            {/* Apply Button */}
            <View style={AssetsStyles.filterModalFooter}>
              <TouchableOpacity
                style={AssetsStyles.filterApplyButton}
                onPress={() => setFilterModalVisible(false)}
              >
                <Text style={AssetsStyles.filterApplyButtonText}>{t("apply")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Assets List */}
      <FlatList
        data={assets}
        renderItem={renderAssetItem}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={AssetsStyles.separator} />}
        contentContainerStyle={AssetsStyles.listContainer}
      />
    </View>
  );
};

export default AssetsList;