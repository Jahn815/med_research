# Testing with Expo Go

Expo Go is a great tool for quickly testing your React Native app on physical devices without needing to configure Xcode or Android Studio.

## Prerequisites

1.  **Install the Expo Go App**
    *   **iOS:** Download from the [App Store](https://apps.apple.com/app/expo-go/id982107779).
    *   **Android:** Download from the [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent).
2.  **Network Connection**
    *   Ensure that your mobile device and the computer running the development server are connected to the **same Wi-Fi network**.

## How to Test

1.  **Start the Development Server**
    Open your terminal, navigate to the project directory, and start the Expo server:
    ```bash
    npm start
    ```
    This will generate a QR code in your terminal.

2.  **Connect Your Device**
    *   **iOS:** Open the default **Camera** app on your iPhone or iPad and scan the QR code. A notification will appear at the top of the screen. Tap it to open the project in Expo Go.
    *   **Android:** Open the **Expo Go** app and tap **"Scan QR Code"** from the Home tab. Scan the QR code shown in the terminal.

3.  **Automatic Reloads**
    Once connected, any changes you save in your code will automatically reload on your device.

## Remote Testing (Sharing with Others)

If you need to share the app with a remote tester who is **not on the same Wi-Fi network**, you can start the Expo server in tunnel mode:
```bash
npx expo start --tunnel
```
This generates a publicly accessible URL and QR code via `ngrok`. You can send this QR code or link to your remote testers, and they can open it directly in their Expo Go app from anywhere in the world.

*(Note: Tunnel mode might require you to install `@expo/ngrok` globally via `npm i -g @expo/ngrok` if prompted).*

## Troubleshooting

*   **Can't connect / Local Network Issues:** If Expo Go fails to connect locally, your router or firewall might be blocking the connection. In this case, use the `--tunnel` command mentioned above.
*   **Clear Cache:** If you encounter unexpected errors after updating dependencies, try starting the server and clearing the cache:
    ```bash
    npm start -- -c
    ```
