import React, { useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, Alert, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import MainStyles from '../styles/Main_style';
import LineChartComponent from './personalized_components/LineChartComponent';
import StatsWidget from './personalized_components/StatsWidget';
import MonthlyBalanceTable from './personalized_components/MonthlyBalanceTable';
import API from "../../config/api";

const API_SPESA = `${API.BASE_URL}/api/v1/expenses/total_by_month`;
const API_ENTRATE = `${API.BASE_URL}/api/v1/incomes/total_by_month`;
const API_BILANCIO = `${API.BASE_URL}/api/v1/balances/total_by_month`;

const MainPage = () => {
  const [spese, setSpese] = useState<number[]>([]);
  const [entrate, setEntrate] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [balances, setBalances] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const getLast12Months = () => {
    const mesi = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
    const oggi = new Date();
    let mesiDinamici: string[] = [];

    for (let i = 11; i >= 0; i--) {
      let data = new Date(oggi.getFullYear(), oggi.getMonth() - i, 1);
      mesiDinamici.push(`${mesi[data.getMonth()]} ${data.getFullYear()}`);
    }
    return mesiDinamici;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert("Sessione scaduta", "Effettua nuovamente il login.");
        navigation.navigate("Login");
        return;
      }

      const headers = { "x-access-token": token };

      const [speseRes, entrateRes, balanceRes] = await Promise.all([
        fetch(API_SPESA, { headers }),
        fetch(API_ENTRATE, { headers }),
        fetch(API_BILANCIO, { headers })
      ]);

      if (speseRes.status === 401 || entrateRes.status === 401 || balanceRes.status === 401) {
        Alert.alert("Sessione scaduta", "Effettua nuovamente il login.");
        await AsyncStorage.removeItem('authToken');
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
      const speseMapped = mesiDinamici.map(mese => speseData[mese] || 0);
      const entrateMapped = mesiDinamici.map(mese => entrateData[mese] || 0);

      setLabels(mesiDinamici);
      setSpese(speseMapped);
      setEntrate(entrateMapped);
      setBalances(balanceData);
    } catch (error: any) {
      Alert.alert("Errore", error.message);
      console.error(error);
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
      <View style={MainStyles.container}>
        <ActivityIndicator size="large" color="#3498DB" />
      </View>
    );
  }

  const data = [
    {
      key: 'widgets',
      component: (
        <View style={MainStyles.section}>
          <Text style={MainStyles.widgetTitle}>📌 Riepilogo Annuale</Text>
          <View style={MainStyles.widgetsContainer}>
            <StatsWidget
              title="Totale Entrate"
              value={`€${entrate.reduce((a, b) => a + b, 0).toFixed(2)}`}
              icon="📊"
            />
            <StatsWidget
              title="Totale Spese"
              value={`€${spese.reduce((a, b) => a + b, 0).toFixed(2)}`}
              icon="💰"
            />
            <StatsWidget
              title="Bilancio Netto"
              value={`€${(entrate.reduce((a, b) => a + b, 0) - spese.reduce((a, b) => a + b, 0)).toFixed(2)}`}
              icon="📈"
            />
          </View>
        </View>
      ),
    },
    {
      key: 'chart',
      component: (
        <View style={MainStyles.section}>
          <LineChartComponent labels={labels} entrate={entrate} spese={spese} />
        </View>
      ),
    },
    {
      key: 'table',
      component: (
        <View style={MainStyles.section}>
          <MonthlyBalanceTable
            balances={labels.map(mese => ({
              mese,
              entrate: entrate[labels.indexOf(mese)] || 0,
              spese: spese[labels.indexOf(mese)] || 0,
              valore: (entrate[labels.indexOf(mese)] || 0) - (spese[labels.indexOf(mese)] || 0),
            }))}
          />
        </View>
      ),
    }
  ];

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <View style={{ marginBottom: 20 }}>{item.component}</View>}
      keyExtractor={item => item.key}
      contentContainerStyle={MainStyles.container}
    />
  );
};

export default MainPage;
