import React, { useLayoutEffect, useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { doc, onSnapshot, collection } from "@firebase/firestore";
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import { Avatar } from "react-native-elements";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/core";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomListItem from "../components/CustomListItem";
//import { ScrollView } from "react-native-gesture-handler";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [chats, setChats] = useState([]);
  const [account, setAccount] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "chats"), (snapshot) => {
      setChats(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
    return unsub;
  }, []);

  const logout = () => {
    signOut(auth)
      .then(() => {
        navigation.replace("Login");
      })
      .catch((error) => console.log(error.message));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Wave👋",
      headerStyle: {
        backgroundColor: "#fff",
      },
      headerTitleAlign: "center",
      headerTintColor: "#000",
      headerLeft: () => (
        <View className="">
          <TouchableOpacity onPress={() => setAccount(true)}>
            <Avatar rounded source={{ uri: auth?.currentUser?.photoURL }} />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View className="flex-row justify-between w-24">
          <TouchableOpacity
            activeOpacity={0.5}
            className="self-center"
            onPress={() => navigation.navigate("AddChat")}
          >
            <SimpleLineIcons name="pencil" size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.navigate("Bond")}
            className="border-2 border-purple-300/50 rounded-full shadow-2xl"
          >
            <Avatar rounded source={require("../assets/bond.png")} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const enterChat = (id, chatName) => {
    navigation.navigate("Chat", {
      id,
      chatName,
    });
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <Modal
        animationType="slide"
        visible={account}
        onRequestClose={() => {
          console.log("Modal has been closed.");
          setAccount(!account);
        }}
      >
        <View className="flex-1 h-full space-x-2 items-center bg-slate-200 rounded-t-2xl">
          <View className="p-3 flex-row w-full justify-between">
            <Text className="text-xl self-center">Account</Text>
            <TouchableOpacity
              className="bg-blue-600 rounded-full"
              onPress={() => setAccount(!account)}
            >
              <Image
                className="h-10 w-10 rounded-full"
                source={require("../assets/wave_lt.png")}
              />
            </TouchableOpacity>
          </View>
          <View className="pl-2 pr-4 w-full">
            <Text className="p-2 text-slate-600">Log Out</Text>
            <TouchableOpacity
              className="bg-blue-600 p-3 rounded"
              onPress={logout}
            >
              <Text className="self-center text-base text-white">Log Out</Text>
            </TouchableOpacity>
          </View>
          <View className="pl-2 pr-4 mt-5 w-full">
            <Text className="p-2 text-slate-600">
              Update Account (required for bonding🫂)
            </Text>
            <TouchableOpacity
              className="bg-[#570861] flex-row p-3 space-x-2 rounded"
              onPress={() => {
                navigation.navigate("UpdateProfile");
                console.log("update Account");
                setAccount(!account);
              }}
            >
              <View>
                <Avatar
                  rounded
                  source={{ uri: auth?.currentUser?.photoURL }}
                  size={40}
                />
              </View>
              <View className="">
                <Text className="self-start text-base text-white">
                  {auth?.currentUser?.displayName}
                </Text>
                <Text className="self-start text-sm text-slate-300">
                  {auth?.currentUser?.email}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View className="pl-2 pr-4 w-full mt-10">
            <Text className="p-2 text-slate-600">Register New User</Text>
            <TouchableOpacity
              className="bg-blue-600 p-3 rounded"
              onPress={() => {
                navigation.navigate("Register");
                setAccount(!account);
              }}
            >
              <Text className="self-center text-base text-white">Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView>
        {chats.map(({ id, data: { chatName } }) => (
          <CustomListItem
            key={id}
            id={id}
            chatName={chatName}
            enterChat={enterChat}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};
export default HomeScreen;
