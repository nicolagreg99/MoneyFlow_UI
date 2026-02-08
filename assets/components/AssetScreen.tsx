import React, { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, RefreshControl } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import API from "../../config/api";
import AssetsStyles from "../styles/Assets_style";
import AssetsPieChart from "./personalized_components/AssetsPieChart";
import AssetsList from "./personalized_components/AssetsList";

const AssetScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const scrollViewRef = useRef(null);

  const [totalAssets, setTotalAssets] = useState(0);
  const [assetsByType, setAssetsByType] = useState([]);
  const [assetsByBank, setAssetsByBank] = useState([]);
  const [allAssets, setAllAssets] = useState([]);
  const [userCurrency, setUserCurrency] = useState("EUR");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("type"); // "type" or "bank"
  
  // Filter and Sort States
  const [sortBy, setSortBy] = useState("amount");
  const [order, setOrder] = useState("desc");
  const [showPayableOnly, setShowPayableOnly] = useState(false);

  const assetTypeColors = {
    LIQUIDITY: "#4CAF50",
    STOCK: "#2196F3",
    ETF: "#FF9800",
    CRYPTO: "#9C27B0",
    BOND: "#795548",
    REAL_ESTATE: "#607D8B",
    COMMODITY: "#FFC107",
    OTHER: "#9E9E9E",
  };

  const getToken = async () => {
    try {
      return await AsyncStorage.getItem("authToken");
    } catch (error) {
      console.error("Token fetch error:", error);
      return null;
    }
  };

  const loadUserCurrency = async () => {
    try {
      const userDataString = await AsyncStorage.getItem("userData");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setUserCurrency(userData.default_currency || "EUR");
      }
    } catch (error) {
      console.error("Currency fetch error:", error);
    }
  };

  const fetchTotalAssets = async () => {
    try {
      const token = await getToken();
      if (!token) {
        setError(t("token_missing"));
        return;
      }

      const response = await axios.get(`${API.BASE_URL}/api/v1/assets/total`, {
        headers: { "x-access-token": token },
      });

      if (response.data) {
        setTotalAssets(response.data.total || 0);
        setUserCurrency(response.data.currency || "EUR");
      }
    } catch (error) {
      console.error("Total assets fetch error:", error.response?.data || error.message);
      setError(t("fetch_error"));
    }
  };

  const fetchAssetsByType = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const response = await axios.get(`${API.BASE_URL}/api/v1/assets/total?group_by=asset_type`, {
        headers: { "x-access-token": token },
      });

      if (response.data && response.data.results) {
        const formattedData = response.data.results.map((item) => ({
          name: t(item.asset_type) || item.asset_type,
          value: parseFloat(item.total) || 0,
          color: assetTypeColors[item.asset_type] || assetTypeColors["OTHER"],
          type: item.asset_type,
        }));
        setAssetsByType(formattedData);
      }
    } catch (error) {
      console.error("Assets by type fetch error:", error);
    }
  };

  const fetchAssetsByBank = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const response = await axios.get(`${API.BASE_URL}/api/v1/assets/total?group_by=bank`, {
        headers: { "x-access-token": token },
      });

      if (response.data && response.data.results) {
        const bankColors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"];
        const formattedData = response.data.results.map((item, index) => ({
          name: item.bank,
          value: parseFloat(item.total) || 0,
          color: bankColors[index % bankColors.length],
        }));
        setAssetsByBank(formattedData);
      }
    } catch (error) {
      console.error("Assets by bank fetch error:", error);
    }
  };

  const fetchAllAssets = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      // Build query parameters
      let url = `${API.BASE_URL}/api/v1/assets/list?sort_by=${sortBy}&order=${order}`;
      
      if (showPayableOnly) {
        url += "&is_payable=true";
      }

      const response = await axios.get(url, {
        headers: { "x-access-token": token },
      });

      // Handle both old format (array) and new format (object with assets)
      if (response.data) {
        const assets = response.data.assets || response.data;
        if (Array.isArray(assets)) {
          setAllAssets(assets);
        }
      }
    } catch (error) {
      console.error("All assets fetch error:", error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchTotalAssets(),
        fetchAssetsByType(),
        fetchAssetsByBank(),
        fetchAllAssets(),
      ]);
    } catch (error) {
      console.error("Data fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadUserCurrency();
  }, []);

  // Refetch assets when sort/filter changes
  useEffect(() => {
    if (!loading) {
      fetchAllAssets();
    }
  }, [sortBy, order, showPayableOnly]);

  useFocusEffect(
    React.useCallback(() => {
      // Scroll to top
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
      
      // Reset to original state when screen is focused
      setViewMode("type");
      setSortBy("amount");
      setOrder("desc");
      setShowPayableOnly(false);
      setError(null);
      fetchData();
    }, [])
  );

  const handleAssetPress = (asset) => {
    navigation.navigate("AssetDetails", { asset });
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const handleOrderChange = (newOrder) => {
    setOrder(newOrder);
  };

  const handlePayableFilterChange = (value) => {
    setShowPayableOnly(value);
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={AssetsStyles.scrollContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={AssetsStyles.container}>
        {/* Header */}
        <View style={AssetsStyles.titleContainer}>
          <Text style={AssetsStyles.title}>{t("assets_management")}</Text>
        </View>

        {/* Action Buttons */}
        <View style={AssetsStyles.actionsContainer}>
          <TouchableOpacity
            style={AssetsStyles.iconButton}
            onPress={() => navigation.navigate("InsertAsset")}
          >
            <MaterialIcons name="add-circle-outline" size={22} color="#007BFF" />
            <Text style={AssetsStyles.iconButtonText}>{t("add_asset")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[AssetsStyles.iconButton, AssetsStyles.transferButton]}
            onPress={() => navigation.navigate("TransferAsset")}
          >
            <MaterialIcons name="swap-horiz" size={22} color="#FF9800" />
            <Text style={AssetsStyles.iconButtonText}>{t("transfer")}</Text>
          </TouchableOpacity>
        </View>

        {/* Total Assets Widget */}
        <View style={AssetsStyles.totalContainer}>
          <Text style={AssetsStyles.totalLabel}>{t("total_assets")}</Text>
          {loading && !refreshing ? (
            <ActivityIndicator size="large" color="#007BFF" />
          ) : (
            <Text style={AssetsStyles.totalValue}>
              {totalAssets.toLocaleString("it-IT", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              {userCurrency}
            </Text>
          )}
        </View>

        {/* View Mode Toggle */}
        <View style={AssetsStyles.toggleContainer}>
          <TouchableOpacity
            style={[
              AssetsStyles.toggleButton,
              viewMode === "type" && AssetsStyles.toggleButtonActive,
            ]}
            onPress={() => setViewMode("type")}
          >
            <Text
              style={[
                AssetsStyles.toggleButtonText,
                viewMode === "type" && AssetsStyles.toggleButtonTextActive,
              ]}
            >
              {t("by_type")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              AssetsStyles.toggleButton,
              viewMode === "bank" && AssetsStyles.toggleButtonActive,
            ]}
            onPress={() => setViewMode("bank")}
          >
            <Text
              style={[
                AssetsStyles.toggleButtonText,
                viewMode === "bank" && AssetsStyles.toggleButtonTextActive,
              ]}
            >
              {t("by_bank")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Pie Chart */}
        {loading && !refreshing ? (
          <ActivityIndicator size="large" color="#007BFF" style={{ marginVertical: 40 }} />
        ) : error ? (
          <Text style={AssetsStyles.errorText}>{error}</Text>
        ) : (
          <AssetsPieChart
            data={viewMode === "type" ? assetsByType : assetsByBank}
            total={totalAssets}
            userCurrency={userCurrency}
          />
        )}

        {/* Assets List */}
        <View style={AssetsStyles.listSection}>
          <Text style={AssetsStyles.sectionTitle}>{t("my_assets")}</Text>
          {allAssets.length > 0 ? (
            <AssetsList 
              assets={allAssets} 
              onAssetPress={handleAssetPress}
              sortBy={sortBy}
              onSortChange={handleSortChange}
              order={order}
              onOrderChange={handleOrderChange}
              showPayableOnly={showPayableOnly}
              onPayableFilterChange={handlePayableFilterChange}
            />
          ) : (
            <Text style={AssetsStyles.noDataText}>{t("no_assets")}</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default AssetScreen;