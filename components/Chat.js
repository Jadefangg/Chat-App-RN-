import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Chat = ({ db, userID, isConnected, cachemessages, loadCachedLists }) => {
  const [messages, setMessages] = useState([]);
  let unsub;

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
          try {
            await cachemessages(newMessages);
          } catch (error) {
            console.error("Error caching messages:", error);
          }
          setMessages(newMessages);
        });
      } else {
        try {
          await loadCachedLists();
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
  }, [isConnected, db, userID, cachemessages, loadCachedLists]);

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        user={{ _id: userID }}
        renderBubble={(props) => (
          <Bubble
            {...props}
            wrapperStyle={{
              right: {
                backgroundColor: '#0084ff'
              }
            }}
          />
        )}
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