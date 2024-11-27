// app/mesocycles/[mesocycleId]/index.tsx
import React, { useEffect, useState } from 'react';
import { FlatList, Text, Button, View, TouchableOpacity, TextInput } from 'react-native';
import { Link, useRouter, useLocalSearchParams, usePathname, Href } from 'expo-router';
import useItemStore from '@/app/stores/store';


export default function ExercisesScreen() {
    const { mesocycle_id, microcycle_id, workout_id, exercise_id } = useLocalSearchParams();
    const { loadSets, addSet, deleteSet, sets } = useItemStore();
    const router = useRouter();
    const [numReps, setNumReps] = useState<string>("")
    const [rpeScale, setRpeScale] = useState<string>("")
    const [amtWeight, setAmtWeight] = useState<string>("")
    const path = usePathname()

    useEffect(() => {
        loadSets(parseInt(exercise_id as string));
    }, [exercise_id]);

    return (
        <View className='flex bg-slate-950 w-full h-full justify-start flex-col'>
            <Text className='text-white font-bold text-3xl text-center p-4'>Sets</Text>
            <FlatList
                className='bg-slate-950 p-4 m-2 border-[#16213b] rounded-xs flex fle-col gap-10'
                contentContainerStyle={{ justifyContent: "space-evenly", gap: 20 }}
                data={sets}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        className='bg-[#151f38] border-slate-800 border rounded-sm p-4 flex flex-col gap-4'
                        onPress={() => router.push(`${mesocycle_id}/${microcycle_id}/${workout_id}/${exercise_id}/${item.id}` as Href)}

                    >
                        <View className='border-bottom border-slate-400 w-full'>
                            <Text
                                className=' text-white text-bold text-2xl'>
                                Set {item.id}
                            </Text>
                        </View>
                        <View className='flex flex-row gap-4 justify-between'>
                            <View className='flex flex-col gap-2 justify-center items-center'>
                                <Text className='text-slate-700 font-bold text-md'>Reps</Text>
                                <Text className='text-white font-semibold text-xl'>{item.reps}</Text>
                            </View>
                            <View className='flex flex-col gap-2 justify-end items-end'>
                                <Text className='text-white font-semibold text-xl'>x</Text>
                            </View>
                            <View className='flex flex-col gap-2 justify-center items-center'>
                                <Text className='text-slate-700 font-bold text-md'>Weight</Text>
                                <Text className='text-white font-semibold text-xl'>{item.weight} kg</Text>
                            </View>

                            <View className='flex flex-col gap-2 justify-center items-center'>
                                <Text className='text-slate-700 font-bold text-md'>RPE</Text>
                                <Text className='text-white font-semibold text-xl'>{item.rpe}</Text>
                            </View>
                        </View>
                        <Text className='text-white font-semibold text-xl hidden'>{item.id}</Text>
                        < TouchableOpacity className='bg-indigo-800 rounded-xs w-full' onPress={() => deleteSet(item.id)}>
                            <Text className='text-white py-2 px-4  font-bold text-center'>Remove</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
            />
            <View className='flex flex-col gap-6 justify-center'>
                <Text className='text-slate-400 text-center'>Choose Set params</Text>
                <TextInput
                    className='bg-slate-300 w-4/5 m-auto p-4 rounded-md'
                    placeholder='Reps...'
                    onChangeText={setNumReps}
                    value={numReps}
                />
                <TextInput
                    className='bg-slate-300 w-4/5 m-auto p-4 rounded-md'
                    placeholder='Weight...'
                    onChangeText={setAmtWeight}
                    value={amtWeight}
                />
                <TextInput
                    className='bg-slate-300 w-4/5 m-auto p-4 rounded-md'
                    placeholder='Rpe...'
                    onChangeText={setRpeScale}
                    value={rpeScale}
                />
                <TouchableOpacity className='bg-slate-800 rounded-xs w-full' onPress={() => { addSet(Number(exercise_id), parseInt(numReps), parseInt(amtWeight), parseInt(rpeScale)), setAmtWeight(""), setNumReps(""), setRpeScale("") }} disabled={!rpeScale && !amtWeight && !numReps}>
                    <Text className='text-white py-4 px-6  font-bold text-center'>Add Set</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
