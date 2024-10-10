# Chat App

## Overview

Chat App is a React Native application that allows users to chat with each other. The app supports anonymous authentication using Firebase, real-time messaging, and media sharing (images and location). The app is built using various libraries and tools to provide a seamless chat experience.

## Features

- **Anonymous Authentication**: Users can sign in anonymously using Firebase Authentication.
- **Real-time Messaging**: Messages are sent and received in real-time using Firebase Firestore.
- **Media Sharing**: Users can share images and their location.
- **Custom Actions**: Custom actions for picking images, taking photos, and sharing location.
- **Offline Support**: The app supports offline mode and syncs messages when the connection is restored.

## Technologies Used

- **React Native**: For building the mobile application.
- **Firebase**: For authentication, real-time database, and storage.
  - **Firebase Authentication**: For anonymous user authentication.
  - **Firebase Firestore**: For real-time messaging.
  - **Firebase Storage**: For storing images.
- **Expo**: For development and testing.
- **React Navigation**: For navigation between screens.
- **AsyncStorage**: For local storage.
- **NetInfo**: For network status monitoring.
- **Gifted Chat**: For chat UI components.

## Prerequisites

- **Node.js**: Ensure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).
- **Expo CLI**: Install Expo CLI globally using npm:
  ```bash
  npm install -g expo-cli
  ```

## Getting Started

### Clone the Repository

1. Open your terminal.
2. Clone the repository using the following command:
   ```bash
   git clone https://github.com/your-username/chat-app.git
   ```
3. Navigate to the project directory:
   ```bash
   cd chat-app
   ```

### Install Dependencies

Install the required dependencies using npm or yarn:


npm install
# or
yarn install


### Firebase Configuration

1. Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable Anonymous Authentication in the Firebase Console:
   - Go to **Authentication** -> **Sign-in method**.
   - Enable **Anonymous**.
3. Create a Firestore database in the Firebase Console.
4. Create a `firebaseConfig.js` file in the root of your project and add your Firebase configuration:

```javascript
// firebaseConfig.js
export const firebaseConfig = {


 

 apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Running the App

Start the Expo development server:

```bash
expo start
```

This will open a new tab in your browser. You can run the app on an emulator, simulator, or a physical device using the Expo Go app.

## Project Structure

```
chat-app/
├── assets/
│   └── backgroundimage.jpg
├── components/
│   ├── Chat.js
│   ├── CustomActions.js
│   └── Start.js
├── App.js
├── firebaseConfig.js
├── package.json
└── README.md
```

## Custom Actions

The 

CustomActions.js

 component provides custom actions for the chat, such as picking images, taking photos, and sharing location. Here is an excerpt from the 

CustomActions.js

 file:

```javascript
options,
            cancelButtonIndex,
          },
          async (buttonIndex) => { //this function will be called when the user selects an option.
            switch (buttonIndex) {//this switch statement will determine which option the user selected.
              case 0://if the user selects the first option, the pickImage function will be called.
                pickImage();
                return;
              case 1:
                takePhoto();
                return;
              case 2:
                getLocation();
              default://default is the cancel button, so nothing will happen if the user selects the cancel button.
            }
          },
        );
      };

    
    return (//this is the UI for the CustomActions component. Contains the button that will display the action sheet/options to the user.
        <TouchableOpacity style={styles.container} onPress={onActionPress}>
          <View style={[styles.wrapper, wrapperStyle]}>
            <Text style={[styles.iconText, iconTextStyle]}>+</Text>
          </View>
        </TouchableOpacity>
      );
}
```

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## Contact

For any questions or inquiries, please contact [your-email@example.com](mailto:your-email@example.com).

---

By following these steps, you should be able to set up and run the Chat App on your local machine. If you encounter any issues, please refer to the documentation or open an issue on the repository.
