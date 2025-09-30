/**
 * Calendar Header Component - HeyData Mobile
 * Header del calendario con navegación y filtros
 * 
 * @format
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CalendarHeaderProps } from '../types';
import { FilterIcon } from './CalendarIcons';
import { formatMonthYear } from '../utils/calendarUtils';
import { calendarStyles } from '../styles/calendarStyles';

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  viewMode,
  currentDate,
  showMonthPicker,
  onNavigateDate,
  onViewModeChange,
  onMonthPickerToggle,
  onFilterPress,
}) => {
  if (viewMode === 'day') {
    return (
      <View style={calendarStyles.header}>
        <TouchableOpacity 
          style={calendarStyles.monthSelector}
          onPress={() => onMonthPickerToggle(!showMonthPicker)}
        >
          <Text style={calendarStyles.monthSelectorText}>
            {formatMonthYear(currentDate)}
          </Text>
          <Text style={calendarStyles.monthSelectorArrow}>▼</Text>
        </TouchableOpacity>
        
        <View style={calendarStyles.headerActions}>
          <TouchableOpacity 
            style={calendarStyles.filterButton}
            onPress={onFilterPress}
          >
            <FilterIcon color="#007AFF" size={18} />
            <Text style={calendarStyles.filterButtonText}>Filtrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={calendarStyles.header}>
      <TouchableOpacity 
        onPress={() => onNavigateDate('prev')} 
        style={calendarStyles.navButton}
      >
        <Text style={calendarStyles.navButtonText}>‹</Text>
      </TouchableOpacity>
      
      <View style={calendarStyles.headerCenter}>
        <Text style={calendarStyles.headerTitle}>
          {formatMonthYear(currentDate)}
        </Text>
        <View style={calendarStyles.viewModeSelector}>
          {(['day', 'week', 'month'] as const).map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                calendarStyles.viewModeButton, 
                viewMode === mode && calendarStyles.activeViewMode
              ]}
              onPress={() => onViewModeChange(mode)}
            >
              <Text style={[
                calendarStyles.viewModeText, 
                viewMode === mode && calendarStyles.activeViewModeText
              ]}>
                {mode === 'day' ? 'Día' : mode === 'week' ? 'Semana' : 'Mes'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <TouchableOpacity 
        onPress={() => onNavigateDate('next')} 
        style={calendarStyles.navButton}
      >
        <Text style={calendarStyles.navButtonText}>›</Text>
      </TouchableOpacity>
    </View>
  );
};