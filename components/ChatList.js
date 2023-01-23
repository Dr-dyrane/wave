import { View, Text, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import { collection, onSnapshot, query, where } from "@firebase/firestore";
import { db,auth } from "../firebase";

import ChatRow from "../components/ChatRow";

const ChatList = () => {
  const [matches, setMatches] = useState([]);
  const user = auth?.currentUser;

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "matches"),
          where("usersMatched", "array-contains", user.uid)
        ),
        (snapshot) =>
          setMatches(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          )
      ),
    [user]
  );

  return matches.length > 0 ? (
    <FlatList
      className="h-full"
      data={matches}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ChatRow matchDetails={item} />}
    />
  ) : (
    <View className="p-5">
      <Text className="text-center text-lg">No matches at the moment 😥</Text>
    </View>
  );
};
export default ChatList;
