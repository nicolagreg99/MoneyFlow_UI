import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';
import ExpensesStyles from '../../styles/Expenses_style';

const DateRangePicker = ({ fromDate, setFromDate, toDate, setToDate }) => {
  const [expanded, setExpanded] = useState(false);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const fixDate = (date) => {
    const correctedDate = new Date(date);
    correctedDate.setHours(12, 0, 0, 0); // Evita ambiguità a mezzanotte
    return correctedDate;
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
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
      {/* HEADER DEL FILTRO */}
      <TouchableOpacity
        style={ExpensesStyles.accordionHeader}
        onPress={() => setExpanded(!expanded)}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Feather name="calendar" size={20} color="#555" style={{ marginRight: 8 }} />
          <Text style={ExpensesStyles.accordionTitle}>Seleziona Date</Text>
        </View>
        {expanded ? (
          <Feather name="chevron-up" size={20} color="#555" />
        ) : (
          <Feather name="chevron-down" size={20} color="#555" />
        )}
      </TouchableOpacity>

      {/* CONTENITORE DATE */}
      {expanded && (
        <View style={ExpensesStyles.datePickerContainer}>
          {/* DATA INIZIO */}
          <Text style={ExpensesStyles.datePickerLabel}>Data Inizio</Text>
          <TouchableOpacity
            style={ExpensesStyles.datePickerBox}
            onPress={() => setShowFromPicker(true)}
          >
            <Text style={ExpensesStyles.dateText}>{formatDate(fromDate)}</Text>
          </TouchableOpacity>

          {showFromPicker && (
            <DateTimePicker
              value={fromDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleFromDateChange}
            />
          )}

          {/* DATA FINE */}
          <Text style={ExpensesStyles.datePickerLabel}>Data Fine</Text>
          <TouchableOpacity
            style={ExpensesStyles.datePickerBox}
            onPress={() => setShowToPicker(true)}
          >
            <Text style={ExpensesStyles.dateText}>{formatDate(toDate)}</Text>
          </TouchableOpacity>

          {showToPicker && (
            <DateTimePicker
              value={toDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleToDateChange}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default DateRangePicker;
