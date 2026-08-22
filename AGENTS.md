# Project Guidelines & Architecture (med_research)

## Expo Version Compatibility
- The project is configured for **Expo SDK 54** (`expo@~54.0.37`, `react-native@0.81.5`).
- Read the versioned documentation at: https://docs.expo.dev/versions/v54.0.0/

## Core Rules & Conventions

### 1. Language Scope
- Work strictly on the Korean language side (`lang === 'ko'`). Do NOT copy changes to English unless explicitly requested by the user.

### 2. Survey Structure & Quiz Hub
- **Quiz Choices**: SBIS Quiz (5 questions) and Palin PPRS Quiz (19 questions) are independent options.
- **Question Numbering**: Numbering restarts at **Q1** for each individual quiz section (SBIS: Q1~Q5, Palin: Q1~Q19, Demographics: Q1~Q15).
- **0–10 Rating Scale UI**: Uses dynamic pill button sizing (`useWindowDimensions()`) so all 11 rating options (0–10) fit on a single row without horizontal scrolling on mobile devices.

### 3. Clinical Score Ranges & Results Display
- **Selective Display Rule**: On the results report page, render **ONLY** the single active score range card corresponding to the calculated score. Do NOT list all other ranges or descriptions.
- **SBIS Score Ranges**:
  - `0 ~ 11점`: 낯선 사람이나 새로운 상황에 조심스럽고 위축된 반응.
  - `12 ~ 18점`: 또래 아이들과 비슷한 수준.
  - `19 ~ 25점`: 낯선 상황에 쉽게 다가가고 빠르게 적응하는 사교적 성향.
- **Palin Factor Score Ranges**:
  - **Factor 1** (9 ranges: `0~1.9`, `2.0~2.7`, `2.8~3.4`, `3.5~4.1`, `4.2~4.9`, `5.0~5.5`, `5.6~6.1`, `6.2~6.6`, `6.7+`).
  - **Factor 2** (9 ranges: `0.0~1.1`, `1.2~1.7`, `1.8~2.1`, `2.2~2.7`, `2.8~3.3`, `3.4~4.1`, `4.2~4.9`, `5.0~5.3`, `5.4+`).
  - **Factor 3** (9 ranges: `0.0~1.6`, `1.7~2.1`, `2.2~3.1`, `3.2~4.0`, `4.1~4.9`, `5.0~5.5`, `5.6~6.1`, `6.2~6.5`, `6.6+`).

### 4. Firebase Backend Integration & Frontend Agent Access
- **Safe Configuration Reference**: [`src/config/firebase.config.json`](file:///Users/justinahn/med_research/src/config/firebase.config.json) & [`.env`](file:///Users/justinahn/med_research/.env).
- **Service Module**: [`src/services/firebase.ts`](file:///Users/justinahn/med_research/src/services/firebase.ts).
- **Firebase Project ID**: `med-research-e4ae6`
- **Cloud Firestore Collection**: `survey_responses`
  - Function: `saveSurveyResponseToFirestore(payload)`
  - Document fields: `answers`, `scores`, `locale`, `submittedAtIso`, `createdAt`, `metadata`.
