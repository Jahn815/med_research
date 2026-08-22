import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  LayoutChangeEvent,
} from 'react-native';
import { ColorTheme } from '../theme/colors';
import { Language } from '../i18n/translations';

interface PalinSliderProps {
  value: number | undefined;
  onChange: (val: number) => void;
  lowLabel?: string;
  highLabel?: string;
  theme: ColorTheme;
  lang?: Language;
}

export const PalinSlider: React.FC<PalinSliderProps> = ({
  value,
  onChange,
  lowLabel,
  highLabel,
  theme,
  lang = 'ko',
}) => {
  const hasValue = value !== undefined && value !== null && typeof value === 'number';
  const currentValue = hasValue ? Math.min(10, Math.max(0, Number(value))) : 0;
  const [trackWidth, setTrackWidth] = useState<number>(300);

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width } = e.nativeEvent.layout;
    if (width > 0) {
      setTrackWidth(width);
    }
  };

  const updateValueFromX = (touchX: number) => {
    if (trackWidth <= 0) return;
    const clampedX = Math.max(0, Math.min(trackWidth, touchX));
    const stepRatio = clampedX / trackWidth;
    const rawVal = Math.round(stepRatio * 10);
    const clampedVal = Math.min(10, Math.max(0, rawVal));
    onChange(clampedVal);
  };

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        updateValueFromX(evt.nativeEvent.locationX);
      },
      onPanResponderMove: (evt: GestureResponderEvent, _gestureState: PanResponderGestureState) => {
        updateValueFromX(evt.nativeEvent.locationX);
      },
    })
  ).current;

  // Percentage for filled track and thumb position
  const percent = hasValue ? (currentValue / 10) * 100 : 0;

  return (
    <View style={styles.container}>
      {/* Endpoint Description Labels */}
      {(lowLabel || highLabel) && (
        <View style={styles.labelRow}>
          <Text style={[styles.endpointLabel, { color: theme.textSecondary }]}>
            0: {lowLabel}
          </Text>
          <Text style={[styles.endpointLabel, { color: theme.textSecondary, textAlign: 'right' }]}>
            10: {highLabel}
          </Text>
        </View>
      )}

      {/* Main Interactive Slider Area */}
      <View
        style={styles.sliderTouchArea}
        onLayout={handleLayout}
        {...panResponder.panHandlers}
      >
        {/* Background Track */}
        <View style={[styles.trackBg, { backgroundColor: theme.chipBg, borderColor: theme.cardBorder }]}>
          {/* Active Filled Track */}
          {hasValue && (
            <View
              style={[
                styles.trackFill,
                { backgroundColor: theme.primary, width: `${percent}%` },
              ]}
            />
          )}
        </View>

        {/* Step Ticks */}
        <View style={styles.tickRow} pointerEvents="none">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((step) => {
            const isFilled = hasValue && step <= currentValue;
            return (
              <View
                key={step}
                style={[
                  styles.tickMark,
                  {
                    backgroundColor: isFilled ? '#FFFFFF' : theme.textMuted,
                    opacity: isFilled ? 0.9 : 0.3,
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Sliding Knob (Rendered only when value has been selected) */}
        {hasValue && (
          <View
            style={[
              styles.thumb,
              {
                left: `${percent}%`,
                backgroundColor: theme.primary,
                borderColor: '#FFFFFF',
              },
            ]}
            pointerEvents="none"
          >
            <Text style={styles.thumbText}>{currentValue}</Text>
          </View>
        )}
      </View>

      {/* Step Numbers 0..10 Row */}
      <View style={styles.stepNumbersRow}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((step) => {
          const isSelected = hasValue && step === currentValue;
          return (
            <TouchableOpacity
              key={step}
              style={styles.stepNumBtn}
              onPress={() => onChange(step)}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            >
              <Text
                style={[
                  styles.stepNumText,
                  {
                    color: isSelected ? theme.primary : theme.textSecondary,
                    fontWeight: isSelected ? '800' : '500',
                  },
                  isSelected && { fontSize: 13 },
                ]}
              >
                {step}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Selected Score Indicator Badge */}
      <View
        style={[
          styles.scoreBadge,
          {
            backgroundColor: hasValue ? theme.primaryLight : theme.chipBg,
            borderColor: hasValue ? theme.primary : theme.cardBorder,
            borderWidth: hasValue ? 0 : 1,
          },
        ]}
      >
        <Text
          style={[
            styles.scoreBadgeText,
            { color: hasValue ? theme.primary : theme.textMuted },
          ]}
        >
          {hasValue
            ? (lang === 'en' ? `Selected Score: ${currentValue} / 10` : `선택된 점수: ${currentValue}점`)
            : (lang === 'en' ? '👆 Drag or tap slider to select score (0-10)' : '👆 터치하여 점수를 선택하세요 (0~10)')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  endpointLabel: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  sliderTouchArea: {
    height: 44,
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
  },
  trackBg: {
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    overflow: 'hidden',
    width: '100%',
  },
  trackFill: {
    height: '100%',
    borderRadius: 7,
  },
  tickRow: {
    position: 'absolute',
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tickMark: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  thumbText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  stepNumbersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 2,
  },
  stepNumBtn: {
    width: '9%',
    alignItems: 'center',
    paddingVertical: 2,
  },
  stepNumText: {
    fontSize: 11,
    textAlign: 'center',
  },
  scoreBadge: {
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 10,
  },
  scoreBadgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
