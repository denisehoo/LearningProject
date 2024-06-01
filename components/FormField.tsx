import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Keyboard, NativeSyntheticEvent, TextInputKeyPressEventData, KeyboardTypeOptions, TextInputBase, TextInputComponent, NativeUIEvent } from "react-native";

import { icons } from "../constants";

interface FormFieldProps{
  title: string;
  value: string;
  placeholder?: string;
  handleChangeText: (text:string) => void;
  otherStyles?: string;
  keyBoardStyle?: string;
  multiline?: boolean;
  numberOfLines?: number;
}

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  ...rest
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium ml-2">{title}</Text>

      <View className={`w-full h-16 px-4 bg-black-100 rounded-2xl border-2
       border-black-200 focus:border-secondary flex flex-row items-center ${rest.multiline?"focus:h-20":"focus:h-16"}`}>
        <TextInput
          className="flex-1 text-white font-psemibold" 
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          keyboardType={!rest.keyBoardStyle ? "default" : rest.keyBoardStyle as KeyboardTypeOptions}
          multiline={rest.multiline}
          numberOfLines={rest.numberOfLines}
          blurOnSubmit={rest.multiline}
          {...rest}
        />

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
