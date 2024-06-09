import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

interface CustomAlertProps {
  visible: boolean;
  title?: string;
  message: string;
  onDismiss: () => void;
}

const CustomAlert = ({ visible, title, message, onDismiss }: CustomAlertProps) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View className="flex-1 justify-center items-center">
        <View className="bg-white rounded-lg p-10 items-center">
          {title && <Text className="text-primary font-psemibold text-2xl mb-10">{title}</Text>}
          <Text className="font-pregular text-center text-xl mb-10 text-primary">{message}</Text>
          <TouchableOpacity onPress={onDismiss} activeOpacity={0.7}
                className="bg-secondary rounded-lg p-10 pt-4 pb-4 text-center">
            <Text className="text-black font-psemibold text-lg">OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  okButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
  },
  okButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CustomAlert;
