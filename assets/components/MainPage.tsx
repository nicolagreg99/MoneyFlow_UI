import React, { useState, useCallback } from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import MainStyles from "../styles/Main_style";
import LineChartComponent from "./personalized_components/LineChartComponent";
import StatsWidget from "./personalized_components/StatsWidget";
import MonthlyBalanceTable from "./personalized_components/MonthlyBalanceTable";
import { showToast } from "../config/toastConfig";
import API from "../../config/api";
import { useTranslation } from "react-i18next";

const API_SPESA = `${API.BASE_URL}/api/v1/expenses/total_by_month`;
const API_ENTRATE = `${API.BASE_URL}/api/v1/incomes/total_by_month`;
const API_BILANCIO = `${API.BASE_URL}/api/v1/balances/total_by_month`;

const MainPage = () => {
  const [spese, setSpese] = useState<number[]>([]);
  const [entrate, setEntrate] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [balances, setBalances] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [userCurrency, setUserCurrency] = useState("EUR");
  const navigation = useNavigation();
  const { t } = useTranslation();

  const getLast12Months = () => {
    const mesi = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    const oggi = new Date();
    let mesiDinamici: string[] = [];

    for (let i = 0; i < 12; i++) {
      let data = new Date(oggi.getFullYear(), oggi.getMonth() - i, 1);
      mesiDinamici.push(`${mesi[data.getMonth()]} ${data.getFullYear()}`);
    }

    return mesiDinamici;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        showToast(t("login_session_expired"), "error");
        navigation.navigate("Login");
        return;
      }

      const headers = { "x-access-token": token };

      const [speseRes, entrateRes, balanceRes] = await Promise.all([
        fetch(API_SPESA, { headers }),
        fetch(API_ENTRATE, { headers }),
        fetch(API_BILANCIO, { headers }),
      ]);

      if (speseRes.status === 401 || entrateRes.status === 401 || balanceRes.status === 401) {
        showToast(t("login_session_expired"), "error");
        await AsyncStorage.removeItem("authToken");
        navigation.navigate("Login");
        return;
      }

      if (!speseRes.ok || !entrateRes.ok || !balanceRes.ok) {
        throw new Error("Errore nel recupero dei dati");
      }

      const speseData = await speseRes.json();
      const entrateData = await entrateRes.json();
      const balanceData = await balanceRes.json();

      const mesiDinamici = getLast12Months();
      const speseMonthly = speseData.monthly_totals || {};
      const entrateMonthly = entrateData.monthly_totals || {};

      const speseMapped = mesiDinamici.map((mese) => parseFloat(speseMonthly[mese] || 0));
      const entrateMapped = mesiDinamici.map((mese) => parseFloat(entrateMonthly[mese] || 0));

      setLabels(mesiDinamici);
      setSpese(speseMapped);
      setEntrate(entrateMapped);
      setBalances(balanceData);
      setUserCurrency(balanceData?.[0]?.currency || speseData.currency || "EUR");
    } catch (error: any) {
      console.error("Errore:", error);
      showToast(t("data_loading_error"), "error");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  if (loading) {
    return (
      <View style={MainStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={MainStyles.loadingText}>{t("loading")}</Text>
      </View>
    );
  }

  const totalEntrate = entrate.reduce((a, b) => a + b, 0);
  const totalSpese = spese.reduce((a, b) => a + b, 0);
  const bilancioNetto = totalEntrate - totalSpese;

  return (
    <ScrollView 
      style={MainStyles.container} 
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled={true}
    >
      <View style={MainStyles.statsSection}>
        <Text style={MainStyles.sectionTitle}>💰 {t("annual_summary")}</Text>
        <View style={MainStyles.widgetsContainer}>
          <StatsWidget
            title={t("total_income")}
            value={`${totalEntrate.toFixed(2)} ${userCurrency}`}
            icon="📈"
          />
          <StatsWidget
            title={t("total_expense")}
            value={`${totalSpese.toFixed(2)} ${userCurrency}`}
            icon="💸"
          />
          <StatsWidget
            title={t("net_balance")}
            value={`${bilancioNetto.toFixed(2)} ${userCurrency}`}
            icon={bilancioNetto >= 0 ? "✅" : "⚠️"}
          />
        </View>
      </View>

      <LineChartComponent
        labels={[...labels].reverse()}
        entrate={[...entrate].reverse()}
        spese={[...spese].reverse()}
        currency={userCurrency}
      />

      <View style={MainStyles.tableSection}>
        <Text style={MainStyles.sectionTitle}>📋 {t("monthly_details")}</Text>
        <View>
          <MonthlyBalanceTable
            balances={labels.map((mese, index) => ({
              mese,
              entrate: entrate[index] || 0,
              spese: spese[index] || 0,
              valore: (entrate[index] || 0) - (spese[index] || 0),
              currency: userCurrency,
            }))}
            currency={userCurrency}
          />
        </View>
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
};

export default MainPage;
