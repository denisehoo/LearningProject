import React, { useState } from 'react';
import { Modal, View, TextInput, Button, StyleSheet } from 'react-native';
import CustomButton from './CustomButton';
import FormField from './FormField';

type CustomPopupProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
};

const CustomPopup = ({ visible, onClose, onSubmit }: CustomPopupProps) => {

  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    onSubmit(inputValue);
    setInputValue('');
    onClose();
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center">
        <View className="bg-primary border-2 border-gray-100 w-[95%] rounded-lg items-center">
          <FormField
            title="Name"
            value={inputValue}
            placeholder="Name for the image...."
            handleChangeText={setInputValue}
            otherStyles="mt-10 size-large mx-2"
            multiline={false}
          />
          <View className="flex-row self-center my-10">
            <CustomButton title="Submit" handlePress={handleSubmit} containerStyles="px-4 mx-4"/>
            <CustomButton title="Close" handlePress={onClose} containerStyles="px-4 mx-4"/>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  popup: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default CustomPopup;