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

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectDate: (dateString: string) => void;
  initialDate?: string;
  theme: ColorTheme;
  lang?: Language;
}

const WEEKDAYS_KO = ['일', '월', '화', '수', '목', '금', '토'];
const WEEKDAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MONTHS_KO = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  onClose,
  onSelectDate,
  initialDate,
  theme,
  lang = 'ko',
}) => {
  const today = new Date();
  
  // Parse initial date if provided (YYYY-MM-DD or YYYY년 MM월 DD일)
  const parsedInitial = useMemo(() => {
    if (!initialDate) return null;
    const matches = initialDate.match(/(\d{4})[^\d]+(\d{1,2})[^\d]+(\d{1,2})/);
    if (matches) {
      return {
        year: parseInt(matches[1], 10),
        month: parseInt(matches[2], 10) - 1,
        day: parseInt(matches[3], 10),
      };
    }
    return null;
  }, [initialDate]);

  const [viewYear, setViewYear] = useState<number>(parsedInitial ? parsedInitial.year : today.getFullYear() - 5);
  const [viewMonth, setViewMonth] = useState<number>(parsedInitial ? parsedInitial.month : today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(parsedInitial ? parsedInitial.day : null);
  const [showYearDropdown, setShowYearDropdown] = useState<boolean>(false);

  useEffect(() => {
    if (visible) {
      if (parsedInitial) {
        setViewYear(parsedInitial.year);
        setViewMonth(parsedInitial.month);
        setSelectedDay(parsedInitial.day);
      } else {
        setViewYear(today.getFullYear() - 5);
        setViewMonth(0);
        setSelectedDay(15);
      }
      setShowYearDropdown(false);
    }
  }, [visible, parsedInitial]);

  // Generate Year Options (e.g. 2010 to current year)
  const currentYear = today.getFullYear();
  const yearOptions = useMemo(() => {
    const years: number[] = [];
    for (let y = currentYear; y >= 2005; y--) {
      years.push(y);
    }
    return years;
  }, [currentYear]);

  // Calculate Days Grid for current viewYear and viewMonth
  const daysGrid = useMemo(() => {
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    
    const grid: (number | null)[] = [];
    for (let i = 0; i < firstDayIndex; i++) {
      grid.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      grid.push(d);
    }
    return grid;
  }, [viewYear, viewMonth]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const handleConfirm = () => {
    const dayToUse = selectedDay || 1;
    const monthStr = String(viewMonth + 1).padStart(2, '0');
    const dayStr = String(dayToUse).padStart(2, '0');
    const formatted = lang === 'en'
      ? `${viewYear}-${monthStr}-${dayStr}`
      : `${viewYear}년 ${viewMonth + 1}월 ${dayToUse}일`;
    
    onSelectDate(formatted);
    onClose();
  };

  const weekdays = lang === 'en' ? WEEKDAYS_EN : WEEKDAYS_KO;
  const monthTitle = lang === 'en'
    ? `${MONTHS_EN[viewMonth]} ${viewYear}`
    : `${viewYear}년 ${MONTHS_KO[viewMonth]}`;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={[styles.modalCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
              {/* Header Title */}
              <View style={styles.headerRow}>
                <Ionicons name="calendar-outline" size={20} color={theme.primary} />
                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                  {lang === 'en' ? 'Select Date of Birth' : '아동 생년월일 선택'}
                </Text>
                <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Ionicons name="close" size={22} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Year & Month Control Bar */}
              <View style={[styles.controlsBar, { backgroundColor: theme.chipBg }]}>
                <TouchableOpacity style={styles.arrowBtn} onPress={handlePrevMonth}>
                  <Ionicons name="chevron-back" size={20} color={theme.textPrimary} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.monthYearSelectorBtn}
                  onPress={() => setShowYearDropdown((prev) => !prev)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.monthYearTitle, { color: theme.textPrimary }]}>
                    {monthTitle}
                  </Text>
                  <Ionicons
                    name={showYearDropdown ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color={theme.primary}
                    style={{ marginLeft: 4 }}
                  />
                </TouchableOpacity>

                <TouchableOpacity style={styles.arrowBtn} onPress={handleNextMonth}>
                  <Ionicons name="chevron-forward" size={20} color={theme.textPrimary} />
                </TouchableOpacity>
              </View>

              {/* Year Picker Dropdown overlay */}
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
                          y === viewYear && { backgroundColor: theme.primaryLight },
                        ]}
                        onPress={() => {
                          setViewYear(y);
                          setShowYearDropdown(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.yearItemText,
                            { color: y === viewYear ? theme.primary : theme.textPrimary },
                            y === viewYear && { fontWeight: '800' },
                          ]}
                        >
                          {y}{lang === 'en' ? '' : '년'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              ) : (
                /* Calendar Grid */
                <View style={styles.calendarBody}>
                  {/* Weekday Row */}
                  <View style={styles.weekdayRow}>
                    {weekdays.map((w, idx) => (
                      <Text
                        key={w}
                        style={[
                          styles.weekdayText,
                          { color: idx === 0 ? '#EF4444' : idx === 6 ? '#3B82F6' : theme.textSecondary },
                        ]}
                      >
                        {w}
                      </Text>
                    ))}
                  </View>

                  {/* Days Grid */}
                  <View style={styles.daysGrid}>
                    {daysGrid.map((day, idx) => {
                      if (day === null) {
                        return <View key={`empty-${idx}`} style={styles.dayCell} />;
                      }
                      const isSelected = day === selectedDay;
                      const dayOfWeek = (idx) % 7;
                      const isSun = dayOfWeek === 0;
                      const isSat = dayOfWeek === 6;

                      return (
                        <TouchableOpacity
                          key={`day-${day}`}
                          style={[
                            styles.dayCell,
                            isSelected && { backgroundColor: theme.primary, borderRadius: 20 },
                          ]}
                          onPress={() => setSelectedDay(day)}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.dayText,
                              {
                                color: isSelected
                                  ? '#FFFFFF'
                                  : isSun
                                  ? '#EF4444'
                                  : isSat
                                  ? '#3B82F6'
                                  : theme.textPrimary,
                                fontWeight: isSelected ? '800' : '500',
                              },
                            ]}
                          >
                            {day}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
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
    maxWidth: 360,
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
    marginBottom: 12,
  },
  arrowBtn: {
    padding: 6,
    borderRadius: 8,
  },
  monthYearSelectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  monthYearTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  calendarBody: {
    marginBottom: 14,
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  weekdayText: {
    width: 40,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  dayCell: {
    width: '14.28%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
  },
  dayText: {
    fontSize: 14,
  },
  yearDropdownContainer: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
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
    marginTop: 4,
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
