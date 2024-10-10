import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { collection, onSnapshot, query, where, addDoc,orderBy } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

const Chat = ({ route, navigation, db, isConnected, storage }) => {
  const { name , background, userID } = route.params;
  const [messages, setMessages] = useState([]);

  //sets name as name typed by user on mainscreen and sets background as user selected background
  useEffect(() => {
    navigation.setOptions({ title: name, color: background });
  }, []);
  

  
  let unsub;

  useEffect(() => {

    if (isConnected === true) {

      // unregister current onSnapshot() listener to avoid registering multiple listeners when
      // useEffect code is re-executed.
      if (unsub) unsub();
      unsub = null;

    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    unsub = onSnapshot(q, (docs) => {
      let newMessages = [];
      docs.forEach(doc => {
        newMessages.push({
          id: doc.id,
          ...doc.data(),
          createdAt: new Date(doc.data().createdAt.toMillis())
        })
      })
      cacheMessages(newMessages);
      setMessages(newMessages);
    });
  } else loadCachedMessages();


    return () => {
      if (unsub) unsub();
    } 
  }, [isConnected]);

    const cacheMessages = async (messagesToCache) => {
      try {
        await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
      } catch (error) {
        console.log(error.message);
      }
    }
  
    const loadCachedMessages = async () => {
      const cachedMessages = await AsyncStorage.getItem("messages") || [];
      setMessages(JSON.parse(cachedMessages));
    }
  
    const onSend = (newMessages) => {
      addDoc(collection(db, "messages"), newMessages[0])
    }
  
    const renderBubble = (props) => {
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
  
    const renderInputToolbar = (props) => {
      if (isConnected) return <InputToolbar {...props} />;
      else return null;
     }
  
     const renderCustomActions = (props) => {
      return <CustomActions storage={storage} {...props} />;
    };
  
    const renderCustomView = (props) => {
      const { currentMessage} = props;
      if (currentMessage.location) {
        return (
            <MapView
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
  
  
    return (
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