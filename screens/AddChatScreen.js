import React, { useLayoutEffect, useState } from "react";
import { View, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/core";
import { Button, Input } from "react-native-elements";
import { AntDesign } from "@expo/vector-icons";
import { auth, db } from "../firebase";
import { doc, setDoc, addDoc, collection } from "@firebase/firestore";
const AddChatScreen = () => {
  const navigation = useNavigation();
  const [input, setInput] = useState("");
  const createChat = () => {
    const user = auth.currentUser;
    const chatRef = collection(db, "chats");
    addDoc(chatRef, {
      chatName: input,
    })
      .then(() => {
        navigation.goBack();
      })
      .catch((error) => {
        alert(error.message);
      });
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Add a new chat",
      headerStyle: {
        backgroundColor: "#fff",
      },
      headerTitleAlign: "center",
      headerTintColor: "#000",
    });
  }, []);
  return (
    <SafeAreaView className="bg-white p-7 h-full">
      <View className=" rounded bg-gray-200 flex-row items-center py-2 px-3 mb-3 space-x-2">
        <AntDesign name="wechat" size={20} color="blue" />
        <TextInput
          placeholder="Enter a chat name"
          className="pl-10 text-base"
          type="email"
          value={input}
          onSubmitEditing={createChat}
          onChangeText={setInput}
        />
      </View>
      <Button
      disabled={!input}
        onPress={createChat}
        title="Create a new Chat"
        buttonStyle={{ backgroundColor: "#0037EC" }}
      />
    </SafeAreaView>
  );
};
export default AddChatScreen;
