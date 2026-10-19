import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Dimensions, LayoutChangeEvent } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { getCurrencyFlag } from "./CurrencyPicker";
import { useTranslation } from "react-i18next";

const SCREEN_WIDTH = Dimensions.get("window").width;

const COLORS = {
  income: "#10b981",
  expense: "#f43f5e",
  grid: "#eef2f7",
  axisText: "#94a3b8",
  title: "#0f172a",
  subtitle: "#64748b",
  strip: "#cbd5e1",
};

const Y_LABEL_WIDTH = 38;
const SECTIONS = 4;
const LABEL_MIN_GAP = 34; // spazio orizzontale minimo tra due etichette (px)

const EN_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface Props {
  months: string[]; // "YYYY-MM", in ordine cronologico
  entrate: number[];
  spese: number[];
  currency?: string;
  subtitle?: string;
}

const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

const monthName = (monthIdx: number, locale: string, style: "short" | "long") => {
  try {
    const name = new Date(2000, monthIdx, 1).toLocaleDateString(locale, { month: style });
    return capitalize(name.replace(".", ""));
  } catch {
    return EN_SHORT[monthIdx];
  }
};

const parseYM = (ym: string) => {
  const [y, m] = ym.split("-");
  const year = parseInt(y, 10);
  const monthIdx = parseInt(m, 10) - 1;
  if (isNaN(year) || isNaN(monthIdx) || monthIdx < 0 || monthIdx > 11) return null;
  return { monthIdx, year };
};

