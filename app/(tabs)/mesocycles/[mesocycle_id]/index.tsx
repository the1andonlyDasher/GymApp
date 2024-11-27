// app/mesocycles/[mesocycleId]/index.tsx
import React, { useEffect, useState } from 'react';
import { FlatList, Text, Button, View, TouchableOpacity, TextInput } from 'react-native';
import { Link, useRouter, useLocalSearchParams, Href, usePathname } from 'expo-router';
import useItemStore from '@/app/stores/store';

export default function MesocyclesScreen() {
    const { mesocycle_id, microcycle_id } = useLocalSearchParams();
    const { loadMicrocycles, addMicrocycle, deleteMicrocycle, microcycles } = useItemStore();
    const router = useRouter();
    const [microcycleName, setMicrocycleName] = useState<string>("")
    const path = usePathname()

    useEffect(() => {
        loadMicrocycles(parseInt(mesocycle_id as string));
    }, [mesocycle_id]);

    return (
        <View className='flex bg-slate-950 w-full h-full justify-start flex-col'>
            <Text className='text-white font-bold text-3xl text-center p-4'>Microcycles</Text>
            <FlatList
                className='bg-slate-900 p-4 m-2 border-[#16213b] rounded-xs flex fle-col gap-6'
                contentContainerStyle={{ justifyContent: "space-evenly" }}
                data={microcycles}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        className='bg-[#151f38] border-slate-800 border rounded-sm p-4 flex flex-col gap-4'
                        onPress={() => router.push(`mesocycles/${mesocycle_id}/${item.id}` as Href)}
                    >
                        <Text className='text-white font-semibold text-xl'>{item.name}</Text>
                        <Text className='text-white font-semibold text-xl'>{item.id}</Text>
                        < TouchableOpacity className='bg-rose-700 rounded-xs w-full' onPress={() => deleteMicrocycle(item.id)}>
                            <Text className='text-white py-2 px-4  font-bold text-center'>Remove</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
            />
            <View className='flex flex-col gap-6 justify-center'>
                <Text className='text-slate-400 text-center'>Choose your name</Text>
                <TextInput
                    className='bg-slate-300 w-4/5 m-auto p-4 rounded-md'
                    placeholder='Microcycle Name...'
                    onChangeText={setMicrocycleName}
                    value={microcycleName}
                >

                </TextInput>
                <TouchableOpacity className='bg-slate-800 rounded-xs w-full' onPress={() => { addMicrocycle(Number(mesocycle_id), microcycleName), setMicrocycleName("") }} disabled={!microcycleName}>
                    <Text className='text-white py-4 px-6  font-bold text-center'>Add Microcycle</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
