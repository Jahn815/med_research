import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ColorTheme } from '../theme/colors';
import { PalinQuestion } from '../types/palinSurvey';
import { Language } from '../i18n/translations';
import { palinTranslationsEn } from '../i18n/palinTranslationsEn';

interface PalinQuestionRendererProps {
  question: PalinQuestion;
  value: string | number | undefined;
  onChange: (val: string | number) => void;
  theme: ColorTheme;
  lang?: Language;
  displayNumber?: number;
  prefix?: string;
  hideBadge?: boolean;
}

export const PalinQuestionRenderer: React.FC<PalinQuestionRendererProps> = ({
  question,
  value,
  onChange,
  theme,
  lang = 'ko',
  displayNumber,
  prefix = 'Q',
  hideBadge = false,
}) => {
  const enTrans = lang === 'en' ? palinTranslationsEn[question.id] : undefined;

  const questionText = enTrans?.text || question.text.trim();
  const descriptionText = enTrans?.description || question.description;

  const qNum = displayNumber !== undefined ? displayNumber : question.number;
  const badgeText = `${prefix}${qNum}`;

  const rawChoices = question.options?.choices || [];
  const choices = rawChoices.map((c, idx) => ({
    ...c,
    label: enTrans?.choices && enTrans.choices[idx] ? enTrans.choices[idx] : c.label,
  }));

  const scale = question.options?.scale
    ? {
        ...question.options.scale,
        low_label: enTrans?.low_label || question.options.scale.low_label,
        high_label: enTrans?.high_label || question.options.scale.high_label,
      }
    : null;

  const { width: windowWidth } = useWindowDimensions();

  // Calculate dynamic 0-10 scale pill button size to fit all 11 items without horizontal scrolling
  const availableWidth = Math.max(280, windowWidth - 56);
  const idealGap = Math.min(8, Math.max(2, Math.floor((availableWidth - 11 * 26) / 10)));
  const calculatedPillSize = Math.floor((availableWidth - 10 * idealGap) / 11);
  const pillSize = Math.min(40, Math.max(25, calculatedPillSize));
  const pillFontSize = pillSize < 28 ? 11 : pillSize < 34 ? 12 : 14;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.cardBg,
          borderColor: theme.cardBorder,
          shadowColor: theme.shadowColor,
        },
        hideBadge && { paddingVertical: 20, paddingHorizontal: 20, alignItems: 'center' },
      ]}
    >
      {/* Question Header */}
      <View style={[styles.headerRow, hideBadge && { justifyContent: 'center', width: '100%', marginBottom: 12 }]}>
        {!hideBadge && (
          <View style={[styles.qNumBadge, { backgroundColor: theme.primaryLight }]}>
            <Text style={[styles.qNumText, { color: theme.primary }]}>{badgeText}</Text>
          </View>
        )}
        <Text
          style={[
            styles.questionText,
            { color: theme.textPrimary },
            hideBadge && { textAlign: 'center', fontSize: 16, fontWeight: '700', flex: 0 },
          ]}
        >
          {questionText}
        </Text>
      </View>

      {descriptionText && (
        <Text style={[styles.descriptionText, { color: theme.textSecondary }, hideBadge && { textAlign: 'center' }]}>
          {descriptionText}
        </Text>
      )}

      {/* RENDER BY TYPE */}
      {/* 1. RADIO / SINGLE CHOICE */}
      {question.type === 'radio' && (
        <View style={[styles.choicesRow, hideBadge && { justifyContent: 'center', gap: 16 }]}>
          {choices.map((c) => {
            const isSelected = value === c.value;
            return (
              <TouchableOpacity
                key={c.value}
                style={[
                  styles.radioChip,
                  {
                    backgroundColor: isSelected ? theme.chipSelectedBg : theme.chipBg,
                    borderColor: isSelected ? theme.primary : theme.cardBorder,
                  },
                ]}
                onPress={() => onChange(c.value)}
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
                    styles.radioText,
                    {
                      color: isSelected ? theme.chipSelectedText : theme.textPrimary,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {c.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* 2. TEXT INPUT (SHORT ANSWER OR PARAGRAPH) */}
      {(question.type === 'short_answer' || question.type === 'paragraph') && (() => {
        const isSingleLine =
          question.type === 'short_answer' ||
          question.number === 4 ||
          question.number === 6 ||
          question.id === 1227784826 ||
          question.id === 1100613129;

        const placeholder =
          lang === 'en'
            ? question.number === 4
              ? "e.g., 38"
              : question.number === 6
              ? "e.g., 2019-05-10 (6 years 2 months)"
              : "Enter your answer..."
            : question.number === 4
            ? "예: 38 (숫자 또는 연령 입력)"
            : question.number === 6
            ? "예: 2019년 05월 10일 (6세 2개월)"
            : "답변을 입력하세요...";

        return (
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: theme.inputBg,
                borderColor: theme.inputBorder,
                color: theme.textPrimary,
                height: isSingleLine ? 46 : 90,
                textAlignVertical: isSingleLine ? 'center' : 'top',
              },
            ]}
            value={value !== undefined ? String(value) : ''}
            onChangeText={(text) => onChange(text)}
            placeholder={placeholder}
            placeholderTextColor={theme.textMuted}
            multiline={!isSingleLine}
            keyboardType={question.number === 4 ? "numeric" : "default"}
          />
        );
      })()}

      {/* 3. GRID (SBIS 5-POINT SCALE CHIPS) */}
      {question.type === 'grid' && (
        <View style={styles.gridContainer}>
          {choices.map((c, cIdx) => {
            const isSelected = value === c.value;
            const pts = cIdx + 1;
            return (
              <TouchableOpacity
                key={c.value}
                style={[
                  styles.gridItem,
                  {
                    backgroundColor: isSelected ? theme.primaryLight : theme.chipBg,
                    borderColor: isSelected ? theme.primary : theme.cardBorder,
                  },
                ]}
                onPress={() => onChange(c.value)}
                activeOpacity={0.7}
              >
                <View style={styles.gridRadioRow}>
                  <Ionicons
                    name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                    size={18}
                    color={isSelected ? theme.primary : theme.textMuted}
                  />
                  <Text
                    style={[
                      styles.gridLabel,
                      {
                        color: isSelected ? theme.primaryDark : theme.textPrimary,
                        fontWeight: isSelected ? '700' : '500',
                      },
                    ]}
                  >
                    {c.label}
                  </Text>
                  <View
                    style={[
                      styles.scoreTag,
                      {
                        backgroundColor: isSelected ? theme.primary : 'rgba(139, 92, 246, 0.12)',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.scoreTagText,
                        {
                          color: isSelected ? '#FFFFFF' : '#8B5CF6',
                        },
                      ]}
                    >
                      {lang === 'en' ? `${pts} pt${pts > 1 ? 's' : ''}` : `${pts}점`}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* 4. DROPDOWN / PALIN 0-10 SCALE */}
      {question.type === 'dropdown' && (
        <View style={styles.scaleContainer}>
          {scale && (
            <View style={styles.scaleLabelRow}>
              <Text style={[styles.scaleLabel, { color: theme.textSecondary }]}>
                0: {scale.low_label}
              </Text>
              <Text style={[styles.scaleLabel, { color: theme.textSecondary, textAlign: 'right' }]}>
                10: {scale.high_label}
              </Text>
            </View>
          )}

          <View style={[styles.scalePillRow, { gap: idealGap }]}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
              const isSelected = value === num;
              return (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.scalePill,
                    {
                      width: pillSize,
                      height: pillSize,
                      borderRadius: Math.floor(pillSize / 2),
                      backgroundColor: isSelected ? theme.primary : theme.chipBg,
                      borderColor: isSelected ? theme.primary : theme.cardBorder,
                    },
                  ]}
                  onPress={() => onChange(num)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.scalePillText,
                      {
                        fontSize: pillFontSize,
                        color: isSelected ? '#FFFFFF' : theme.textPrimary,
                        fontWeight: isSelected ? '800' : '600',
                      },
                    ]}
                  >
                    {num}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {value !== undefined && (
            <View style={[styles.selectedScaleBadge, { backgroundColor: theme.primaryLight }]}>
              <Text style={[styles.selectedScaleText, { color: theme.primary }]}>
                {lang === 'en' ? `Selected Score: ${value} / 10` : `선택된 점수: ${value}점`}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 12,
  },
  qNumBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  qNumText: {
    fontSize: 12,
    fontWeight: '800',
  },
  questionText: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    lineHeight: 22,
  },
  descriptionText: {
    fontSize: 12,
    marginBottom: 12,
    lineHeight: 18,
  },
  choicesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  radioChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  radioText: {
    fontSize: 13,
  },
  textInput: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  gridContainer: {
    gap: 8,
  },
  gridItem: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  gridRadioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  gridLabel: {
    fontSize: 13,
    flex: 1,
  },
  scaleContainer: {
    marginTop: 4,
  },
  scaleLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  scaleLabel: {
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
  },
  scalePillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  scalePill: {
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scalePillText: {
    textAlign: 'center',
  },
  selectedScaleBadge: {
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 10,
  },
  selectedScaleText: {
    fontSize: 12,
    fontWeight: '700',
  },
  scoreTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  scoreTagText: {
    fontSize: 11,
    fontWeight: '800',
  },
});
