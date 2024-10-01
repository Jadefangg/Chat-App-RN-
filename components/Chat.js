//TEST RUN ON EXPO GO HAS TO BE DONE <<<<
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { GiftedChat, Bubble } from "react-native-gifted-chat"; // Chat framework and its prop.

const Chat = () => { // Chat function with 2 users and messages.
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "messages"), (documentsSnapshot) => {
      let newMessages = [];
      documentsSnapshot.forEach(doc => {
        newMessages.push({ id: doc.id, ...doc.data() })
      });
      setMessages(newMessages);
    });

    // this is used to unsubscribe from the snapshot listener and clean up the listener
    return () => {
      if (unsub) unsub();
    }
   
  }, []);

  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0])
  }
  const onPress = () => {
    // Handle button press
  };

  const renderBubble = (props) => { // BUBBLE
    return (
      <Bubble
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
    );
  };

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble} // Prop which lets us customize chat speech bubbles.
        onSend={newMessages => onSend(newMessages)}
        user={{
          _id: 1,
        }}
      />
      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null} {/* Prop which makes sure textbox isn't hidden by keyboard. */}
      <TouchableOpacity // Accessibility features
        accessible={true}
        accessibilityLabel="More options"
        accessibilityHint="Lets you choose to send an image or your geolocation."
        accessibilityRole="button"
        onPress={onPress}
      >
        <View style={styles.button}> 
          {/* Add button content here */}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    // Add button styles here
  },
});

export default Chat;