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

### Testing on Physical Devices (Expo Go)

You can easily test the app on your personal iPhone or Android device using **Expo Go**. 
Simply install the "Expo Go" app on your phone, run `npm start`, and scan the terminal's QR code while connected to the same Wi-Fi network.

👉 **[View the Detailed Expo Go Testing Guide](docs/EXPO_GO_TESTING.md)**

### Web Deployment (CDN)

To host the web version of this application on a CDN or static hosting service (e.g., Vercel, Netlify, Cloudflare Pages, or GitHub Pages):

1. Generate the static web export:
   ```bash
   npx expo export -p web
   ```
2. Upload the generated `dist` folder to your preferred CDN provider.

### Building for Android (Direct APK Install)

To build an `.apk` file that you can send directly to testers via email, Slack, or other messengers (bypassing the Play Store):

1. Install the EAS CLI globally if you haven't already:
   ```bash
   npm install -g eas-cli
   ```
2. Run the APK build command using the configured preview profile:
   ```bash
   eas build -p android --profile preview
   ```
3. Once the build finishes, EAS will provide a public link and QR code. Anyone with this link can download and install the APK directly on their Android device.

### Over-The-Air (OTA) Updates (Expo CDN)

To instantly push JavaScript and asset updates directly to your mobile users without going through App Store or Play Store reviews, use **EAS Update**:

1. Install the EAS CLI globally:
   ```bash
   npm install -g eas-cli
   ```
2. Initialize and configure the project for updates:
   ```bash
   eas update:configure
   ```
3. Publish a new update to a specific branch (e.g., preview or production):
   ```bash
   eas update --branch preview --message "Updated survey logic"
   ```

## Resources

- **Source Survey:** [Google Form](https://docs.google.com/forms/d/e/1FAIpQLScTNfr3pHSUTC1hPFU6k9zQmZNLo-DVITqZxmraAQmcrN8ihg/viewform)
- **Converted Form Data:** [resources/palin_form_decoded.json](resources/palin_form_decoded.json) (JSON representation converted from the Google Form)
- **Palin Parent Rating Scale (PPRS) Auto-calculation Tool:** [resources/PPRS_Auto_Calculation_Data.xlsx](resources/PPRS_Auto_Calculation_Data.xlsx) (Excel template for automatically calculating raw scores, percentiles, and result interpretations based on the survey responses)
