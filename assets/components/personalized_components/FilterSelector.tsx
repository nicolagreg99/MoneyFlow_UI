import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, ActivityIndicator } from 'react-native';
import { CheckSquare, Square } from 'lucide-react-native';
import ExpensesStyles from '../../styles/Expenses_style';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FilterSelector = ({ selectedFilters, setSelectedFilters, filterType }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [filterOptions, setFilterOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken'); // Recupera il token salvato
        if (!token) return;

        const response = await axios.get('http://192.168.1.5:5000/api/v1/me', {
          headers: { 'x-access-token': token }
        });

        if (response.data) {
          setFilterOptions(
            filterType === "entrate" ? response.data.incomes_categories : response.data.expenses_categories
          );
        }
      } catch (error) {
        console.error("Errore nel recupero delle categorie:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [filterType]);

  const toggleFilter = (filter) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter(f => f !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  return (
    <View style={ExpensesStyles.filterContainer}>
      <TouchableOpacity 
        style={ExpensesStyles.filterBox} 
        onPress={() => setModalVisible(true)}
      >
        <Text style={ExpensesStyles.filterText}>
          {selectedFilters.length > 0 ? selectedFilters.join(', ') : "Seleziona Categoria"}
        </Text>
      </TouchableOpacity>

      <Modal 
        visible={modalVisible} 
        animationType="slide" 
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={ExpensesStyles.modalOverlay}>
          <View style={ExpensesStyles.modalContainer}>
            <Text style={ExpensesStyles.modalTitle}>
              {filterType === "entrate" ? "Seleziona Categoria di Entrata" : "Seleziona Categoria di Spesa"}
            </Text>

            {loading ? (
              <ActivityIndicator size="large" color="#16A085" />
            ) : (
              <FlatList
                data={filterOptions}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={ExpensesStyles.filterOptionRow} 
                    onPress={() => toggleFilter(item)}
                  >
                    {selectedFilters.includes(item) ? (
                      <CheckSquare size={22} color="#16A085" />
                    ) : (
                      <Square size={22} color="#666" />
                    )}
                    <Text style={ExpensesStyles.filterOptionText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            )}

            <TouchableOpacity 
              style={ExpensesStyles.modalCloseButton} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Chiudi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FilterSelector;