const formatMoney = (v: number) =>
  v.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatCompact = (v: number) => {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (v >= 1000) return `${(v / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return `${Math.round(v)}`;
};

const niceMax = (rawMax: number, sections: number) => {
  if (rawMax <= 0) return sections * 25;
  const rawStep = rawMax / sections;
  const pow = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const n = rawStep / pow;
  const niceN = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
  return niceN * pow * sections;
};

const LineChartComponent: React.FC<Props> = ({
  months,
  entrate,
  spese,
  currency = "EUR",
  subtitle,
}) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || "it";

  const [innerWidth, setInnerWidth] = useState(SCREEN_WIDTH - 72);
  const onLayout = (e: LayoutChangeEvent) => {
    const w = Math.floor(e.nativeEvent.layout.width);
    if (w > 0 && w !== innerWidth) setInnerWidth(w);
  };

  const plotWidth = innerWidth - Y_LABEL_WIDTH;
  const initialSpacing = 12;
  const endSpacing = 12;

  // Niente minimo fisso: i punti devono sempre stare nel contenitore
  const spacing = Math.max(
    4,
    (plotWidth - initialSpacing - endSpacing) / Math.max(months.length - 1, 1)
  );

  const { dataIncome, dataExpense, maxValue } = useMemo(() => {
    const n = months.length;
    // Mostra un'etichetta ogni `step` punti, partendo dall'ultimo mese
    const step = Math.max(1, Math.ceil(LABEL_MIN_GAP / spacing));
    const firstShown = (n - 1) % step;

    const labelStyle = {
      color: COLORS.axisText,
      fontSize: 10,
      fontWeight: "500" as const,
      textAlign: "center" as const,
      width: 36,
    };

    const build = (values: number[]) =>
      months.map((ym, i) => {
        const parsed = parseYM(ym);
        let label = "";
        let title = ym;

        if (parsed) {
          title = `${monthName(parsed.monthIdx, locale, "long")} ${parsed.year}`;
          const shown = (n - 1 - i) % step === 0;
          if (shown) {
            label = monthName(parsed.monthIdx, locale, "short");
            // Anno sotto il mese per la prima etichetta visibile e per gennaio
            if (i === firstShown || parsed.monthIdx === 0) {
              label = `${label}\n${String(parsed.year).slice(-2)}`;
            }
          }
        }

        return {
          value: Number(values[i]) || 0,
          label,
          labelTextStyle: labelStyle,
          tooltipTitle: title,
        };
      });

    const inc = build(entrate);
    const exp = build(spese);
    const peak = Math.max(0, ...inc.map((d) => d.value), ...exp.map((d) => d.value));

    return { dataIncome: inc, dataExpense: exp, maxValue: niceMax(peak, SECTIONS) };
  }, [months, entrate, spese, locale, spacing]);

  const renderTooltip = (items: any[]) => {
    const inc = items?.[0];
    const exp = items?.[1];
    if (!inc) return null;
    const net = (inc.value || 0) - (exp?.value || 0);

    return (
      <View style={styles.tooltip}>
        <Text style={styles.tooltipTitle}>{inc.tooltipTitle}</Text>

        <View style={styles.tooltipRow}>
          <View style={[styles.tooltipDot, { backgroundColor: COLORS.income }]} />
          <Text style={styles.tooltipLabel}>{t("incomes")}</Text>
          <Text style={styles.tooltipValue}>{formatMoney(inc.value || 0)}</Text>
        </View>

        <View style={styles.tooltipRow}>
          <View style={[styles.tooltipDot, { backgroundColor: COLORS.expense }]} />
          <Text style={styles.tooltipLabel}>{t("expenses")}</Text>
          <Text style={styles.tooltipValue}>{formatMoney(exp?.value || 0)}</Text>
        </View>

        <View style={styles.tooltipDivider} />

        <View style={styles.tooltipRow}>
          <Text style={[styles.tooltipLabel, { marginLeft: 0 }]}>{t("net_balance")}</Text>
          <Text
            style={[
              styles.tooltipValue,
              { color: net >= 0 ? COLORS.income : COLORS.expense },
            ]}
          >
            {net >= 0 ? "+" : ""}
            {formatMoney(net)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{t("financial_trend")}</Text>
          {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        <View style={styles.currencyBadge}>
          <Text style={styles.currencyFlag}>{getCurrencyFlag(currency)}</Text>
          <Text style={styles.currencyText}>{currency}</Text>
        </View>
      </View>

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.income }]} />
          <Text style={styles.legendText}>{t("incomes")}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.expense }]} />
          <Text style={styles.legendText}>{t("expenses")}</Text>
        </View>
      </View>

      <View onLayout={onLayout} style={styles.chartWrapper}>
        <LineChart
          data={dataIncome}
          data2={dataExpense}
          width={plotWidth}
          height={190}
          spacing={spacing}
          initialSpacing={initialSpacing}
          endSpacing={endSpacing}
          disableScroll
          curved
          curvature={0.2}
          thickness={2.5}
          color1={COLORS.income}
          color2={COLORS.expense}
          hideDataPoints
          areaChart
          startFillColor={COLORS.income}
          endFillColor={COLORS.income}
          startOpacity={0.22}
          endOpacity={0.01}
          startFillColor2={COLORS.expense}
          endFillColor2={COLORS.expense}
          startOpacity2={0.18}
          endOpacity2={0.01}
          maxValue={maxValue}
          noOfSections={SECTIONS}
          yAxisLabelWidth={Y_LABEL_WIDTH}
          yAxisThickness={0}
          xAxisThickness={1}
          xAxisColor={COLORS.grid}
          yAxisTextStyle={styles.axisText}
          formatYLabel={(label: string) => formatCompact(Number(label))}
          xAxisLabelsVerticalShift={4}
          rulesType="solid"
          rulesColor={COLORS.grid}
          isAnimated
          animationDuration={700}
          pointerConfig={{
            activatePointersOnLongPress: true,
            autoAdjustPointerLabelPosition: true,
            pointerStripUptoDataPoint: true,
            pointerStripColor: COLORS.strip,
            pointerStripWidth: 1.5,
            strokeDashArray: [4, 4],
            pointerColor: "#334155",
            radius: 5,
            pointerLabelWidth: 170,
            pointerLabelHeight: 110,
            pointerLabelComponent: renderTooltip,
          }}
        />
      </View>

      <Text style={styles.hint}>
        {t("hold_for_details", { defaultValue: "Tieni premuto sul grafico per i dettagli" })}
      </Text>
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
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.title,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.subtitle,
    fontWeight: "500",
  },
  currencyBadge: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  currencyFlag: { fontSize: 15 },
  currencyText: { fontSize: 12, fontWeight: "700", color: "#475569" },

  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.subtitle,
    fontWeight: "600",
  },

  chartWrapper: {
    width: "100%",
    overflow: "visible",
    paddingTop: 8,
  },
  axisText: {
    color: COLORS.axisText,
    fontSize: 10,
    fontWeight: "500",
  },
  hint: {
    textAlign: "center",
    fontSize: 11,
    color: COLORS.axisText,
    marginTop: 12,
  },

  tooltip: {
    backgroundColor: "#0f172a",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: 170,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  tooltipTitle: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
  },
  tooltipRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  tooltipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  tooltipLabel: {
    flex: 1,
    marginLeft: 6,
    color: "#cbd5e1",
    fontSize: 11,
  },
  tooltipValue: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  tooltipDivider: {
    height: 1,
    backgroundColor: "#334155",
    marginVertical: 5,
  },
});

export default LineChartComponent;