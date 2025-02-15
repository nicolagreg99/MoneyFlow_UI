import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ChevronDown, ChevronUp, Calendar } from 'lucide-react-native';
import ExpensesStyles from '../../styles/Expenses_style';

const DateRangePicker = ({ fromDate, setFromDate, toDate, setToDate }) => {
  const [expanded, setExpanded] = useState(false);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const handleFromDateChange = (event, selectedDate) => {
    if (selectedDate) setFromDate(selectedDate);
    setShowFromPicker(false);
  };

  const handleToDateChange = (event, selectedDate) => {
    if (selectedDate) setToDate(selectedDate);
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
          <Calendar size={20} color="#555" style={{ marginRight: 8 }} />
          <Text style={ExpensesStyles.accordionTitle}>Seleziona Date</Text>
        </View>
        {expanded ? <ChevronUp size={20} color="#555" /> : <ChevronDown size={20} color="#555" />}
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
            <Text style={ExpensesStyles.dateText}>
              {fromDate.toISOString().split('T')[0]}
            </Text>
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
            <Text style={ExpensesStyles.dateText}>
              {toDate.toISOString().split('T')[0]}
            </Text>
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
