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
  currency: string;
}

const MonthlyBalanceTable: React.FC<MonthlyBalanceTableProps> = ({ balances, currency }) => {
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
      size={14}
      color={sortKey === key ? '#007bff' : '#ccc'}
      style={{ marginLeft: 6 }}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Bilanci Mensili</Text>

      <View style={styles.table}>
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
          renderItem={({ item, index }) => (
            <View style={[styles.row, index % 2 === 0 && styles.rowAlternate]}>
              <Text style={styles.cell}>{item.mese}</Text>
              <Text style={[styles.cell, { color: '#27ae60', textAlign: 'right' }]}>
                {currency} {item.entrate.toFixed(2)}
              </Text>
              <Text style={[styles.cell, { color: '#c0392b', textAlign: 'right' }]}>
                {currency} {item.spese.toFixed(2)}
              </Text>
              <Text
                style={[
                  styles.cell,
                  {
                    textAlign: 'right',
                    color: item.valore >= 0 ? '#27ae60' : '#c0392b',
                    fontWeight: 'bold',
                  },
                ]}
              >
                {currency} {item.valore.toFixed(2)}
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 12,
    textAlign: 'center',
    color: '#2c3e50',
  },
  table: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f4f7',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerCell: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#34495e',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderColor: '#eee',
    alignItems: 'center',
  },
  rowAlternate: {
    backgroundColor: '#fafafa',
  },
  cell: {
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default MonthlyBalanceTable;
