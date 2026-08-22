import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { lightTheme, darkTheme, ColorTheme } from './src/theme/colors';
import { PalinSurveyView } from './src/components/PalinSurveyView';
import { Language } from './src/i18n/translations';

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [lang, setLang] = useState<Language>('ko');

  const theme: ColorTheme = isDark ? darkTheme : lightTheme;

  const handleToggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleToggleLanguage = () => {
    setLang((prev) => (prev === 'ko' ? 'en' : 'ko'));
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <PalinSurveyView
          theme={theme}
          isDark={isDark}
          onToggleTheme={handleToggleTheme}
          lang={lang}
          onToggleLanguage={handleToggleLanguage}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
});
