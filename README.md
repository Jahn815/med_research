# Med Research Survey App

A React Native (Expo) mobile and web application designed for medical research surveys. This application is tailored for child development assessments and speech therapy evaluations, particularly focusing on approaches like the Palin Parent-Child Interaction method.

## Features

- **Comprehensive Survey Modules:** Collects detailed information including child demographics, symptom onset, environmental situations, and family history.
- **Dual Survey Modes:** Supports both 'Palin' and 'Standard' survey formats to adapt to different clinical needs.
- **Bilingual Interface:** Full localization support for English and Korean (`i18n`).
- **Dynamic Theming:** Built-in support for seamless Light and Dark mode transitions.
- **Cross-Platform:** Runs seamlessly on iOS, Android, and Web using Expo.

## Technology Stack

- **Framework:** React Native
- **Build Tool:** Expo (v57)
- **Language:** TypeScript
- **Backend/Services:** Firebase

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Navigate to the project directory.
2. Install the necessary dependencies:

```bash
npm install
```

### Running the Application

Start the Expo development server by running:

```bash
npm start
```

Once the server is running, you can press:
- `i` to open in iOS simulator
- `a` to open in Android emulator
- `w` to open in Web browser

## Resources

- **Source Survey:** [Google Form](https://docs.google.com/forms/d/e/1FAIpQLScTNfr3pHSUTC1hPFU6k9zQmZNLo-DVITqZxmraAQmcrN8ihg/viewform)
- **Converted Form Data:** [resources/palin_form_decoded.json](./resources/palin_form_decoded.json) (JSON representation converted from the Google Form)
- **Palin Parent Rating Scale (PPRS) Auto-calculation Tool:** [resources/PPRS-자동계산-엑셀표-2 (1).xlsx](./resources/PPRS-자동계산-엑셀표-2%20(1).xlsx) (Excel template for automatically calculating raw scores, percentiles, and result interpretations based on the survey responses)
