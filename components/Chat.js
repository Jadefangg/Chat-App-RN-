import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

const Chat = ({ db, userID, isConnected, cachemessages, loadCachedMessages}) => { //CHAT COMPONENT
  const [messages, setMessages] = useState([]);
  let unsub;
     //cachemessages is used to cache messages when user is online and helps us implement asyncstorage.
     //loadCahedMessages is used to load/retrieve the cached/saved messages when the user is offline.
  useEffect(() => {
    const fetchMessages = async () => {
      if (isConnected) {
        // Unregister current onSnapshot() listener to avoid registering multiple listeners
        if (unsub) unsub();
        unsub = null;

        const q = query(collection(db, "messages"), where("uid", "==", userID));
        unsub = onSnapshot(q, async (documentsSnapshot) => {
          let newMessages = [];
          documentsSnapshot.forEach(doc => {
            newMessages.push({ id: doc.id, ...doc.data() });
          });
          try { //  >>>>  TRY CATCH BLOCK <<<<<<<<<<
            await cachemessages(newMessages); //this function saves the messages to asyncstorage.
          } catch (error) {
            console.error("Error caching messages:", error);
          }
          setMessages(newMessages);
        });
      } else {
        try {
          await loadCachedMessages(); //calls the loadCachedList function and waits for it to complete.
          //the await keyword is used so that the loadCached Lists can first be resolved before being executed.
        } catch (error) {
          console.error("Error loading cached lists:", error);
        }
      }
    };

    fetchMessages();

    // Clean up code
    return () => {
      if (unsub) unsub();
    };
  }, [isConnected, db, userID, cachemessages, loadCachedMessages]);

  const renderCustomView = (props) => { //This function is used to render the custom view for the location message. It houses the MapView component.
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


  return (
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chat;