import { TouchableOpacity, View, Text, StyleSheet, Alert } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { ref, uploadBytes, getDownloadURL} from "firebase/storage";

const CustomActions = ({ wrapperStyle, iconTextStyle, storage, onSend, userID }) => {
  const actionSheet = useActionSheet();

  const onActionPress = () => {//this function will open the action sheet when the user presses the '+' button
    const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    actionSheet.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {//this function will allow the user to choose an option from the action sheet
        switch (buttonIndex) {
          case 0:
            pickImage();
            return;
          case 1:
            takePhoto()
            return;
          case 2:
            getLocation();
          default:
        }
      },
    );
  };

  const pickImage = async () => {//this function will allow the user to pick an image from the library
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchImageLibraryAsync();//this function will launch the image library
      if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
      else Alert.alert("Permissions haven't been granted.");
    }
  }

  const takePhoto = async () => {//this function will allow the user to take a photo
    let permissions = await ImagePicker.requestCameraPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchCameraAsync();
      if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
      else Alert.alert("Permissions haven't been granted.");
    }
  }

  const getLocation = async () => {//this function will allow the user to send their location
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();//this function will request the user's location
      if (status !== 'granted') {
        Alert.alert("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});//this function will get the user's current location
      if (location) {
        onSend([{
          _id: `${userID}-${new Date().getTime()}`, // Generate a unique ID
          createdAt: new Date(),
          user: {
            _id: userID,
          },
          location: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
        }]);
      } else {
        Alert.alert("Error occurred while fetching location");
      }
    } catch (error) {
      console.error("Error fetching location: ", error);
      Alert.alert("Error fetching location", error.message);
    }
  };
    const generateReference = (uri) => {//this function will generate a reference for the image
    // this will get the file name from the uri
    const imageName = uri.split("/")[uri.split("/").length - 1];
    const timeStamp = (new Date()).getTime();
    return `${userID}-${timeStamp}-${imageName}`;
  }

  const uploadAndSendImage = async (imageURI) => {//this function will upload the image and send it
    const uniqueRefString = generateReference(imageURI);
    const newUploadRef = ref(storage, uniqueRefString);
    const response = await fetch(imageURI);
    const blob = await response.blob();
    uploadBytes(newUploadRef, blob).then(async (snapshot) => {
      const imageURL = await getDownloadURL(snapshot.ref);
      // Send the full message object with the image
      onSend([{
        _id: `${userID}-${new Date().getTime()}`, // Generate a unique ID
        createdAt: new Date(),
        user: {
          _id: userID,
          name: '',
        },
        image: imageURL,
      }]);
    });
  };

  return (//this is the '+' button that will open the action sheet
    <TouchableOpacity 
      style={styles.container}
      onPress={onActionPress}
      accessible={true}
      accessibilityLabel='More Options'
      accessibilityHint='Opens a menu with options to send a photo or your current location.'
      accessibilityRole='Button'
    >
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>+</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

export default CustomActions;