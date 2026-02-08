import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Feather } from "@expo/vector-icons";
import ExpensesStyles from "../../styles/Expenses_style";
import { useTranslation } from "react-i18next";

const DateRangePicker = ({ fromDate, setFromDate, toDate, setToDate }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const fixDate = (date) => {
    const correctedDate = new Date(date);
    correctedDate.setHours(12, 0, 0, 0);
    return correctedDate;
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${day}/${month}/${year}`;
  };

  const handleFromDateChange = (event, selectedDate) => {
    if (selectedDate) setFromDate(fixDate(selectedDate));
    setShowFromPicker(false);
  };

  const handleToDateChange = (event, selectedDate) => {
    if (selectedDate) setToDate(fixDate(selectedDate));
    setShowToPicker(false);
  };

  return (
    <View style={ExpensesStyles.accordionContainer}>
      <TouchableOpacity
        style={ExpensesStyles.accordionHeader}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Feather name="calendar" size={20} color="#3498DB" style={{ marginRight: 8 }} />
          <Text style={ExpensesStyles.accordionTitle}> {t("select_interval_date")}</Text>
        </View>
        <Feather
          name={expanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="#3498DB"
        />
      </TouchableOpacity>

      {expanded && (
        <View style={ExpensesStyles.datePickerContainer}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
            <TouchableOpacity
              style={[ExpensesStyles.datePickerBox, { flex: 1 }]}
              onPress={() => setShowFromPicker(true)}
              activeOpacity={0.7}
            >
              <Feather name="arrow-right-circle" size={18} color="#3498DB" />
              <Text style={ExpensesStyles.dateText}> {formatDate(fromDate)}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[ExpensesStyles.datePickerBox, { flex: 1 }]}
              onPress={() => setShowToPicker(true)}
              activeOpacity={0.7}
            >
              <Feather name="arrow-left-circle" size={18} color="#3498DB" />
              <Text style={ExpensesStyles.dateText}> {formatDate(toDate)}</Text>
            </TouchableOpacity>
          </View>

          {showFromPicker && (
            <DateTimePicker
              value={fromDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleFromDateChange}
            />
          )}

          {showToPicker && (
            <DateTimePicker
              value={toDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleToDateChange}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default DateRangePicker;
