// app/mesocycles/[mesocycleId]/index.tsx
import React, { useEffect, useState } from 'react';
import { FlatList, Text, Button, View, TouchableOpacity, TextInput } from 'react-native';
import { Link, useRouter, useLocalSearchParams, usePathname, Href } from 'expo-router';
import useItemStore from '@/app/stores/store';
import Ionicons from "@expo/vector-icons/Ionicons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowAltCircleDown } from "@fortawesome/free-solid-svg-icons";


export default function ExercisesScreen() {
    const { mesocycle_id, microcycle_id, workout_id, exercise_id } = useLocalSearchParams();
    const { loadSets, addSet, deleteSet, sets } = useItemStore();
    const router = useRouter();
    const [open, setOpen] = useState(false)
    const [numReps, setNumReps] = useState<string>("")
    const [rpeScale, setRpeScale] = useState<string>("")
    const [amtWeight, setAmtWeight] = useState<string>("")
    const path = usePathname()

    useEffect(() => {
        loadSets(parseInt(exercise_id as string));
    }, [exercise_id, sets]);

    const getStyleBasedOnValue = (value: number) => {
        if (value === 0) {
            return "#4e9b43"; // green
        } else if (value >= 8 && value < 10) {
            return "#d1b339"; // yellow
        } else if (value >= 10) {
            return "#871f1f"; // red
        }
        return "#4e9b43"; // default color
    };

    return (
        <View className='flex bg-[hsl(210,5%,7%)]   w-full h-full justify-start flex-col'>
            <Text className='text-white font-bold text-3xl text-center p-4'>Sets</Text>
            <FlatList
                className=' p-4 m-2 bg-[hsl(210,5%,7%)] rounded-xs flex fle-col gap-10'
                contentContainerStyle={{ justifyContent: "space-evenly", gap: 20 }}
                data={sets}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        className='bg-[hsl(221,20%,16%)] border-[hsl(221,20%,20%)] border rounded-sm p-4 flex flex-col gap-4'
                        onPress={() => router.push(`${mesocycle_id}/${microcycle_id}/${workout_id}/${exercise_id}/${item.id}` as Href)}

                    >
                        <View className='flex flex-row gap-6 justify-between'>
                            <View className='flex flex-col gap-2 justify-center items-center'>
                                <Text className='text-[hsl(221,20%,50%)] font-bold text-md'>Reps</Text>
                                <Text className='text-white font-semibold text-xl'>{item.reps}</Text>
                            </View>
                            <View className='flex flex-col gap-2 justify-end items-end'>
                                <Text className='text-white font-semibold text-xl'>x</Text>
                            </View>
                            <View className='flex flex-col gap-2 justify-center items-center'>
                                <Text className='text-[hsl(221,20%,50%)] font-bold text-md'>Weight</Text>
                                <Text className='text-white font-semibold text-xl'>{item.weight} kg</Text>
                            </View>

                            <View className='flex flex-col gap-2 justify-center items-center'>
                                <Text
                                    className='text-[hsl(221,20%,50%)] font-bold text-md'>RPE</Text>
                                <Text
                                    style={{ color: `${getStyleBasedOnValue(item.rpe)}` }}
                                    className='text-white font-semibold text-xl'>{item.rpe}</Text>
                            </View>
                            <TouchableOpacity
                                className="bg-rose-700 rounded-md max-w-12 my-auto flex items-center justify-center aspect-square"
                                onPress={() => deleteSet(item.id)}
                            >
                                <Ionicons name="trash-bin" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                        <Text className='text-white font-semibold text-xl hidden'>{item.id}</Text>
                    </TouchableOpacity>
                )}
            />
            <View className='flex flex-col gap-4 justify-center'>
                <TouchableOpacity onPress={() => { setOpen(!open) }} className={'flex flex-row gap-6 bg-[hsl(221,20%,15%)] rounded-md p-3 items-center justify-center'}>
                    <Text className='text-slate-400 text-center'>Add Set</Text>
                    <Ionicons size={20} name={'arrow-up'} color={'white'} />
                </TouchableOpacity>

                <View className={`grid ${open ? 'grid-rows-[1fr] h-auto' : 'grid-rows-[0fr] h-0'}  gap-8 overflow-hidden w-full`}>

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
                    <TouchableOpacity className='flex justify-center items-center bg-[hsl(221,20%,25%)] rounded-xs w-full py-4' onPress={() => { setOpen(false), addSet(Number(exercise_id), parseInt(numReps), parseInt(amtWeight), parseInt(rpeScale)), setAmtWeight(""), setNumReps(""), setRpeScale("") }} disabled={!rpeScale && !amtWeight && !numReps}>
                        <Text className='text-white py-4 px-6 font-bold text-center'>Add Set</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
