import React, { useState, useEffect, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ColorTheme } from '../theme/colors';
import { Language } from '../i18n/translations';

interface MonthYearPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectMonthYear: (monthYearString: string) => void;
  initialValue?: string;
  theme: ColorTheme;
  lang?: Language;
}

const MONTHS_KO = [
  '1월', '2월', '3월', '4월',
  '5월', '6월', '7월', '8월',
  '9월', '10월', '11월', '12월'
];

const MONTHS_EN = [
  'Jan', 'Feb', 'Mar', 'Apr',
  'May', 'Jun', 'Jul', 'Aug',
  'Sep', 'Oct', 'Nov', 'Dec'
];

export const MonthYearPickerModal: React.FC<MonthYearPickerModalProps> = ({
  visible,
  onClose,
  onSelectMonthYear,
  initialValue,
  theme,
  lang = 'ko',
}) => {
  const today = new Date();

  // Parse initial year and month if present (e.g. 2023년 3월 or 2023-03)
  const parsedInitial = useMemo(() => {
    if (!initialValue) return null;
    const matches = initialValue.match(/(\d{4})[^\d]+(\d{1,2})/);
    if (matches) {
      return {
        year: parseInt(matches[1], 10),
        month: parseInt(matches[2], 10) - 1,
      };
    }
    return null;
  }, [initialValue]);

  const [selectedYear, setSelectedYear] = useState<number>(parsedInitial ? parsedInitial.year : today.getFullYear() - 1);
  const [selectedMonth, setSelectedMonth] = useState<number>(parsedInitial ? parsedInitial.month : today.getMonth());
  const [showYearDropdown, setShowYearDropdown] = useState<boolean>(false);

  useEffect(() => {
    if (visible) {
      if (parsedInitial) {
        setSelectedYear(parsedInitial.year);
        setSelectedMonth(parsedInitial.month);
      } else {
        setSelectedYear(today.getFullYear() - 1);
        setSelectedMonth(0);
      }
      setShowYearDropdown(false);
    }
  }, [visible, parsedInitial]);

  const currentYear = today.getFullYear();
  const yearOptions = useMemo(() => {
    const years: number[] = [];
    for (let y = currentYear; y >= 2005; y--) {
      years.push(y);
    }
    return years;
  }, [currentYear]);

  const handlePrevYear = () => {
    setSelectedYear((prev) => prev - 1);
  };

  const handleNextYear = () => {
    setSelectedYear((prev) => prev + 1);
  };

  const handleConfirm = () => {
    const formattedMonth = String(selectedMonth + 1).padStart(2, '0');
    const formatted = lang === 'en'
      ? `${selectedYear}-${formattedMonth}`
      : `${selectedYear}년 ${formattedMonth}월`;
    
    onSelectMonthYear(formatted);
    onClose();
  };

  const months = lang === 'en' ? MONTHS_EN : MONTHS_KO;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={[styles.modalCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
              {/* Header Title */}
              <View style={styles.headerRow}>
                <Ionicons name="calendar-sharp" size={20} color={theme.primary} />
                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                  {lang === 'en' ? 'Select Onset Month & Year' : '말더듬 시작 연월 선택'}
                </Text>
                <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Ionicons name="close" size={22} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Year Selector Bar */}
              <View style={[styles.controlsBar, { backgroundColor: theme.chipBg }]}>
                <TouchableOpacity style={styles.arrowBtn} onPress={handlePrevYear}>
                  <Ionicons name="chevron-back" size={20} color={theme.textPrimary} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.yearSelectorBtn}
                  onPress={() => setShowYearDropdown((prev) => !prev)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.yearTitle, { color: theme.textPrimary }]}>
                    {selectedYear}{lang === 'en' ? '' : '년'}
                  </Text>
                  <Ionicons
                    name={showYearDropdown ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color={theme.primary}
                    style={{ marginLeft: 4 }}
                  />
                </TouchableOpacity>

                <TouchableOpacity style={styles.arrowBtn} onPress={handleNextYear}>
                  <Ionicons name="chevron-forward" size={20} color={theme.textPrimary} />
                </TouchableOpacity>
              </View>

              {/* Year Dropdown View */}
              {showYearDropdown ? (
                <View style={[styles.yearDropdownContainer, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                  <Text style={[styles.yearDropdownHeader, { color: theme.textSecondary }]}>
                    {lang === 'en' ? 'Select Year' : '연도 선택'}
                  </Text>
                  <ScrollView style={{ maxHeight: 200 }} showsVerticalScrollIndicator>
                    {yearOptions.map((y) => (
                      <TouchableOpacity
                        key={y}
                        style={[
                          styles.yearItem,
                          y === selectedYear && { backgroundColor: theme.primaryLight },
                        ]}
                        onPress={() => {
                          setSelectedYear(y);
                          setShowYearDropdown(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.yearItemText,
                            { color: y === selectedYear ? theme.primary : theme.textPrimary },
                            y === selectedYear && { fontWeight: '800' },
                          ]}
                        >
                          {y}{lang === 'en' ? '' : '년'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              ) : (
                /* Month Grid 3x4 */
                <View style={styles.monthGrid}>
                  {months.map((mLabel, mIdx) => {
                    const isSelected = mIdx === selectedMonth;
                    return (
                      <TouchableOpacity
                        key={mLabel}
                        style={[
                          styles.monthCell,
                          {
                            backgroundColor: isSelected ? theme.primary : theme.chipBg,
                            borderColor: isSelected ? theme.primary : theme.cardBorder,
                          },
                        ]}
                        onPress={() => setSelectedMonth(mIdx)}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.monthCellText,
                            {
                              color: isSelected ? '#FFFFFF' : theme.textPrimary,
                              fontWeight: isSelected ? '800' : '600',
                            },
                          ]}
                        >
                          {mLabel}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {/* Confirm Footer Actions */}
              <View style={styles.footerRow}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.cancelBtn, { borderColor: theme.cardBorder }]}
                  onPress={onClose}
                >
                  <Text style={[styles.actionBtnText, { color: theme.textSecondary }]}>
                    {lang === 'en' ? 'Cancel' : '취소'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionBtn, styles.confirmBtn, { backgroundColor: theme.primary }]}
                  onPress={handleConfirm}
                >
                  <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" style={{ marginRight: 4 }} />
                  <Text style={[styles.actionBtnText, { color: '#FFFFFF', fontWeight: '800' }]}>
                    {lang === 'en' ? 'Select' : '선택 완료'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    flex: 1,
    marginLeft: 8,
  },
  controlsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 16,
  },
  arrowBtn: {
    padding: 6,
    borderRadius: 8,
  },
  yearSelectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  yearTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  monthCell: {
    width: '30%',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthCellText: {
    fontSize: 14,
  },
  yearDropdownContainer: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  yearDropdownHeader: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  yearItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 2,
  },
  yearItemText: {
    fontSize: 15,
  },
  footerRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  cancelBtn: {
    borderWidth: 1,
  },
  confirmBtn: {},
  actionBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
