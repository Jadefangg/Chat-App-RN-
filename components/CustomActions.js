import { TouchableOpacity, Text, View, StyleSheet, Alert } from "react-native";
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker'; //importing all the ImagePicker module offers from expo-image-picker.
import * as Location from 'expo-location';
//import MapView from 'react-native-maps'; NOT NEEDED in this file.
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

//CUSTOM ACTIONS COMPONENT <<<<<<<<<<<<<<<<<<<<<<<<<<<<
const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage, userID }) => {//this function gives the user the ability to take a photo, choose a photo from the library, or send their location.
  
  const actionSheet = useActionSheet(); //hook for action sheet, the action sheet will be used to display the options to the user.
  //0 
  const generateReference = (uri) => { //this function generates a unique reference string for the image that is being uploaded.
        const timeStamp = (new Date()).getTime();
        const imageName = uri.split("/")[uri.split("/").length - 1];
        return `${userID}-${timeStamp}-${imageName}`;
      }
    //1
      const getLocation = async () => {//this function gets the user's location permissions and sends it with onSend.
        let permissions = await Location.requestForegroundPermissionsAsync();
        if (permissions?.granted) {
          const location = await Location.getCurrentPositionAsync({});//getCurrentPositionAsync gets the current location of the user.
          if (location) {//if the location is successfully fetched, the location will be sent with onSend.
            onSend({
              location: {//this object contains the longitude and latitude of the user's location.
                longitude: location.coords.longitude,
                latitude: location.coords.latitude,
              },
            });
          } else Alert.alert("Error occurred while fetching location");
        } else Alert.alert("Permissions haven't been granted.");//if the user denies the location permissions, an alert will be shown.
    }
    //2
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
    //3
      const pickImage = async () => {//Picks an image from the user's media library and sends it with onSend.
        let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();  //this function gets the user's media library permissions and sends it with onSend.
        if (permissions?.granted) {
          let result = await ImagePicker.launchImageLibraryAsync();
          if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
          else Alert.alert("Permissions haven't been granted.");
        }
      }
    //4
      const takePhoto = async () => { //this function gets the user's camera permissions and sends it with onSend.
        let permissions = await ImagePicker.requestCameraPermissionsAsync();
        if (permissions?.granted) {
          let result = await ImagePicker.launchCameraAsync();
          if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
          else Alert.alert("Permissions haven't been granted.");
        }
      }
    //5
      const onActionPress = () => {//this function displays the action sheet with the options to the user.
        const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
        const cancelButtonIndex = options.length - 1; //cancel button will be the last option.
        actionSheet.showActionSheetWithOptions(
          {
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
    
   