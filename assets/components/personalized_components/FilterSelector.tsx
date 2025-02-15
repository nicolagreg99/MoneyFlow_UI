import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { CheckSquare, Square } from 'lucide-react-native';
import ExpensesStyles from '../../styles/Expenses_style';

const filterOptions = ["Vestiti", "Cibo", "Extra", "Trasporto", "Regalo"];

const FilterSelector = ({ selectedFilters, setSelectedFilters }) => {
  const [modalVisible, setModalVisible] = useState(false);

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
            <Text style={ExpensesStyles.modalTitle}>Seleziona Categorie</Text>

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
