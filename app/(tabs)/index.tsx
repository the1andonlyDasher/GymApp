import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { createTables, getDBConnection, resetDatabase, } from '@/db/db';
import { SofiaSans_400Regular, SofiaSans_600SemiBold, useFonts } from "@expo-google-fonts/sofia-sans"
import CalendarComponent from '@/components/Calendar';
import CreatePreset from '@/components/CreatePreset';

interface Item {
  id: number;
  name: string;
  age: number;
}

interface ModalInterface {
  visible: boolean;
  onClose: () => void;
}

const CustomModal: React.FC<ModalInterface> = ({ visible, onClose }) => {
  const [fontsLoaded, error] = useFonts({ SofiaSans_400Regular, SofiaSans_600SemiBold })
  const [nameValue, setNameValue] = useState<string>('');
  const [ageValue, setAgeValue] = useState<string>('');

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(100);

  // Define animated styles using useAnimatedStyle
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  useEffect(() => {
    // Animate when the modal becomes visible
    if (visible) {

      opacity.value = withTiming(1, { duration: 300, easing: Easing.inOut(Easing.ease) });
      translateY.value = withTiming(0, { duration: 300, easing: Easing.inOut(Easing.ease) });
    } else {
      opacity.value = withTiming(0, { duration: 300, easing: Easing.inOut(Easing.ease) });
      translateY.value = withTiming(100, { duration: 300, easing: Easing.inOut(Easing.ease) });
    }
  }, [visible]);

  // Function to handle adding an entry
  const handleAddEntry = async (name: string, age: string) => {
    const db = await getDBConnection();
    // Convert age to a number before inserting
    const ageValue = parseInt(age);

    // Insert the data into the database
    if (name && !isNaN(ageValue)) {
      // Reset input fields after adding the entry
      setNameValue('');
      setAgeValue('');
      onClose()
    } else {
      Alert.alert("Input Error", "Please enter valid name and age."); // Simple validation
    }
  };

  return (
    <Animated.View style={[stylesModal.modal, animatedStyle]}>
      <Text style={stylesModal.modalText}>Enter your item!</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Name"
        value={nameValue}
        onChangeText={setNameValue}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Age"
        value={ageValue}
        onChangeText={setAgeValue}
      />
      <TouchableOpacity className='bg-green-800 rounded-sm w-full' onPress={() => handleAddEntry(nameValue, ageValue)}  >
        <Text className='text-white py-4 px-6 uppercase font-bold text-center'>Add to DB</Text>
      </TouchableOpacity>
      <TouchableOpacity className='bg-slate-800 rounded-sm w-full' onPress={onClose}  >
        <Text className='text-white py-4 px-6  font-bold text-center'>Close</Text>
      </TouchableOpacity>

    </Animated.View>
  );
};

const stylesModal = StyleSheet.create({
  modal: {
    position: 'absolute',
    width: "100%",
    top: '20%',
    left: '0%',
    zIndex: 10,
    transform: [{ translateX: -50 }, { translateY: -50 }],
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
    display: "flex",
    gap: 10,
    fontFamily: "SofiaSans_400Regular"
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default function Index(): JSX.Element {
  useEffect(() => {
    createTables()
  }, [])


  return (
    <View className='bg-[hsl(221,20%,7%)] flex flex-col gap-4 flex-1 justify-center items-center p-8'>
      <CreatePreset />
      <TouchableOpacity onPress={resetDatabase} className='bg-red-400 p-4'>
        <Text className='text-white'>Reset Database</Text>
      </TouchableOpacity>
    </View >
  );
}

const styles = StyleSheet.create({

  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    width: '90%',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  deleteButton: {
    color: 'red',
  },
});
