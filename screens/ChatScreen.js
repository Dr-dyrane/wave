import React, { useLayoutEffect, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  doc,
  setDoc,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  collection,
  serverTimestamp,
} from "@firebase/firestore";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { Avatar } from "react-native-elements";
import { useNavigation, useRoute } from "@react-navigation/core";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { Button, Input } from "react-native-elements";

const ChatScreen = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { id, chatName } = params;
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const user = auth.currentUser;

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "chats", id, "messages"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) =>
          setMessages(
            snapshot.docs.map((doc) => ({
              _id: doc.id,
              data: doc.data(),
            }))
          )
      ),
    [id, db]
  );

  const sendMessage = () => {
    Keyboard.dismiss();

    const chatRef = collection(db, "chats", id, "messages");
    addDoc(chatRef, {
      timestamp: serverTimestamp(),
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      message: input,
    });
    setInput("");
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitleAlign: "left",
      headerTitle: () => (
        <View className="flex-row items-center space-x-2">
          <Avatar
            rounded
            source={{
              uri:
                messages[0]?.data.photoURL ||
                "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            }}
          />
          <Text className="text-base">{chatName}</Text>
        </View>
      ),
      headerRight: () => (
        <View className="flex-row space-x-4">
          <TouchableOpacity>
            <FontAwesome name="video-camera" size={18} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="call" size={18} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, messages]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
          <ScrollView inverted={true}>
            {messages.reverse().map(({ _id, data }) =>
              data?.email === user.email ? (
                <View
                  key={_id}
                  className="flex-row bg-blue-700 rounded-lg rounded-tr-none px-4 py-3 mx-3 my-2 self-start ml-auto space-x-3"
                >
                  <Avatar rounded source={{ uri: user.photoURL }} />
                  <Text className="self-center text-white">{data.message}</Text>
                </View>
              ) : (
                <View
                  key={_id}
                  className="flex-row bg-slate-200 rounded-lg rounded-tl-none px-4 py-3 mx-3 my-2 self-start ml-4 space-x-3"
                >
                  <Avatar rounded source={{ uri: data.photoURL }} />
                  <View>
                    <Text className="">{data.message}</Text>
                    <Text className="text-xs text-slate-700">
                      {data.displayName}
                    </Text>
                  </View>
                </View>
              )
            )}
          </ScrollView>
          <View className="flex-row items-center space-x-4 p-4">
            <TextInput
              className="flex-1 px-4 py-2 rounded-xl text-lg bg-[#ECECEC]"
              placeholder="Wave a message👋..."
              onChangeText={setInput}
              onSubmitEditing={sendMessage}
              value={input}
            />
            <TouchableOpacity className="" onPress={sendMessage}>
              <Ionicons name="send" size={20} color="#0037EC" />
            </TouchableOpacity>
          </View>
        </>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};
export default ChatScreen;
