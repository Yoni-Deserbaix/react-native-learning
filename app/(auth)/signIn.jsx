import React, { useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Link, router } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CustomButton from "../../components/CustomButton";
import FieldForm from "../../components/FieldForm";
import { images } from "../../constants";
import { useGlobalContext } from "../../context/GlobalProvider";
import { getCurrentUser, signIn } from "../../lib/appwrite";

export default function SignIn() {
  const { setUser, isLoggedIn } = useGlobalContext();
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error, Please fill in all the fields");
    }

    setIsSubmitting(true);
    try {
      await signIn(form.email, form.password);

      // set it to global state
      const result = await getCurrentUser();
      setUser(result);
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      {/* Adjust automatically screen position when input is clicked */}
      <KeyboardAwareScrollView extraScrollHeight={150}>
        <ScrollView>
          <View className="w-full min-h-[83vh] justify-center px-4 my-6">
            <Image
              source={images.logo}
              className="w-[115px] h-[35px]"
              resizeMode="contain"
            ></Image>
            <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
              Log in to Aora
            </Text>
            <FieldForm
              title="Email"
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              otherStyles="mt-7"
              keyboardType="email-address"
              placeholder="Your email address"
            />
            <FieldForm
              title="Password"
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              otherStyles="mt-7"
              placeholder="Your password"
            />
            <CustomButton
              title="Sign In"
              handlePress={onSubmit}
              containerStyles="mt-7"
              isLoading={isSubmitting}
            />
            <View className="justify-center pt-5 flex-row gap-2">
              <Text className="text-base text-gray-100 font-pregular">
                Don't have account?
              </Text>
              <Link
                href="/signUp"
                className="text-base font-pregular text-secondary"
              >
                Sign Up
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
