import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

type SortKey = 'mese' | 'valore' | 'entrate' | 'spese';

interface BalanceItem {
  mese: string;
  entrate: number;
  spese: number;
  valore: number;
}

interface MonthlyBalanceTableProps {
  balances: BalanceItem[];
}

const MonthlyBalanceTable: React.FC<MonthlyBalanceTableProps> = ({ balances }) => {
  const [sortedData, setSortedData] = useState<BalanceItem[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [sortKey, setSortKey] = useState<SortKey>('mese');

  useEffect(() => {
    const sorted = sortBalances(balances, sortKey, sortOrder);
    setSortedData(sorted);
  }, [balances, sortKey, sortOrder]);

  const parseDateKey = (str: string): Date => {
    const [mese, anno] = str.split(" ");
    const mesi = [
      "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
      "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
    ];
    return new Date(parseInt(anno), mesi.indexOf(mese));
  };

  const sortBalances = (data: BalanceItem[], key: SortKey, order: 'asc' | 'desc') => {
    return [...data].sort((a, b) => {
      if (key === 'mese') {
        const dateA = parseDateKey(a.mese);
        const dateB = parseDateKey(b.mese);
        return order === 'asc'
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      } else {
        return order === 'asc'
          ? a[key] - b[key]
          : b[key] - a[key];
      }
    });
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const renderSortIcon = (key: SortKey) => (
    <Icon
      name={sortKey === key ? (sortOrder === 'asc' ? 'sort-up' : 'sort-down') : 'sort'}
      size={12}
      color={sortKey === key ? '#007bff' : '#aaa'}
      style={{ marginLeft: 4 }}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bilanci Mensili (Entrate - Spese)</Text>

      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.headerCell} onPress={() => handleSort('mese')}>
          <Text style={styles.headerText}>Mese {renderSortIcon('mese')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerCell} onPress={() => handleSort('entrate')}>
          <Text style={styles.headerText}>Entrate {renderSortIcon('entrate')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerCell} onPress={() => handleSort('spese')}>
          <Text style={styles.headerText}>Spese {renderSortIcon('spese')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerCell} onPress={() => handleSort('valore')}>
          <Text style={styles.headerText}>Bilancio {renderSortIcon('valore')}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedData}
        keyExtractor={(item) => item.mese}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.cell}>{item.mese}</Text>
            <Text style={[styles.cell, { color: 'green', textAlign: 'right' }]}>€{item.entrate.toFixed(2)}</Text>
            <Text style={[styles.cell, { color: 'red', textAlign: 'right' }]}>€{item.spese.toFixed(2)}</Text>
            <Text style={[styles.cell, { textAlign: 'right', color: item.valore >= 0 ? 'green' : 'red' }]}>
              €{item.valore.toFixed(2)}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 8,   // padding sinistro
    paddingRight: 8,  // padding destro bloccato
    paddingBottom: 40,
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
    color: '#000',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#e3e3e3',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerCell: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  headerText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#007bff',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default MonthlyBalanceTable;
