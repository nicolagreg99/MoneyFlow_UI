import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ChevronDown, ChevronUp, Calendar } from 'lucide-react-native';
import ExpensesStyles from '../../styles/Expenses_style';

const DateRangePicker = ({ fromDate, setFromDate, toDate, setToDate }) => {
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={ExpensesStyles.accordionContainer}>
      <TouchableOpacity style={ExpensesStyles.accordionHeader} onPress={() => setExpanded(!expanded)}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Calendar size={20} color="#555" style={{ marginRight: 8 }} />
          <Text style={ExpensesStyles.accordionTitle}>Seleziona Date</Text>
        </View>
        {expanded ? <ChevronUp size={20} color="#555" /> : <ChevronDown size={20} color="#555" />}
      </TouchableOpacity>

      {expanded && (
        <View style={ExpensesStyles.datePickerContainer}>
          <Text style={ExpensesStyles.datePickerLabel}>Data Inizio</Text>
          <TouchableOpacity style={ExpensesStyles.datePickerBox} onPress={() => setShowFromPicker(true)}>
            <Text style={ExpensesStyles.dateText}>{fromDate.toISOString().split('T')[0]}</Text>
          </TouchableOpacity>

          {showFromPicker && (
            <DateTimePicker
              value={fromDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                if (selectedDate) setFromDate(selectedDate);
                if (Platform.OS === 'android') setShowFromPicker(false);
              }}
            />
          )}

          <Text style={ExpensesStyles.datePickerLabel}>Data Fine</Text>
          <TouchableOpacity style={ExpensesStyles.datePickerBox} onPress={() => setShowToPicker(true)}>
            <Text style={ExpensesStyles.dateText}>{toDate.toISOString().split('T')[0]}</Text>
          </TouchableOpacity>

          {showToPicker && (
            <DateTimePicker
              value={toDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                if (selectedDate) setToDate(selectedDate);
                if (Platform.OS === 'android') setShowToPicker(false);
              }}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default DateRangePicker;
