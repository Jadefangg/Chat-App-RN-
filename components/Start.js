import { useState } from 'react';
import { StyleSheet, View, Text, Button, TextInput, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { getAuth, signInAnonymously } from 'firebase/auth';

const Start = ({ navigation }) => {

  // State to set name
  const [name, setName] = useState('');
  // State to set background color
  const [background, setBackground] = useState('');

  const backgroundImage = require('../img/backgroundimage.jpg');

  const auth = getAuth();

  const signInUser = () => {
    signInAnonymously(auth)
      .then(result => {
        navigation.navigate("Chat", { userID: result.user.uid, name: name, background: background });
        Alert.alert("Signed in Successfully!");
      })
      .catch((error) => {
        Alert.alert("Unable to sign in, please try again later.");
      });
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundImage} resizeMode="cover" style={styles.image}>
        <Text style={styles.welcomeText}>Hello and welcome: {name}</Text>
        <TextInput
          style={styles.textInput}
          value={name}
          onChangeText={setName}
          placeholder='Type your username here'
          placeholderTextColor="#888"
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.colorButton, { backgroundColor: '#FF474C' }]}
            onPress={() => setBackground("#FF474C")}
          >
            <Text style={styles.buttonText}>Set Color!</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.colorButton, { backgroundColor: '#ADD8E6' }]}
            onPress={() => setBackground("#ADD8E6")}
          >
            <Text style={styles.buttonText}>Set Color!</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.colorButton, { backgroundColor: '#90EE90' }]}
            onPress={() => setBackground("#90EE90")}
          >
            <Text style={styles.buttonText}>Set Color!</Text>
          </TouchableOpacity>
        </View>
        <Button
          title="Go to Chat"
          onPress={() => {
            if (name === '') {
              Alert.alert('Please enter a name.');
            } else {
              signInUser();
            }
          }}
        />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  textInput: {
    width: "88%",
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  colorButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  welcomeText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
  },
});

export default Start;