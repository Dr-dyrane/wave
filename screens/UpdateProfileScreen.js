import { View, Image, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { db, auth, storage } from "../firebase";
import { doc, setDoc, serverTimestamp } from "@firebase/firestore";
import { updateProfile } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/core";

const UpdateProfileScreen = () => {
  const user = auth?.currentUser;
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [occupation, setOccupation] = useState(null);
  const [age, setAge] = useState(null);

  const incompleteForm = !imageURL || !occupation || !age;
  const navigation = useNavigation();

  const pickImage = async () => {
    const photo = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!photo.canceled) {
      setImage(photo.assets[0].uri);
      console.log(photo.assets[0]);
      uploadImage();
    } else {
      alert("You did not select any image.");
    }
  };

  const uploadWithProgress = () => {
    uploadImage();
    setImage(null);
  };

  const file = {
    uri: image,
    name: user.displayName,
    type: "image",
  };
  const metadata = {
    contentType: "image/jpeg",
  };
  const uploadImage = async () => {
    const response = await fetch(image);
    const blob = await response.blob();
    const imageRef = ref(storage, "images/ " + file.name);
    const uploadTask = uploadBytesResumable(imageRef, blob, metadata);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        switch (error.code) {
          case "storage/unauthorized":
            break;
          case "storage/canceled":
            break;
          case "storage/unknown":
            break;
        }
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setImageURL(downloadURL);
        });
      }
    );
  };

  const updateUserProfile = () => {
    setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      displayName: user.displayName,
      photoURL: imageURL,
      occupation: occupation,
      age: age,
      timestamp: serverTimestamp(),
    })
      .then(() => {
        navigation.navigate("Bond");
      })
      .catch((error) => {
        alert(error.message);
      });
    updateProfile(user, {
      photoURL: imageURL,
    });
  };

  return (
    <SafeAreaView className="flex-1 items-center py-1">
      <Image
        className="h-14 w-full mb-4"
        resizeMode="contain"
        source={require("../assets/Bond_banner.png")}
      />
      <Text className="text-gray-500 p-2 font-bold text-xl">
        Welcome {user.displayName}
      </Text>

      <Text className="text-center p-4 font-bold text-[#570861]">
        Step 1: The Profile Pic
      </Text>
      <View className="bg-[#570861] rounded-lg p-6 w-80">
        {!image ? (
          <Text className="text-slate-200 self-center  mb-4">
            Select a Profile Picture from your gallery
          </Text>
        ) : (
          <Text className="text-slate-200 self-center  mb-4">
            Please upload your selected Profile Picture
          </Text>
        )}

        <View className="flex-row space-x-2 justify-between">
          <Image
            className="h-16 w-16 rounded-full"
            source={{ uri: imageURL ? imageURL : user.photoURL }}
          />

          <Image
            className="h-16 w-16 rounded-full"
            source={{
              uri:
                image ||
                "https://images.pexels.com/photos/2112730/pexels-photo-2112730.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            }}
          />
          <TouchableOpacity
            onPress={pickImage}
            className="self-center rounded-full h-16 w-16 bg-[#6d0a79]"
          >
            <AntDesign
              style={{ alignSelf: "center", marginTop: 15 }}
              name="camerao"
              size={30}
              color="#e2e8f0"
            />
          </TouchableOpacity>
          {image ? (
            <TouchableOpacity
              onPress={uploadWithProgress}
              className="self-center rounded-full h-16 w-16 bg-[#6d0a79]"
            >
              <AntDesign
                style={{ alignSelf: "center", marginTop: 15 }}
                name="upload"
                size={26}
                color="#e2e8f0"
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <Text className="text-center p-4 font-bold text-[#570861]">
        Step 2: The Occupation
      </Text>
      <TextInput
        value={occupation}
        onChangeText={setOccupation}
        className="text-center text-xl pb-2"
        placeholder="Enter your occupation"
      />

      <Text className="text-center p-4 font-bold text-[#570861]">
        Step 3: The Age
      </Text>
      <TextInput
        value={age}
        onChangeText={setAge}
        className="text-center text-xl pb-2"
        placeholder="Enter your age"
        maxLength={2}
        keyboardType="numeric"
      />
      <TouchableOpacity
        disabled={incompleteForm}
        className={
          incompleteForm
            ? "w-64 p-3 bg-gray-400 rounded-xl absolute bottom-10 "
            : "w-64 p-3 bg-[#570861] rounded-xl absolute bottom-10"
        }
        onPress={updateUserProfile}
      >
        <Text className="text-center text-white text-xl">Update Profile</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
export default UpdateProfileScreen;
