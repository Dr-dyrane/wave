import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import AddChatScreen from "./screens/AddChatScreen";
import BondScreen from "./screens/BondScreen";
import MatchedScreen from "./screens/MatchedScreen";
import ChatScreen from "./screens/ChatScreen";
import MessageScreen from "./screens/MessageScreen";
import BondChatScreen from "./screens/BondChatScreen";
import UpdateProfileScreen from "./screens/UpdateProfileScreen";
import { StatusBar } from "expo-status-bar";
import RegisterScreen from "./screens/RegisterScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { KeyboardAvoidingView } from "react-native";
import React from "react";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <SafeAreaProvider>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 500}
      >
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: "#e2e8f0",
            },
            headerTitleAlign: "center",
            headerTintColor: "#0037EC",
            headerBackVisible: false,
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen
            screenOptions={{
              presentation: "modal",
            }}
            name="Register"
            component={RegisterScreen}
          />
          <Stack.Screen
            screenOptions={{
              presentation: "modal",
            }}
            name="UpdateProfile"
            component={UpdateProfileScreen}
          />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AddChat" component={AddChatScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Bond" component={BondScreen} />
          <Stack.Screen name="Message" component={MessageScreen} />
          <Stack.Screen name="Match" component={MatchedScreen} />
          <Stack.Screen name="BondChat" component={BondChatScreen} />
        </Stack.Navigator>
      </KeyboardAvoidingView>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
};

export default StackNavigator;
