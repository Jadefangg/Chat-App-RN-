import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { GiftedChat, Bubble } from "react-native-gifted-chat"; // Chat framework and its prop.

const Chat = () => { // Chat function with 2 users and messages.
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {// Message 1
        _id: 1,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
      {// Message 2
        _id: 2,
        text: 'This is a system message', 
        createdAt: new Date(),
        system: true,
      },
    ]);
  }, []);

  const onSend = (newMessages) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
  };

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