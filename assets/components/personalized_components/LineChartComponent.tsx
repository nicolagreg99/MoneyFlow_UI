import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

interface Props {
  labels: string[];
  entrate: number[];
  spese: number[];
}

const LineChartComponent: React.FC<Props> = ({ labels, entrate, spese }) => {
  const formattedLabels = labels.map(label => {
    const [mese, anno] = label.split(' ');
    return `${mese.slice(0, 3)} '${anno.slice(-2)}`;
  });

  const chartWidth = Dimensions.get('window').width - 40;

  // 🔹 Calcola il massimo valore tra entrate e spese
  const maxVal = Math.max(...entrate, ...spese);

  // 🔹 Arrotonda al multiplo di 500 superiore
  const roundedMax = Math.ceil(maxVal / 500) * 500;

  // 🔹 Numero di segmenti = quante volte 500 entra nel max
  const numberOfSegments = roundedMax / 500;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📈 Andamento Entrate e Spese</Text>

      <View>
        <LineChart
          data={{
            labels: [],
            datasets: [
              {
                data: entrate,
                color: (opacity = 1) => `rgba(39, 174, 96, ${opacity})`,
                strokeWidth: 2,
              },
              {
                data: spese,
                color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`,
                strokeWidth: 2,
              },
            ],
          }}
          width={chartWidth}
          height={330}
          fromZero
          yAxisLabel="€"
          yAxisInterval={1}
          segments={numberOfSegments}
          chartConfig={{
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`,
            propsForDots: {
              r: '3',
              strokeWidth: '1',
              stroke: '#fff',
            },
            propsForLabels: {
              fontSize: 10,
            },
          }}
          bezier
          style={styles.chart}
        />

        {/* Etichette asse X verticali */}
        <View style={[styles.customLabelsContainer, { width: chartWidth }]}>
          {formattedLabels.map((label, i) => (
            <Text
              key={i}
              style={[
                styles.rotatedLabel,
                {
                  left: i * ((chartWidth - 64) / (formattedLabels.length - 1)) + 32,
                },
              ]}
            >
              {label}
            </Text>
          ))}
        </View>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#27ae60' }]} />
          <Text style={styles.legendLabel}>Entrate</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#e74c3c' }]} />
          <Text style={styles.legendLabel}>Spese</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 10 },
  title: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  chart: {
    paddingTop: 10,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: '#fff',
  },
  customLabelsContainer: {
    position: 'absolute',
    top: 300,
    flexDirection: 'row',
    height: 40,
  },
  rotatedLabel: {
    position: 'absolute',
    transform: [{ rotate: '90deg' }],
    fontSize: 10,
    color: '#2c3e50',
    textAlign: 'left',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendLabel: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },
});

export default LineChartComponent;
