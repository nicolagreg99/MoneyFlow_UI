import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

interface Props {
  labels: string[];
  entrate: number[];
  spese: number[];
}

const LineChartComponent: React.FC<Props> = ({ labels, entrate, spese }) => {
  const filteredLabels = labels.map((label, index) => (index % 2 === 0 ? label : ''));

  return (
    <View style={{ marginBottom: 30 }}>
      <Text style={{ textAlign: 'center', marginBottom: 10, fontSize: 18, fontWeight: 'bold' }}>
        Entrate vs Spese (Ultimi 12 mesi)
      </Text>
      <LineChart
        data={{
          labels: filteredLabels,
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
          legend: [], 
        }}
        width={Dimensions.get("window").width - 40}
        height={350} 
        yAxisLabel="€"
        yAxisInterval={1}
        chartConfig={{
          backgroundGradientFrom: "#2c3e50",
          backgroundGradientTo: "#34495e",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          propsForLabels: {
            fontSize: 8, 
            rotation: -45,
            dx: -10,
            dy: 20, 
          },
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
          marginTop: 10, 
        }}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
          <View style={{ width: 10, height: 10, backgroundColor: '#2ecc71', marginRight: 5 }} />
          <Text style={{ color: '#2C3E50', fontSize: 14 }}>Entrate</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 10, height: 10, backgroundColor: '#e74c3c', marginRight: 5 }} />
          <Text style={{ color: '#2C3E50', fontSize: 14 }}>Spese</Text>
        </View>
      </View>
    </View>
  );
};

export default LineChartComponent;