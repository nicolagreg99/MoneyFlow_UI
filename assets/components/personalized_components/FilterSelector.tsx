import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../../config/api";
import { useTranslation } from "react-i18next";

interface FilterSelectorProps {
  selectedFilters: string[];
  setSelectedFilters: (filters: string[]) => void;
  filterType: "entrate" | "uscite";
}

const FilterSelector: React.FC<FilterSelectorProps> = ({
  selectedFilters,
  setSelectedFilters,
  filterType,
}) => {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [filterOptions, setFilterOptions] = useState<string[]>([]);
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
        console.error(t("fetch_error"), error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [filterType]);

  const toggleFilter = (filter: string) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter((f) => f !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  const getFilterLabel = () => {
    if (selectedFilters.length === 0) {
      return t("category") || "Categoria";
    }
    if (selectedFilters.length === 1) {
      return selectedFilters[0];
    }
    return `${selectedFilters.length} ${t("categories_selected") || "categorie selezionate"}`;
  };

  // Funzione che assegna un'icona in base al nome della categoria
  const getCategoryIcon = (categoryName: string): string => {
    const name = categoryName.toLowerCase();
    
    // Mappa di parole chiave -> icone
    const iconMap: { [key: string]: string } = {
      // Abbigliamento
      "vestiti": "checkroom",
      "abbigliamento": "checkroom",
      "scarpe": "checkroom",
      "clothes": "checkroom",
      
      // Regali
      "regalo": "card-giftcard",
      "regali": "card-giftcard",
      "gift": "card-giftcard",
      
      // Cibo e bevande
      "cibo": "restaurant",
      "food": "restaurant",
      "ristorante": "restaurant",
      "bar": "local-bar",
      "caffè": "local-cafe",
      "spesa": "local-grocery-store",
      "supermercato": "local-grocery-store",
      "grocery": "local-grocery-store",
      
      // Trasporti
      "trasport": "directions-car",
      "auto": "directions-car",
      "car": "directions-car",
      "benzina": "local-gas-station",
      "gas": "local-gas-station",
      "treno": "train",
      "train": "train",
      "aereo": "flight",
      "flight": "flight",
      "bus": "directions-bus",
      
      // Casa
      "casa": "home",
      "home": "home",
      "affitto": "home",
      "rent": "home",
      "bollette": "receipt",
      "utenze": "receipt",
      "utilities": "receipt",
      
      // Salute
      "salute": "local-hospital",
      "health": "local-hospital",
      "medic": "medical-services",
      "farmacia": "local-pharmacy",
      "pharmacy": "local-pharmacy",
      
      // Intrattenimento
      "intrattenimento": "movie",
      "entertainment": "movie",
      "cinema": "movie",
      "musica": "music-note",
      "music": "music-note",
      "sport": "fitness-center",
      "palestra": "fitness-center",
      "gym": "fitness-center",
      
      // Tecnologia
      "tecnologia": "devices",
      "tech": "devices",
      "elettronica": "devices",
      "electronics": "devices",
      
      // Istruzione
      "scuola": "school",
      "school": "school",
      "università": "school",
      "university": "school",
      "corso": "menu-book",
      "libri": "menu-book",
      "books": "menu-book",
      
      // Entrate
      "stipendio": "payments",
      "salary": "payments",
      "lavoro": "work",
      "work": "work",
      "investimenti": "trending-up",
      "investment": "trending-up",
      "dividendi": "account-balance",
      "dividend": "account-balance",
      "bonus": "star",
      "freelance": "work-outline",
      
      // Altro
      "extra": "more-horiz",
      "altro": "more-horiz",
      "other": "more-horiz",
      "varie": "category",
      "misc": "category",
      "abbonament": "subscriptions",
      "subscription": "subscriptions",
      "assicuraz": "shield",
      "insurance": "shield",
      "tasse": "account-balance",
      "tax": "account-balance",
      "shopping": "shopping-bag",
      "bellezza": "face",
      "beauty": "face",
      "animali": "pets",
      "pets": "pets",
      "viaggio": "luggage",
      "travel": "luggage",
      "vacanza": "beach-access",
      "vacation": "beach-access",
    };

    // Cerca una corrispondenza parziale nel nome della categoria
    for (const [keyword, icon] of Object.entries(iconMap)) {
      if (name.includes(keyword)) {
        return icon;
      }
    }

    // Icona di default basata sul tipo
    return filterType === "entrate" ? "trending-up" : "shopping-cart";
  };

  const renderFilterItem = ({ item }: { item: string }) => {
    const isSelected = selectedFilters.includes(item);
    const iconName = getCategoryIcon(item);

    return (
      <TouchableOpacity
        style={styles.filterOptionRow}
        onPress={() => toggleFilter(item)}
        activeOpacity={0.7}
      >
        <View style={styles.filterOptionContent}>
          <View style={styles.filterIconContainer}>
            <MaterialIcons
              name={iconName as any}
              size={24}
              color={isSelected ? "#3498DB" : "#7F8C8D"}
            />
          </View>
          <View style={styles.filterTextContainer}>
            <Text style={styles.filterCategoryName}>{item}</Text>
          </View>
          {isSelected && (
            <Feather name="check-circle" size={22} color="#3498DB" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.filterPickerButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Feather
            name="filter"
            size={18}
            color="#3498DB"
            style={{ marginRight: 8 }}
          />
          <Text
            style={[
              styles.filterPickerText,
              selectedFilters.length === 0 && styles.placeholderText,
            ]}
          >
            {getFilterLabel()}
          </Text>
        </View>
        <Feather name="chevron-right" size={18} color="#3498DB" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {filterType === "entrate"
                ? t("income_categories") || "Categorie entrate"
                : t("expense_categories") || "Categorie uscite"}
            </Text>

            {loading ? (
              <ActivityIndicator size="large" color="#3498DB" />
            ) : filterOptions.length === 0 ? (
              <View style={styles.emptyStateContainer}>
                <MaterialIcons name="category" size={48} color="#D1D5DB" />
                <Text style={styles.noCategoriesText}>
                  {t("no_categories_available") || "Nessuna categoria disponibile"}
                </Text>
              </View>
            ) : (
              <FlatList
                data={filterOptions}
                keyExtractor={(item) => item}
                renderItem={renderFilterItem}
              />
            )}

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalCloseText}>{t("close") || "Chiudi"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const PRIMARY = "#2C3E50";
const ACCENT = "#3498DB";
const SURFACE = "#FFFFFF";
const PLACEHOLDER = "#95A5A6";

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },

  filterPickerButton: {
    backgroundColor: SURFACE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D6E0F0",
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },

  filterPickerText: {
    fontSize: 16,
    color: PRIMARY,
    fontWeight: "500",
    flex: 1,
  },

  placeholderText: {
    color: PLACEHOLDER,
    fontWeight: "400",
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },

  modalContainer: {
    backgroundColor: SURFACE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: PRIMARY,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },

  filterOptionRow: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },

  filterOptionContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  filterIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F5F7FB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  filterTextContainer: {
    flex: 1,
  },

  filterCategoryName: {
    fontSize: 16,
    fontWeight: "700",
    color: PRIMARY,
  },

  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },

  noCategoriesText: {
    textAlign: "center",
    marginTop: 12,
    fontSize: 15,
    color: PLACEHOLDER,
    fontStyle: "italic",
  },

  modalCloseButton: {
    marginTop: 16,
    marginHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: ACCENT,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  modalCloseText: {
    fontSize: 16,
    fontWeight: "700",
    color: SURFACE,
  },
});

export default FilterSelector;