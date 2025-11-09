import React from "react";
import { View, Text, Dimensions, ScrollView } from "react-native";
import { PieChart } from "react-native-chart-kit";
import ExpensesStyles from "../../styles/Expenses_style";
import { getCurrencyFlag } from "./CurrencyPicker";

const screenWidth = Dimensions.get("window").width;

const PieChartGraph = ({ data, total, userCurrency = "EUR" }) => {
  const userFlag = getCurrencyFlag(userCurrency);

  return (
    <View style={ExpensesStyles.chartWrapper}>
      <ScrollView contentContainerStyle={ExpensesStyles.chartScrollContainer}>
        <View style={ExpensesStyles.chartContainer}>
          <PieChart
            data={data}
            width={screenWidth * 0.8}
            height={250}
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              strokeWidth: 2,
            }}
            accessor="value"
            backgroundColor="transparent"
            hasLegend={false}
            center={[screenWidth * 0.2, 0]}
          />
        </View>

        <View style={ExpensesStyles.legendContainer}>
          {data.map((item, index) => (
            <View key={index} style={ExpensesStyles.legendItem}>
              <View
                style={[ExpensesStyles.colorBox, { backgroundColor: item.color }]}
              />
              <Text style={ExpensesStyles.legendText}>
                {item.name}:{" "}
                {userFlag}{" "}
                {parseFloat(item.value).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                {userCurrency}{" "}
                ({((item.value / total) * 100).toFixed(1)}%)
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default PieChartGraph;
