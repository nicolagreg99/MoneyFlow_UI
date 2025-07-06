import React from 'react';
import { View, Text } from 'react-native';
import MainStyles from '../../styles/Main_style';

type StatsWidgetProps = {
  title: string;
  value: string;
  icon: string;
};

const StatsWidget: React.FC<StatsWidgetProps> = ({ title, value, icon }) => {
  return (
    <View style={MainStyles.widget}>
      <Text style={MainStyles.widgetIcon}>{icon}</Text>
      <Text style={MainStyles.widgetName}>{title}</Text>
      <Text style={MainStyles.widgetValue}>{value}</Text>
    </View>
  );
};

export default StatsWidget;
