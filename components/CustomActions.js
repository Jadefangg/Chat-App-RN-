import { TouchableOpacity, Text, View, StyleSheet, Alert } from "react-native";
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker'; //importing all the ImagePicker module offers from expo-image-picker.
import * as Location from 'expo-location';
//import MapView from 'react-native-maps'; NOT NEEDED in this file.
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage, userID }) => {//this function gives the user the ability to take a photo, choose a photo from the library, or send their location.

    const actionSheet = useActionSheet(); //hook for action sheet, the action sheet will be used to display the options to the user.

    const generateReference = (uri) => { //this function generates a unique reference for the image that is being uploaded.
        const timeStamp = (new Date()).getTime();
        const imageName = uri.split("/")[uri.split("/").length - 1];
        return `${userID}-${timeStamp}-${imageName}`;
      }
      const getLocation = async () => {//this function gets the user's location permissions and sends it with onSend.
        let permissions = await Location.requestForegroundPermissionsAsync();
        if (permissions?.granted) {
          const location = await Location.getCurrentPositionAsync({});//getCurrentPositionAsync gets the current location of the user.
          if (location) {
            onSend({
              location: {//this object contains the longitude and latitude of the user's location.
                longitude: location.coords.longitude,
                latitude: location.coords.latitude,
              },
            });
          } else Alert.alert("Error occurred while fetching location");
        } else Alert.alert("Permissions haven't been granted.");//if the user denies the location permissions, an alert will be shown.
    }

    const uploadAndSendImage = async (imageURI) => {//this function uploads the image to firebase storage and sends it with onSend.
        const uniqueRefString = generateReference(imageURI);
        const newUploadRef = ref(storage, uniqueRefString);
        const response = await fetch(imageURI);
        const blob = await response.blob();
        uploadBytes(newUploadRef, blob).then(async (snapshot) => {
          const imageURL = await getDownloadURL(snapshot.ref)
          onSend({ image: imageURL })
        });
      }
      const pickImage = async () => {
        let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();  //this function gets the user's media library permissions and sends it with onSend.
        if (permissions?.granted) {
          let result = await ImagePicker.launchImageLibraryAsync();
          if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
          else Alert.alert("Permissions haven't been granted.");
        }
      }
    
      const takePhoto = async () => {
        let permissions = await ImagePicker.requestCameraPermissionsAsync();
        if (permissions?.granted) {
          let result = await ImagePicker.launchCameraAsync();
          if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
          else Alert.alert("Permissions haven't been granted.");
        }
      }
      const onActionPress = () => {
        const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
        const cancelButtonIndex = options.length - 1;
        actionSheet.showActionSheetWithOptions(
          {
            options,
            cancelButtonIndex,
          },
          async (buttonIndex) => {
            switch (buttonIndex) {
              case 0:
                pickImage();
                return;
              case 1:
                takePhoto();
                return;
              case 2:
                getLocation();
              default:
            }
          },
        );
      };

    
    return (
        <TouchableOpacity style={styles.container} onPress={onActionPress}>
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
      fontSize: 10,
      backgroundColor: 'transparent',
      textAlign: 'center',
    },
  });

    export default CustomActions;
    
   