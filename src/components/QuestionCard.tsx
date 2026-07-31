import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ColorTheme } from '../theme/colors';

interface CardWrapperProps {
  theme: ColorTheme;
  title: string;
  subtitle?: string;
  required?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const CardWrapper: React.FC<CardWrapperProps> = ({
  theme,
  title,
  subtitle,
  required,
  children,
  style,
}) => {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.cardBg,
          borderColor: theme.cardBorder,
          shadowColor: theme.shadowColor,
        },
        style,
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.titleRow}>
          <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{title}</Text>
          {required && <Text style={styles.requiredStar}> *</Text>}
        </View>
        {subtitle && <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>}
      </View>
      <View style={styles.cardBody}>{children}</View>
    </View>
  );
};

interface TextInputFieldProps {
  theme: ColorTheme;
  label: string;
  value: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'numeric' | 'phone-pad';
}

export const TextInputField: React.FC<TextInputFieldProps> = ({
  theme,
  label,
  value,
  placeholder,
  onChangeText,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
}) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.fieldLabel, { color: theme.textPrimary }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBg,
            borderColor: theme.inputBorder,
            color: theme.textPrimary,
            height: multiline ? 100 : 46,
            textAlignVertical: multiline ? 'top' : 'center',
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textMuted}
        multiline={multiline}
        numberOfLines={numberOfLines}
        keyboardType={keyboardType}
      />
    </View>
  );
};

interface RadioChipsProps {
  theme: ColorTheme;
  options: { label: string; value: string }[];
  selectedValue: string;
  onSelect: (value: any) => void;
}

export const RadioChips: React.FC<RadioChipsProps> = ({
  theme,
  options,
  selectedValue,
  onSelect,
}) => {
  return (
    <View style={styles.chipsContainer}>
      {options.map((opt) => {
        const isSelected = selectedValue === opt.value;
        return (
          <TouchableOpacity
            key={opt.value}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected ? theme.chipSelectedBg : theme.chipBg,
                borderColor: isSelected ? theme.primary : theme.cardBorder,
              },
            ]}
            onPress={() => onSelect(opt.value)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isSelected ? 'radio-button-on' : 'radio-button-off'}
              size={16}
              color={isSelected ? theme.chipSelectedText : theme.textMuted}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.chipText,
                { color: isSelected ? theme.chipSelectedText : theme.textPrimary, fontWeight: isSelected ? '700' : '500' },
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

interface CheckboxChipsProps {
  theme: ColorTheme;
  options: { id: string; label: string; detail?: string }[];
  selectedValues: string[];
  onToggle: (id: string) => void;
}

export const CheckboxChips: React.FC<CheckboxChipsProps> = ({
  theme,
  options,
  selectedValues,
  onToggle,
}) => {
  return (
    <View style={styles.checkboxList}>
      {options.map((opt) => {
        const isSelected = selectedValues.includes(opt.id);
        return (
          <TouchableOpacity
            key={opt.id}
            style={[
              styles.checkboxCard,
              {
                backgroundColor: isSelected ? theme.primaryLight : theme.chipBg,
                borderColor: isSelected ? theme.primary : theme.cardBorder,
              },
            ]}
            onPress={() => onToggle(opt.id)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isSelected ? 'checkbox' : 'square-outline'}
              size={20}
              color={isSelected ? theme.primary : theme.textMuted}
              style={{ marginRight: 10 }}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.checkboxLabel,
                  { color: isSelected ? theme.primaryDark : theme.textPrimary, fontWeight: isSelected ? '700' : '600' },
                ]}
              >
                {opt.label}
              </Text>
              {opt.detail && (
                <Text style={[styles.checkboxDetail, { color: theme.textSecondary }]}>
                  {opt.detail}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

interface RatingPickerProps {
  theme: ColorTheme;
  rating: number; // 1 to 5
  onRatingChange: (val: number) => void;
  labels?: string[];
}

export const RatingPicker: React.FC<RatingPickerProps> = ({
  theme,
  rating,
  onRatingChange,
  labels = ['매우 경미', '경미', '보통', '심함', '매우 심함'],
}) => {
  return (
    <View style={styles.ratingContainer}>
      <View style={styles.starRow}>
        {[1, 2, 3, 4, 5].map((num) => {
          const isSelected = num <= rating;
          return (
            <TouchableOpacity
              key={num}
              style={styles.starButton}
              onPress={() => onRatingChange(num)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isSelected ? 'star' : 'star-outline'}
                size={32}
                color={isSelected ? '#F59E0B' : theme.textMuted}
              />
              <Text style={[styles.starNumText, { color: isSelected ? theme.textPrimary : theme.textMuted }]}>
                {num}점
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={[styles.ratingBadge, { backgroundColor: theme.primaryLight }]}>
        <Text style={[styles.ratingBadgeText, { color: theme.primary }]}>
          평가: {rating}점 - {labels[rating - 1] || ''}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  requiredStar: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  cardBody: {
    gap: 12,
  },
  inputContainer: {
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
  },
  checkboxList: {
    gap: 8,
  },
  checkboxCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  checkboxLabel: {
    fontSize: 14,
  },
  checkboxDetail: {
    fontSize: 12,
    marginTop: 2,
  },
  ratingContainer: {
    alignItems: 'center',
    marginVertical: 4,
  },
  starRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  starButton: {
    alignItems: 'center',
    padding: 4,
  },
  starNumText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  ratingBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ratingBadgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
