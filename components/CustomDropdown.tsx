import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as FileSystem from 'expo-file-system';

export interface CustomDDOption {
  label: string;
  value: string;
  [key: string]: any;
}

interface DropdownProps {
  label: string;
  placeholder?: string;
  multiple?: boolean;
  onSelect: (selectedValues: string | string[]) => void;
  jsonFilePath?: string;
  jsonData?: any;
  mapJsonToOptions: (json: any) => CustomDDOption[];
  otherStyles?: string;
}

const CustomDropdown = ({
  label,
  placeholder,
  multiple,
  onSelect,
  jsonFilePath,
  jsonData,
  mapJsonToOptions,
  otherStyles,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string | string[]>(multiple ? [] : '');
  const [options, setOptions] = useState<CustomDDOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const optionsData = mapJsonToOptions(jsonData);
        setOptions(optionsData);
        setLoading(false);
      } catch (error) {
        console.error("Error loading JSON file:", error);
        setLoading(false);
      }
    };
    loadOptions();
  }, [jsonFilePath, jsonData, mapJsonToOptions]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (value: string) => {
    if (multiple) {
      const updatedSelection = (selectedValues as string[]).includes(value)
      ? (selectedValues as string[]).filter((val: string) => val !== value)
      : [...(selectedValues as string[]), value];
      setSelectedValues(updatedSelection);
      onSelect(updatedSelection);
    } else {
      setSelectedValues(value);
      onSelect(value);
      setIsOpen(false);
    }
  };

  const isSelected = (value: string) => {
    if (multiple) {
      return (selectedValues as string[]).includes(value);
    }
    return selectedValues === value;
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium ml-2">{label}</Text>
      <TouchableOpacity className={`${isOpen ? 'border-secondary' : 'border-black-200'} w-full h-16 px-4 bg-black-100 rounded-2xl border-2
       border-black-200 focus:border-secondary flex flex-row items-center`} 
       onPress={toggleDropdown}>
        <Text className={`flex-1 text-white font-psemibold text-base ${selectedValues === '' ?  'text-[#7B7B8B]' : 'text-white'}`}>
            {multiple ? 'Select' : (selectedValues || placeholder || 'Select')}</Text>
      </TouchableOpacity>
      {isOpen && (
        <View className=" w-[90%] rounded-xl mt-1 bg-gray-100 mx-5">
          {options.map((item: CustomDDOption) => (
            <TouchableOpacity
              key={item.label}
              className={`px-15 py-5 rounded-lg border-b-2 border-gray-200 ${selectedValues === item.label ? 'bg-secondary' : 'bg-gray-100'}`}
              onPress={() => handleSelect(item.label)}
            >
              <Text className={`mx-5 font-pregular`} >{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};


export default CustomDropdown;
