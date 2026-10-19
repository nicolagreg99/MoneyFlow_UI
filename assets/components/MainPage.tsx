import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import MainStyles from "../styles/Main_style";
import LineChartComponent from "./personalized_components/LineChartComponent";
import StatsWidget from "./personalized_components/StatsWidget";
import MonthlyBalanceTable from "./personalized_components/MonthlyBalanceTable";
import DateRangePicker from "./personalized_components/DateRangePicker";
import { showToast } from "../config/toastConfig";
import API from "../../config/api";
import { useTranslation } from "react-i18next";
import { formatMonth } from "./personalized_components/formatMonth";

const API_BILANCIO = `${API.BASE_URL}/api/v1/balances/total_by_month`;
if (__DEV__) console.log("API_BILANCIO:", API_BILANCIO);

const PRESETS = [6, 12, 24];
const DEFAULT_RANGE = 12;
const MAX_MONTHS = 120; // stesso limite del backend

export interface BalanceItem {
  month: string; // "2025-03"
  income: number;
  expense: number;
  balance: number;
  cumulative: number;
}

interface BalanceResponse {
  start: string;
  end: string;
  currency: string;
  opening_balance: number;
  data: BalanceItem[];
}

type Mode = number | "custom"; // numero = preset in mesi

// Valori iniziali, usati sia dallo stato sia dal reset
const defaultFrom = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth() - 11, 1, 12);
};
const defaultTo = () => new Date();

const toYM = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

const monthsBetween = (a: Date, b: Date) =>
  (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()) + 1;

const MainPage = () => {
  const [balances, setBalances] = useState<BalanceItem[]>([]);
  const [mode, setMode] = useState<Mode>(DEFAULT_RANGE);
  const [fromDate, setFromDate] = useState<Date>(defaultFrom);
  const [toDate, setToDate] = useState<Date>(defaultTo);
  const [period, setPeriod] = useState<{ start: string; end: string } | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userCurrency, setUserCurrency] = useState("EUR");

  const requestId = useRef(0); // scarta risposte vecchie se cambi range velocemente

  const navigation = useNavigation();
  const { t } = useTranslation();

  const presetLabel = (r: number) => {
    if (r < 12) return `${r} ${t("months")}`;
    const years = r / 12;
    return `${years} ${years === 1 ? t("year") : t("years")}`;
  };

  const buildQuery = (): string | null => {
    if (mode !== "custom") return `months=${mode}`;

    if (fromDate > toDate) {
      showToast(t("invalid_date_range"), "error");
      return null;
    }
    if (monthsBetween(fromDate, toDate) > MAX_MONTHS) {
      showToast(t("range_too_long"), "error");
      return null;
    }
    return `start=${toYM(fromDate)}&end=${toYM(toDate)}`;
  };

  const fetchData = async () => {
    const query = buildQuery();
    if (!query) return;

    const myId = ++requestId.current;
    setRefreshing(true);

    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        showToast(t("login_session_expired"), "error");
        navigation.navigate("Login" as never);
        return;
      }

      const res = await fetch(`${API_BILANCIO}?${query}`, {
        headers: { "x-access-token": token },
      });

      if (res.status === 401) {
        await AsyncStorage.removeItem("authToken");
        showToast(t("login_session_expired"), "error");
        navigation.navigate("Login" as never);
        return;
      }

      if (!res.ok) {
        throw new Error("Errore nel recupero dei dati");
      }

      const json: BalanceResponse = await res.json();
      if (myId !== requestId.current) return; // risposta superata

      // Controllo difensivo: se il server non manda `data` come array, non crashare
      if (!Array.isArray(json?.data)) {
        console.error("Risposta inattesa dal server:", json);
        showToast(t("data_loading_error"), "error");
        return;
      }

      setBalances(json.data.filter((b) => typeof b?.month === "string"));
      setUserCurrency(json.currency || "EUR");
      setPeriod({ start: json.start, end: json.end });
    } catch (error) {
      console.error("Errore:", error);
      if (myId === requestId.current) showToast(t("data_loading_error"), "error");
    } finally {
      if (myId === requestId.current) {
        setInitialLoading(false);
        setRefreshing(false);
      }
    }
  };

  // Reset dello stato quando la schermata perde il focus.
  // Deps vuote: la cleanup parte solo quando lasci la pagina,
  // non a ogni cambio di range.
  useFocusEffect(
    useCallback(() => {
      return () => {
        requestId.current++; // scarta eventuali risposte in volo
        setBalances([]);
        setPeriod(null);
        setMode(DEFAULT_RANGE);
        setFromDate(defaultFrom());
        setToDate(defaultTo());
        setUserCurrency("EUR");
        setRefreshing(false);
        setInitialLoading(true); // al ritorno rivedi il caricamento
      };
    }, [])
  );

  // Caricamento dati
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [mode, fromDate, toDate])
  );

  if (initialLoading) {
    return (
      <View style={MainStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={MainStyles.loadingText}>{t("loading")}</Text>
      </View>
    );
  }

  const safeBalances = balances ?? [];

  const totalEntrate = safeBalances.reduce((sum, b) => sum + b.income, 0);
  const totalSpese = safeBalances.reduce((sum, b) => sum + b.expense, 0);
  const bilancioNetto = totalEntrate - totalSpese;

  const months = safeBalances.map((b) => b.month);
  const entrate = safeBalances.map((b) => b.income);
  const spese = safeBalances.map((b) => b.expense);

  const chartSubtitle =
    mode === "custom"
      ? period
        ? `${formatMonth(period.start, t)} – ${formatMonth(period.end, t)}`
        : ""
      : presetLabel(mode);

  const chip = (active: boolean) => ({
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: active ? "#3b82f6" : "#e5e7eb",
  });
  const chipText = (active: boolean) => ({
    color: active ? "#fff" : "#374151",
    fontWeight: "600" as const,
  });

  return (
    <ScrollView style={MainStyles.container} showsVerticalScrollIndicator={false}>
      {/* ===== SELETTORE RANGE ===== */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: 12,
          gap: 8,
        }}
      >
        {PRESETS.map((r) => (
          <TouchableOpacity
            key={r}
            onPress={() => setMode(r)}
            disabled={refreshing}
            style={chip(mode === r)}
          >
            <Text style={chipText(mode === r)}>{presetLabel(r)}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          onPress={() => setMode("custom")}
          disabled={refreshing}
          style={chip(mode === "custom")}
        >
          <Text style={chipText(mode === "custom")}>{t("custom")}</Text>
        </TouchableOpacity>
      </View>

      {mode === "custom" && (
        <View style={{ marginHorizontal: 16, marginTop: 12 }}>
          <DateRangePicker
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
          />
        </View>
      )}

      {refreshing && (
        <ActivityIndicator size="small" color="#3b82f6" style={{ marginTop: 8 }} />
      )}

      {/* ===== STATS ===== */}
      <View style={MainStyles.statsSection}>
        <Text style={MainStyles.sectionTitle}>💰 {t("period_summary")}</Text>

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

      {/* ===== GRAFICO ===== */}
      <LineChartComponent
        months={months}
        entrate={entrate}
        spese={spese}
        currency={userCurrency}
        subtitle={chartSubtitle}
      />

      {/* ===== TABELLA BILANCI ===== */}
      <View style={MainStyles.tableSection}>
        <Text style={MainStyles.sectionTitle}>📋 {t("monthly_details")}</Text>
        <MonthlyBalanceTable balances={safeBalances} currency={userCurrency} />
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
};

export default MainPage;