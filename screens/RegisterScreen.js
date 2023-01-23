import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Input } from "react-native-elements";
import { useNavigation } from "@react-navigation/core";
import { auth } from "../firebase";
import { Button } from "react-native-paper";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";

const RegisterScreen = () => {
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageURL, setImageURL] = useState("");
  const navigation = useNavigation();

  const register = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        updateProfile(user, {
          displayName: name,
          photoURL:
            imageURL ||
            "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2:",
        })
          .then(() => {
            console.log(user);
          })
          .catch((error) => {
            alert(error.message);
          });
      })
      .catch((error) => {
        setError(error);
        alert(error.message);
      });
  };

  return (
    <View className="bg-slate-200 p-2.5 flex-1 items-center justify-center">
      <Text className="mb-12 text-blue-700 text-2xl">
        Create a Wave👋 account
      </Text>
      <View>
        <TextInput
          placeholder="Full Name"
          className="bg-white m-2 w-72 py-2 px-3 rounded-lg text-base"
          autofocus
          //inputStyle={{ color: "#0048DB" }}
          type="text"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          placeholder="Email"
          className="bg-white m-2 w-72 py-2 px-3 rounded-lg text-base"
          //inputStyle={{ color: "#0048DB" }}
          type="email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          //inputStyle={{ color: "#0048DB" }}
          className="bg-white m-2 w-72 py-2 px-3 rounded-lg text-base"
          type="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TextInput
          placeholder="Profile Picture URL (optional)"
          //inputStyle={{ color: "#0048DB" }}
          className="bg-white m-2 w-72 py-2 px-3 rounded-lg text-base"
          type="text"
          value={imageURL}
          onChangeText={(text) => setImageURL(text)}
          onSubmitEditing={register}
        />
      </View>
      <Button
        textColor="white"
        elevated
        onPress={register}
        className="mt-8 py-1 w-72 bg-[#0037EC] rounded-lg"
      >
        <Text className="text-base">Register</Text>
      </Button>
    </View>
  );
};
export default RegisterScreen;
