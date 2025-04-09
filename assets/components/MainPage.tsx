import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import MainStyles from '../styles/Main_style';
import LineChartComponent from './personalized_components/LineChartComponent';
import StatsWidget from './personalized_components/StatsWidget';

const API_SPESA = "https://backend.money-app-api.com/api/v1/expenses/total_by_month";
const API_ENTRATE = "https://backend.money-app-api.com/api/v1/incomes/total_by_month";

const MainPage = () => {
  const [spese, setSpese] = useState<number[]>([]);
  const [entrate, setEntrate] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      console.log("Fetching data...");
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          Alert.alert("Sessione scaduta", "Effettua nuovamente il login.");
          navigation.navigate("Login");
          return;
        }

        console.log("Token retrieved:", token);
        const headers = { "x-access-token": token };
        console.log("Headers:", headers);

        const [speseRes, entrateRes] = await Promise.all([
          fetch(API_SPESA, { headers }),
          fetch(API_ENTRATE, { headers })
        ]);

        console.log("Spese Response Status:", speseRes.status);
        console.log("Entrate Response Status:", entrateRes.status);

        if (speseRes.status === 401 || entrateRes.status === 401) {
          Alert.alert("Sessione scaduta", "Effettua nuovamente il login.");
          await AsyncStorage.removeItem('authToken');
          navigation.navigate("Login");
          return;
        }

        if (!speseRes.ok || !entrateRes.ok) throw new Error("Errore nel recupero dei dati");

        const speseData = await speseRes.json();
        const entrateData = await entrateRes.json();

        console.log("Spese Data:", speseData);
        console.log("Entrate Data:", entrateData);

        const mesiDinamici = getLast12Months();
        console.log("Generated Labels:", mesiDinamici);

        const speseMapped = mesiDinamici.map(mese => speseData[mese] || 0);
        const entrateMapped = mesiDinamici.map(mese => entrateData[mese] || 0);

        console.log("Mapped Spese:", speseMapped);
        console.log("Mapped Entrate:", entrateMapped);

        setLabels(mesiDinamici);
        setSpese(speseMapped);
        setEntrate(entrateMapped);
      } catch (error) {
        Alert.alert("Errore", error.message);
        console.error(error);
      } finally {
        setLoading(false);
        console.log("Data fetching complete.");
      }
    };
    fetchData();
  }, []);

  return (
    <ScrollView contentContainerStyle={MainStyles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#3498DB" />
      ) : (
        <LineChartComponent labels={labels} entrate={entrate} spese={spese} />
      )}
      <View style={MainStyles.widgetsContainer}>
        <StatsWidget title="Totale Spese Mensili" value={`€${spese.reduce((a, b) => a + b, 0).toFixed(2)}`} icon="💰" />
        <StatsWidget title="Totale Entrate Mensili" value={`€${entrate.reduce((a, b) => a + b, 0).toFixed(2)}`} icon="📊" />
        <StatsWidget title="Bilancio Netto" value={`€${(entrate.reduce((a, b) => a + b, 0) - spese.reduce((a, b) => a + b, 0)).toFixed(2)}`} icon="📈" />
      </View>
    </ScrollView>
  );
};

export default MainPage;