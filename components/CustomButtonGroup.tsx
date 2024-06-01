import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ButtonOption {
  value: string;
  label: string;
}

interface CustomButtonGroupProps {
  options: ButtonOption[];
  onSelect: (selectedValue: string) => void;
  defaultValue?: string;
  label:string;
  otherStyles?: string;
}

const CustomButtonGroup = ({ options, onSelect, defaultValue, label, otherStyles}: CustomButtonGroupProps) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(defaultValue || null);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    onSelect(value);
  };

  return (
    <View className={`space-y-2 ${otherStyles}`}>
        <Text className="text-base text-gray-100 font-pmedium ml-2">{label}</Text>
        <View className="flex-row mb-2">
        {options.map((option: ButtonOption) => (
            <TouchableOpacity
            key={option.value}
            className={`flex-1 px-15 py-5 border-2 bg-black-100 rounded-2xl border-black-200 mx-1 items-center
            ${selectedValue === option.value ? 'bg-secondary text-black' : 'bg-black-100 text-white'}`}
            onPress={() => handleSelect(option.value)}
            >
            <Text className={`text-base
            ${selectedValue === option.value ? 'text-black font-psemibold' :  'text-white font-pregular'}`}>
                {option.label}
            </Text>
            </TouchableOpacity>
        ))}
        </View>
    </View>
  );
};


export default CustomButtonGroup;
