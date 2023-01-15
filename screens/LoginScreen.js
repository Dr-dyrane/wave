import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { Button, Input, Image } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/core";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginScreen = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const login = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
      })
      .catch((error) => {
        setError(error);
        alert(error.message);
      });
  };

  useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user);
          navigation.replace("Home");
        } else {
          setUser(null);
        }
        setLoadingInitial(false);
      }),
    []
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-200 items-center p-2.5 justify-center">
      <View className="bg-blue-700 m-4 w-36 h-36 shadow-lg shadow-black-1000/100 rounded-xl">
        <Image
          source={require("../assets/wave_lt.png")}
          className="w-36 h-36"
        />
      </View>
      <View className="">
        <TextInput
          placeholder="Email"
          className="bg-white m-2 w-72 py-2 px-3 rounded-lg text-base"
          autofocus
          type="email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          placeholder="Password"
          className="bg-white m-2 w-72 py-2 px-3 rounded-lg text-base"
          secureTextEntry
          type="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      <Button
        containerStyle={styles.button}
        onPress={login}
        title="Login"
        raised
        buttonStyle={{ backgroundColor: "#0037EC", borderRadius: 10 }}
      />
      <Button
        containerStyle={styles.button}
        type="outline"
        title="Register"
        buttonStyle={{ borderColor: "#0037EC", borderRadius: 10 }}
        titleStyle={{ color: "#0037EC" }}
        onPress={() => navigation.navigate("Register")}
      />
    </SafeAreaView>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  button: { width: 200, marginTop: 10, borderRadius: 10 },
});
