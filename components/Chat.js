import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { GiftedChat } from "react-native-gifted-chat";

const Chat = ({route,navigation}) => {
    const { name } = route.params;
    useEffect(() => {
        navigation.setOptions({ title: name });
      }, []);
 return (
   <View style={styles.container}>
     <Text>Hello Screen!</Text>
   </View>
 );
}

const styles = StyleSheet.create({
 container: { 
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center'
 }
});

export default Chat;