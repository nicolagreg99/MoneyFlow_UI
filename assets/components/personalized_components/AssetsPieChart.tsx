import React, { useState } from "react";
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { VictoryPie } from "victory-native";
import { useTranslation } from "react-i18next";
import { getCurrencyFlag } from "./CurrencyPicker";
import AssetsStyles from "../../styles/Assets_style";

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

const AssetsPieChart = ({ data = [], total = 0, userCurrency = "EUR" }) => {
  const [selectedSlice, setSelectedSlice] = useState<number | null>(null);
  const { t } = useTranslation();

  if (!Array.isArray(data) || data.length === 0 || total <= 0) {
    return (
      <View style={AssetsStyles.emptyChartContainer}>
        <Text style={AssetsStyles.emptyChartText}>{t("no_data")}</Text>
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
    <ScrollView 
      contentContainerStyle={AssetsStyles.pieScrollContainer} 
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled={true}
    >
      <View style={AssetsStyles.pieChartCard}>
        <View style={AssetsStyles.pieHeaderSection}>
          <View>
            <Text style={AssetsStyles.pieTitle}>📊 {t("distribution")}</Text>
            <Text style={AssetsStyles.pieSubtitle}>{t("pie_subtitle")}</Text>
          </View>
          <View style={AssetsStyles.pieCurrencyBadge}>
            <Text style={AssetsStyles.pieCurrencyFlag}>{userFlag}</Text>
            <Text style={AssetsStyles.pieCurrencyText}>{userCurrency}</Text>
          </View>
        </View>

        <TouchableWithoutFeedback onPress={() => setSelectedSlice(null)}>
          <View style={AssetsStyles.pieChartContainer}>
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
              <View style={AssetsStyles.pieCenterTotal}>
                <Text style={AssetsStyles.pieTotalLabel}>{t("total")}</Text>
                <View style={AssetsStyles.pieTotalValueContainer}>
                  <Text style={AssetsStyles.pieTotalFlag}>{userFlag}</Text>
                  <Text
                    style={[
                      AssetsStyles.pieTotalValue,
                      { fontSize: getAdaptiveFontSize(total) },
                    ]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {total.toLocaleString("it-IT", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Text>
                </View>
                <Text style={AssetsStyles.pieTotalCurrency}>{userCurrency}</Text>
              </View>
            )}

            {selectedSlice !== null && (
              <View style={AssetsStyles.pieCenterTooltip}>
                <TouchableOpacity
                  style={AssetsStyles.pieCloseButton}
                  onPress={() => setSelectedSlice(null)}
                >
                  <Text style={AssetsStyles.pieCloseIcon}>✕</Text>
                </TouchableOpacity>
                <View
                  style={[
                    AssetsStyles.pieColorIndicator,
                    { backgroundColor: chartData[selectedSlice].color },
                  ]}
                />
                <Text style={AssetsStyles.pieTooltipName}>
                  {chartData[selectedSlice].name}
                </Text>
                <Text style={AssetsStyles.pieTooltipPercent}>
                  {chartData[selectedSlice].percentage}%
                </Text>
                <Text style={AssetsStyles.pieTooltipValue}>
                  {userFlag}{" "}
                  {parseFloat(chartData[selectedSlice].y).toLocaleString("it-IT", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Text>
                <Text style={AssetsStyles.pieTooltipCurrency}>{userCurrency}</Text>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>

      <View style={AssetsStyles.pieLegendContainer}>
        <Text style={AssetsStyles.pieLegendTitle}>📋 {t("categories")}</Text>
        {chartData.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              AssetsStyles.pieLegendItem,
              selectedSlice === index && AssetsStyles.pieLegendItemSelected,
            ]}
            onPress={() => handleSlicePress(index)}
          >
            <View style={AssetsStyles.pieLegendLeft}>
              <View
                style={[AssetsStyles.pieLegendColorBox, { backgroundColor: item.color }]}
              />
              <View style={AssetsStyles.pieLegendTextContainer}>
                <Text style={AssetsStyles.pieLegendText}>{item.name}</Text>
                <Text style={AssetsStyles.pieLegendPercentage}>{item.percentage}%</Text>
              </View>
            </View>
            <View style={AssetsStyles.pieLegendRight}>
              <Text style={AssetsStyles.pieLegendValue}>
                {userFlag}{" "}
                {parseFloat(item.y).toLocaleString("it-IT", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
              <Text style={AssetsStyles.pieLegendCurrency}>{userCurrency}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default AssetsPieChart;