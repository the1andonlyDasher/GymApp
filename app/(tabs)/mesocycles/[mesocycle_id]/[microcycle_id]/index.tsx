// app/mesocycles/[mesocycleId]/index.tsx
import React, { useEffect, useState } from 'react';
import { FlatList, Text, Button, View, TouchableOpacity, TextInput } from 'react-native';
import { Link, useRouter, useLocalSearchParams, usePathname, Href } from 'expo-router';
import useItemStore from '@/app/stores/store';
import { SofiaSans_700Bold, useFonts } from '@expo-google-fonts/sofia-sans';

export default function MicrocyclesScreen() {
    const [loaded, error] = useFonts({ SofiaSans_700Bold })
    const { mesocycle_id, microcycle_id } = useLocalSearchParams();
    const path = usePathname()
    const { loadWorkouts, addWorkout, deleteWorkout, workouts } = useItemStore();
    const router = useRouter();
    const [workoutName, setWorkoutName] = useState<string>("")


    useEffect(() => {
        loadWorkouts(parseInt(microcycle_id as string));
    }, [microcycle_id]);

    return (
        <View className={`flex bg-slate-950 w-full h-full justify-start flex-col`}>
            <Text style={{ fontFamily: "SofiaSans_700Bold" }} className='text-white font-bold text-3xl text-center p-4'>Workouts</Text>
            <FlatList
                className='bg-slate-900 p-4 m-2 border-[#16213b] rounded-xs flex flex-col gap-6'
                contentContainerStyle={{ justifyContent: "space-evenly", gap: 10 }}
                data={workouts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        className='bg-[#151f38] border-slate-800 border rounded-sm p-4 flex flex-col gap-4'
                        onPress={() => router.push(`mesocycles/${mesocycle_id}/${microcycle_id}/${item.id}` as Href)}
                    >
                        <Text className='text-white font-semibold text-xl'>{item.name}</Text>
                        <Text className='text-white font-semibold text-xl'>{item.id}</Text>
                        < TouchableOpacity className='bg-rose-700 rounded-xs w-full' onPress={() => deleteWorkout(item.id)}>
                            <Text className='text-white py-2 px-4  font-bold text-center'>Remove</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
            />
            <View className='flex flex-col gap-6 justify-center'>
                <Text className='text-slate-400 text-center'>Choose your workout name</Text>
                <TextInput
                    className='bg-slate-300 w-4/5 m-auto p-4 rounded-md'
                    placeholder='Workout Name...'
                    onChangeText={setWorkoutName}
                    value={workoutName}
                >

                </TextInput>
                <TouchableOpacity className='bg-slate-800 rounded-xs w-full' onPress={() => { addWorkout(Number(microcycle_id), workoutName), setWorkoutName("") }} disabled={!workoutName}>
                    <Text className='text-white py-4 px-6  font-bold text-center'>Add Workout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
