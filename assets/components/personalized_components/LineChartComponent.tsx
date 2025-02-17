import React from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

interface Props {
  labels: string[];
  entrate: number[];
  spese: number[];
}

const LineChartComponent: React.FC<Props> = ({ labels, entrate, spese }) => {
  return (
    <View>
      <Text style={{ textAlign: 'center', marginBottom: 10, fontSize: 18, fontWeight: 'bold' }}>
        Entrate vs Spese (Ultimi 12 mesi)
      </Text>
      <LineChart
        data={{
          labels: labels,
          datasets: [
            {
              data: entrate,
              color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`, // Verde (Entrate)
              strokeWidth: 2,
            },
            {
              data: spese,
              color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`, // Rosso (Spese)
              strokeWidth: 2,
            },
          ],
          legend: ["Entrate", "Spese"],
        }}
        width={Dimensions.get("window").width - 40}
        height={250}
        yAxisLabel="€"
        yAxisInterval={1}
        chartConfig={{
          backgroundGradientFrom: "#2c3e50",
          backgroundGradientTo: "#34495e",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          propsForDots: {
            r: "4",
            strokeWidth: "1",
            stroke: "#fff",
          },
        }}
        bezier
        style={{
          borderRadius: 10,
          alignSelf: "center",
        }}
      />
    </View>
  );
};

export default LineChartComponent;
