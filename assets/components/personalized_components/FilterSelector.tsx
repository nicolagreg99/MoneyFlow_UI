import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import ExpensesStyles from "../../styles/Expenses_style";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../../config/api";

const FilterSelector = ({ selectedFilters, setSelectedFilters, filterType }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [filterOptions, setFilterOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) return;

        const response = await axios.get(`${API.BASE_URL}/api/v1/me`, {
          headers: { "x-access-token": token },
        });

        if (response.data) {
          setFilterOptions(
            filterType === "entrate"
              ? response.data.incomes_categories
              : response.data.expenses_categories
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
      setSelectedFilters(selectedFilters.filter((f) => f !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  return (
    <View style={ExpensesStyles.filterContainer}>
      <TouchableOpacity
        style={ExpensesStyles.filterBox}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Feather name="filter" size={18} color="#007AFF" style={{ marginRight: 8 }} />
          <Text style={ExpensesStyles.filterText}>
            {selectedFilters.length > 0
              ? selectedFilters.join(", ")
              : "Seleziona Categoria"}
          </Text>
        </View>
        <Feather name="chevron-right" size={18} color="#007AFF" />
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
              {filterType === "entrate"
                ? "Categorie di Entrata"
                : "Categorie di Spesa"}
            </Text>

            {loading ? (
              <ActivityIndicator size="large" color="#007AFF" />
            ) : (
              <FlatList
                data={filterOptions}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={ExpensesStyles.filterOptionRow}
                    onPress={() => toggleFilter(item)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        flex: 1,
                      }}
                    >
                      {selectedFilters.includes(item) ? (
                        <Feather name="check-circle" size={22} color="#007AFF" />
                      ) : (
                        <Feather name="circle" size={22} color="#ccc" />
                      )}
                      <Text style={ExpensesStyles.filterOptionText}>{item}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}

            <TouchableOpacity
              style={ExpensesStyles.modalCloseButton}
              onPress={() => setModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={ExpensesStyles.modalCloseText}>Chiudi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FilterSelector;
