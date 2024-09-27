import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { GiftedChat } from "react-native-gifted-chat";



const Chat = () => {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
    ]);
  }, []);
  const onSend = (newMessages) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
  }
  
  return (
    <GiftedChat
      messages={messages}
      onSend={newMessages => onSend(newMessages)}
      user={{
        _id: 1,
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

 export default Chat;





// const Chat = ({route,navigation}) => {
//     const { name } = route.params;
//     useEffect(() => {
//         navigation.setOptions({ title: name });
//       }, []);
//  return (
//    <View style={styles.container}>
//      <Text>Hello Screen!</Text>
//    </View>
//  );
// }

// const styles = StyleSheet.create({
//  container: { 
//    flex: 1,
//    justifyContent: 'center',
//    alignItems: 'center'
//  }
// });

