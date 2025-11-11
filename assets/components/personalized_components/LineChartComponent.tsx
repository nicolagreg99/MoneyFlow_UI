import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import {
  VictoryChart,
  VictoryLine,
  VictoryArea,
  VictoryAxis,
  VictoryScatter,
} from "victory-native";
import { getCurrencyFlag } from "./CurrencyPicker";

const { width } = Dimensions.get("window");

interface Props {
  labels: string[];
  entrate: number[];
  spese: number[];
  currency?: string;
}

const LineChartComponent: React.FC<Props> = ({ 
  labels, 
  entrate, 
  spese, 
  currency = "EUR" 
}) => {
  // Formatta le label in formato MM/YY
  const formatLabel = (label: string) => {
    const mesi: { [key: string]: string } = {
      "january": "01", "february": "02", "march": "03", "april": "04",
      "may": "05", "june": "06", "july": "07", "august": "08",
      "september": "09", "october": "10", "november": "11", "december": "12"
    };
    
    const parts = label.toLowerCase().split(" ");
    if (parts.length === 2) {
      const mese = mesi[parts[0]] || parts[0];
      const anno = parts[1].slice(-2);
      return `${mese}/${anno}`;
    }
    return label;
  };

  const dataEntrate = labels.map((l, i) => ({ 
    x: formatLabel(l), 
    y: entrate[i] || 0
  }));
  
  const dataSpese = labels.map((l, i) => ({ 
    x: formatLabel(l), 
    y: spese[i] || 0
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>📊 Andamento Finanziario</Text>
          <Text style={styles.subtitle}>Ultimi 12 mesi</Text>
        </View>
        <View style={styles.currencyBadge}>
          <Text style={styles.currencyFlag}>{getCurrencyFlag(currency)}</Text>
          <Text style={styles.currencyText}>{currency}</Text>
        </View>
      </View>

      {/* Legenda moderna in alto */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#10b981" }]} />
          <Text style={styles.legendText}>Entrate</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#ef4444" }]} />
          <Text style={styles.legendText}>Spese</Text>
        </View>
      </View>

      <VictoryChart
        width={width - 48}
        height={280}
        domainPadding={{ x: 25, y: 20 }}
        padding={{ top: 10, bottom: 50, left: 38, right: 20 }}
      >
        {/* Asse Y */}
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: "transparent" },
            tickLabels: { 
              fontSize: 9, 
              fill: "#64748b",
              fontWeight: "500"
            },
            grid: { 
              stroke: "#e2e8f0", 
              strokeWidth: 1,
              strokeDasharray: "3,3"
            },
          }}
          tickFormat={(t) => `${t}`}
        />

        {/* Asse X */}
        <VictoryAxis
          style={{
            axis: { stroke: "#e2e8f0", strokeWidth: 1 },
            tickLabels: {
              fontSize: 9,
              angle: -45,
              padding: 10,
              fill: "#64748b",
              fontWeight: "500",
              textAnchor: "end"
            },
          }}
        />

        {/* Area Entrate - verde moderno */}
        <VictoryArea
          data={dataEntrate}
          style={{
            data: {
              fill: "rgba(16, 185, 129, 0.15)",
            },
          }}
        />

        {/* Linea Entrate */}
        <VictoryLine
          data={dataEntrate}
          style={{
            data: {
              stroke: "#10b981",
              strokeWidth: 2.5,
            },
          }}
        />

        {/* Punti Entrate */}
        <VictoryScatter
          data={dataEntrate}
          size={3.5}
          style={{
            data: {
              fill: "#10b981",
              stroke: "#fff",
              strokeWidth: 2
            },
          }}
        />

        {/* Area Spese - rosso moderno */}
        <VictoryArea
          data={dataSpese}
          style={{
            data: {
              fill: "rgba(239, 68, 68, 0.15)",
            },
          }}
        />

        {/* Linea Spese */}
        <VictoryLine
          data={dataSpese}
          style={{
            data: {
              stroke: "#ef4444",
              strokeWidth: 2.5,
            },
          }}
        />

        {/* Punti Spese */}
        <VictoryScatter
          data={dataSpese}
          size={3.5}
          style={{
            data: {
              fill: "#ef4444",
              stroke: "#fff",
              strokeWidth: 2
            },
          }}
        />
      </VictoryChart>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "500",
  },
  currencyBadge: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  currencyFlag: {
    fontSize: 16,
  },
  currencyText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
    gap: 24,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 13,
    color: "#475569",
    fontWeight: "600",
  },
});

export default LineChartComponent;