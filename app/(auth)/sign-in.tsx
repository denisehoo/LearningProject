import { useState } from "react";
import { Link, router } from "expo-router";
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";

import { images } from "../../constants";
import { CustomButton, FormField, CustomAlert } from "../../components";
import { getCurrentUser, signIn , getEmailToken} from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const SignIn = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    passcode: "",
  });

  const [alertData, setAlertData] = useState<{ visible: boolean; title: string; message: string }>({
    visible: false,
    title: '',
    message: '',
  });


  const handleShowAlert = (title: string, message:string) => {
    setAlertData({
      visible: true,
      title: title,
      message: message,
    });
  };

  const handleDismissAlert = () => {
    setAlertData({ ...alertData, visible: false });
  };

  const getVerification = async () => {
    await getEmailToken(form.email);
  }

  const submit = async () => {
    
    if (form.email === "" || form.passcode === "") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
      return handleShowAlert("Error!", "Please fill in all fields.");
    }

    setSubmitting(true);

    try {
      await signIn(form.email, form.passcode);
      const result = await getCurrentUser();
      setUser(result);
      setIsLogged(true);

      handleShowAlert("Success!", "User signed in successfully.");
      router.replace("/home");
    } catch (error: any) {
      handleShowAlert("Error!", error.message);
    } finally {
      setSubmitting(false);
    } 
  };


  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center m-h-[83vh] px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <Image
            source={images.logoSmall}
            resizeMode="contain"
            className="w-[34px] h-[34px] object-left"
          />

          <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
            Log in to Cubator
          </Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyBoardStyle="email-address"
          />

          <CustomButton
            title="Send OTP to email"
            handlePress={getVerification}
            containerStyles="mt-7"
          />

          <FormField
            title="OTP for Cubator Login"
            value={form.passcode}
            handleChangeText={(e) => setForm({ ...form, passcode: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-psemibold text-secondary"
            >
              Signup
            </Link>
          </View>
        </View>
      </ScrollView>
      <CustomAlert
        visible={ alertData.visible }
        title={ alertData.title }
        message={ alertData.message }
        onDismiss={ handleDismissAlert }
      />
    </SafeAreaView>
  );
}

export default SignIn;
