import React, { useState } from "react";
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { VictoryPie } from "victory-native";
import { getCurrencyFlag } from "./CurrencyPicker";
import { useTranslation } from "react-i18next";

const screenWidth = Dimensions.get("window").width;

const lightenColor = (hex: string, amount: number) => {
  let col = hex.replace("#", "");
  if (col.length === 3) {
    col = col
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const num = parseInt(col, 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0x00ff) + amount);
  const b = Math.min(255, (num & 0x0000ff) + amount);
  return `rgb(${r}, ${g}, ${b})`;
};

const PieChartGraph = ({ data = [], total = 0, userCurrency = "EUR" }) => {
  const [selectedSlice, setSelectedSlice] = useState<number | null>(null);
  const { t } = useTranslation();

  if (!Array.isArray(data) || data.length === 0 || total <= 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{t("no_data")}</Text>
      </View>
    );
  }

  const userFlag = getCurrencyFlag(userCurrency) || "💶";

  const chartData = data.map((item, index) => ({
    x: item.name,
    y: item.value,
    color: item.color,
    name: item.name,
    percentage: ((item.value / total) * 100).toFixed(1),
    index: index,
  }));

  const getAdaptiveFontSize = (value: number) => {
    const length = value.toString().length;
    if (length < 7) return 22;
    if (length < 10) return 20;
    if (length < 13) return 18;
    return 16;
  };


  const handleSlicePress = (index: number) => {
    setSelectedSlice(selectedSlice === index ? null : index);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.chartCard}>
        <View style={styles.headerSection}>
          <View>
            <Text style={styles.title}>📊 {t("distribution")} </Text>
            <Text style={styles.subtitle}>{t("pie_subtitle")}</Text>
          </View>
          <View style={styles.currencyBadge}>
            <Text style={styles.currencyFlag}>{userFlag}</Text>
            <Text style={styles.currencyText}>{userCurrency}</Text>
          </View>
        </View>

        <TouchableWithoutFeedback onPress={() => setSelectedSlice(null)}>
          <View style={styles.chartContainer}>
            <VictoryPie
              data={chartData}
              width={screenWidth * 0.9}
              height={320}
              innerRadius={85}
              padAngle={2}
              cornerRadius={4}
              colorScale={chartData.map((item) => item.color)}
              animate={{ duration: 700, easing: "bounce" }}
              labels={() => null}
              style={{
                data: {
                  stroke: ({ datum, index }) =>
                    selectedSlice === index
                      ? lightenColor(datum.color, 80)
                      : "#fff",
                  strokeWidth: ({ index }) =>
                    selectedSlice === index ? 2 : 1,
                  opacity: ({ index }) =>
                    selectedSlice === null || selectedSlice === index ? 1 : 0.4,
                },
              }}
              events={[
                {
                  target: "data",
                  eventHandlers: {
                    onPress: () => [
                      {
                        target: "data",
                        mutation: (props) => {
                          handleSlicePress(props.index);
                          return null;
                        },
                      },
                    ],
                  },
                },
              ]}
            />

            {selectedSlice === null && (
              <View style={styles.centerTotal}>
                <Text style={styles.totalLabel}>{t("total")}</Text>
                <View style={styles.totalValueContainer}>
                  <Text style={styles.totalFlag}>{userFlag}</Text>
                  <Text
                    style={[
                      styles.totalValue,
                      { fontSize: getAdaptiveFontSize(total) },
                    ]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {total.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Text>
                </View>
                <Text style={styles.totalCurrency}>{userCurrency}</Text>
              </View>
            )}

            {selectedSlice !== null && (
              <View style={styles.centerTooltip}>
                <TouchableOpacity
                  style={styles.closeButtonTop}
                  onPress={() => setSelectedSlice(null)}
                >
                  <Text style={styles.closeIconText}>✕</Text>
                </TouchableOpacity>
                <View
                  style={[
                    styles.colorIndicator,
                    { backgroundColor: chartData[selectedSlice].color },
                  ]}
                />
                <Text style={styles.tooltipName}>
                  {chartData[selectedSlice].name}
                </Text>
                <Text style={styles.tooltipPercent}>
                  {chartData[selectedSlice].percentage}%
                </Text>
                <Text style={styles.tooltipValue}>
                  {userFlag}{" "}
                  {parseFloat(chartData[selectedSlice].y).toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </Text>
                <Text style={styles.tooltipCurrency}>{userCurrency}</Text>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>

      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>📋 {t("categories")}</Text>
        {chartData.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.legendItem,
              selectedSlice === index && styles.legendItemSelected,
            ]}
            onPress={() => handleSlicePress(index)}
          >
            <View style={styles.legendLeft}>
              <View
                style={[styles.legendColorBox, { backgroundColor: item.color }]}
              />
              <View style={styles.legendTextContainer}>
                <Text style={styles.legendText}>{item.name}</Text>
                <Text style={styles.legendPercentage}>{item.percentage}%</Text>
              </View>
            </View>
            <View style={styles.legendRight}>
              <Text style={styles.legendValue}>
                {userFlag}{" "}
                {parseFloat(item.y).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
              <Text style={styles.legendCurrency}>{userCurrency}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default PieChartGraph;

const styles = StyleSheet.create({
  scrollContainer: { alignItems: "center", paddingBottom: 30 },
  chartCard: {
    backgroundColor: "#fff",
    width: screenWidth * 0.9,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: { fontSize: 12, color: "#64748b", fontWeight: "500" },
  currencyBadge: {
    backgroundColor: "#f8fafc",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  currencyFlag: { fontSize: 16 },
  currencyText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#1e293b",
    letterSpacing: 0.5,
  },
  chartContainer: { position: "relative", alignItems: "center" },
  centerTotal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -65 }, { translateY: -60 }],
    alignItems: "center",
    backgroundColor: "rgba(248,250,252,0.95)",
    borderRadius: 120,
    paddingVertical: 28,
    paddingHorizontal: 12,
    width: 130,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
  },
  totalLabel: { fontSize: 12, color: "#64748b", fontWeight: "600" },
  totalValueContainer: { flexDirection: "row", alignItems: "flex-end" },
  totalFlag: { fontSize: 16, marginRight: 4 },
  totalValue: { fontSize: 22, fontWeight: "800", color: "#0f172a" },
  totalCurrency: { fontSize: 11, color: "#94a3b8", fontWeight: "600" },
  centerTooltip: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -80 }, { translateY: -85 }],
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: 160,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  closeButtonTop: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
  },
  closeIconText: { color: "#64748b", fontSize: 14, fontWeight: "700" },
  colorIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 12,
  },
  tooltipName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
    textAlign: "center",
    marginBottom: 8,
  },
  tooltipPercent: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: -1,
    marginBottom: 4,
  },
  tooltipValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#475569",
    letterSpacing: -0.3,
  },
  tooltipCurrency: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "600",
    marginTop: 2,
  },
  legendContainer: {
    width: screenWidth * 0.9,
    padding: 20,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    borderWidth: 2,
    borderColor: "transparent",
  },
  legendItemSelected: {
    backgroundColor: "#fff",
    borderColor: "#facc15",
  },
  legendLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  legendColorBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    marginRight: 12,
  },
  legendTextContainer: { flex: 1 },
  legendText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 2,
  },
  legendPercentage: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
  },
  legendRight: { alignItems: "flex-end" },
  legendValue: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: -0.3,
  },
  legendCurrency: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: "#fff",
    borderRadius: 20,
    margin: 16,
  },
  emptyText: { color: "#94a3b8", fontSize: 15, fontWeight: "500" },
});
