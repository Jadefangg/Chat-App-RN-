import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { collection, onSnapshot, query, where, addDoc,orderBy } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

const Chat = ({ route, navigation, db, isConnected, storage }) => {//this function displays the chat screen and allows the user to send messages, images, and locations.
  const { name , background, userID } = route.params;
  const [messages, setMessages] = useState([]);

  //sets name as name typed by user on mainscreen and sets background as user selected background
  useEffect(() => {
    navigation.setOptions({ title: name, color: background });
  }, []);
  

  
  let unsub;

  useEffect(() => {//this hook listens for changes in the messages collection and updates the messages state accordingly.

    if (isConnected === true) {

      // unregister current onSnapshot() listener to avoid registering multiple listeners when
      // useEffect code is re-executed.
      if (unsub) unsub();
      unsub = null;

    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));// this query gets the messages collection from Firestore and orders the messages by the time they were created.
    unsub = onSnapshot(q, (docs) => {
      let newMessages = [];
      docs.forEach(doc => {
        newMessages.push({
          id: doc.id,
          ...doc.data(),
          createdAt: new Date(doc.data().createdAt.toMillis())
        })
      })
      cacheMessages(newMessages);//this function caches the messages in AsyncStorage.
      setMessages(newMessages);//this function sets the messages state to the new messages.
    });
  } else loadCachedMessages();//this function loads the cached messages from AsyncStorage if the user is not connected.


    return () => {
      if (unsub) unsub();
    } 
  }, [isConnected]);

    const cacheMessages = async (messagesToCache) => {//this function caches the messages in AsyncStorage.
      try {
        await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
      } catch (error) {
        console.log(error.message);
      }
    }
  
    const loadCachedMessages = async () => {//this function loads the cached messages from AsyncStorage.
      const cachedMessages = await AsyncStorage.getItem("messages") || [];
      setMessages(JSON.parse(cachedMessages));
    }
  
    const onSend = (newMessages) => {//this function sends the new messages to Firestore.
      addDoc(collection(db, "messages"), newMessages[0])
    }
  
    const renderBubble = (props) => {//this function renders the chat bubbles with different styles for the sender and receiver.
      return <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000"
          },
          left: {
            backgroundColor: "#FFF"
          }
        }}
      />
    }
  
    const renderInputToolbar = (props) => {//this function renders the input toolbar if the user is connected.
      if (isConnected) return <InputToolbar {...props} />;
      else return null;
     }
  
     const renderCustomActions = (props) => {//this function renders the custom actions component.
      return <CustomActions storage={storage} {...props} />;
    };
  
    const renderCustomView = (props) => {//this function renders the custom view for the user's location.
      const { currentMessage} = props;
      if (currentMessage.location) {
        return (
            <MapView //this map view will display the user's location.
              style={{width: 150,
                height: 100,
                borderRadius: 13,
                margin: 3}}
              region={{
                latitude: currentMessage.location.latitude,
                longitude: currentMessage.location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            />
        );
      }
      return null;
    }
  
  
    return (//this function returns the GiftedChat component with the messages, renderBubble, renderInputToolbar, renderCustomActions, and renderCustomView functions.
      <View style={[styles.mcontainer, {backgroundColor: "purple"}]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        onSend={messages => onSend(messages)}
        user={{
          _id: userID,
          name: name
      }}
      />
      { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
      {Platform.OS === "ios"?<KeyboardAvoidingView behavior="padding" />: null}
      </View>
    )
  //  return (
  //    <View style={[styles.container,
  //    {backgroundColor: background}]}>
  //      <Text>Hello {name}!</Text>
  //    </View>
  //  );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    mcontainer: {
      flex: 1
    }
  });
  
  export default Chat;