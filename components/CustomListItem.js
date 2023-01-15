import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
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

const CustomListItem = ({ id, chatName, enterChat }) => {
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() =>
    onSnapshot(
      query(
        collection(db, "chats", id, "messages"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => setChatMessages(snapshot.docs.map((doc) => doc.data()))
    )
  );

  return (
    <ListItem onPress={() => enterChat(id, chatName)} key={id} bottomDivider>
      <Avatar
        rounded
        source={{
          uri:
            chatMessages?.[0]?.photoURL ||
            "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        }}
      />
      <ListItem.Content>
        <ListItem.Title className="font-extrabold">{chatName}</ListItem.Title>
        {chatMessages?.[0]?.message ? (
          <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
            {chatMessages?.[0]?.displayName} : {chatMessages?.[0]?.message}
          </ListItem.Subtitle>
        ) : (
          <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
            No Waves👋 yet
          </ListItem.Subtitle>
        )}
      </ListItem.Content>
    </ListItem>
  );
};
export default CustomListItem;
