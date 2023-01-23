import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/core";
import getMatchedUserInfo from "../lib/getMatchedUserInfo";
import {
  addDoc,
  query,
  orderBy,
  collection,
  onSnapshot,
  serverTimestamp,
} from "@firebase/firestore";
import { db, auth } from "../firebase";

const ChatRow = ({ matchDetails }) => {
  const navigation = useNavigation();
  const user = auth?.currentUser;
  const [matchedUserInfo, setMatchedUserInfo] = useState(null);
  const [lastMessage, setLastMessage] = useState("");

  useEffect(() => {
    setMatchedUserInfo(getMatchedUserInfo(matchDetails.users, user.uid));
  }, [matchDetails, user]);

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "matches", matchDetails.id, "bondmessages"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => setLastMessage(snapshot.docs[0]?.data()?.message)
      ),
    [matchDetails, db]
  );

  return (
    <TouchableOpacity
      style={styles.cardShadow}
      onPress={() =>
        navigation.navigate("Message", {
          matchDetails,
        })
      }
      className="flex-row items-center py-3 px-5 bg-white mx-3 my-1 rounded-lg overflow-scroll"
    >
      <Image
        className="rounded-full h-16 w-16 mr-10"
        source={{ uri: matchedUserInfo?.photoURL }}
      />
      <View>
        <Text className="text-lg font-semibold">
          {matchedUserInfo?.displayName}
        </Text>
        <Text>{lastMessage || "Say Hi!"}</Text>
      </View>
    </TouchableOpacity>
  );
};
export default ChatRow;

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
