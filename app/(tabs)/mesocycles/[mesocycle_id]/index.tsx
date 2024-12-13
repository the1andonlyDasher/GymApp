// app/mesocycles/[mesocycleId]/index.tsx
import React, { useEffect, useState } from 'react';
import { FlatList, Text, Button, View, TouchableOpacity, TextInput } from 'react-native';
import { Link, useRouter, useLocalSearchParams, Href, usePathname } from 'expo-router';
import useItemStore, { Microcycle } from '@/app/stores/store';
import Ionicons from '@expo/vector-icons/Ionicons';
import AnimatedModal from '@/components/Modal';
import { getDBConnection } from '@/db/db';

export const updateMicrocycleName = async (newName: string, id: number) => {
    const db = await getDBConnection();

    const statement = await db.prepareAsync(
        `UPDATE Microcycles SET name = $newName WHERE id = $id;`
    );

    try {
        const result = await statement.executeAsync<Microcycle[]>({
            $newName: newName,
            $id: id
        });
        const microcycles = await result.getAllAsync()
        if (microcycles.length > 0) {
            console.log(`Microcycle with ID ${id} updated successfully.`);
        } else {
            console.warn(`No Microcycle found with ID ${id}.`);
        }
        return microcycles; // Returns the number of rows updated
    } catch (error) {
        console.error("Error updating Microcycle name:", error);
        throw error; // Propagate the error to handle it further up the chain
    } finally {
        await statement.finalizeAsync();
    }
};


export default function MesocyclesScreen() {
    const { mesocycle_id, microcycle_id } = useLocalSearchParams();
    const { loadMicrocycles, addMicrocycle, deleteMicrocycle, microcycles } = useItemStore();
    const router = useRouter();
    const [microcycleName, setMicrocycleName] = useState<string>("")
    const path = usePathname()
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const closeModal = () => {
        setModalOpen(false);
    };


    useEffect(() => {
        loadMicrocycles(parseInt(mesocycle_id as string));
    }, [mesocycle_id, microcycles]);

    return (
        <View className="flex bg-[hsl(210,5%,7%)] w-full h-full justify-start flex-col">
            <Text className="font-semibold text-2xl text-[hsl(206,13%,79%)] py-4 text-center">Microcycles</Text>
            <FlatList
                className="bg-[hsl(210,5%,9%)] p-4 m-2 border-[#16213b] rounded-xs flex fle-col gap-6"
                contentContainerStyle={{ justifyContent: "space-evenly" }}
                data={microcycles}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        className="bg-[hsl(221,20%,16%)] border-[hsl(221,20%,20%)] border rounded-sm p-4 flex flex-row items-center justify-center gap-4"
                        onPress={() => router.push(`mesocycles/${mesocycle_id}/${item.id}` as Href)}
                    >
                        <View className="flex flex-row flex-1">
                            <Text className="text-white font-semibold text-xl flex flex-[1_1_60%]">
                                {item.name}
                            </Text>
                            <Text className="text-slate-400 font-semibold text-xl flex flex-1">
                                {item.id}
                            </Text>
                        </View>
                        <TouchableOpacity
                            className="bg-sky-700 rounded-md p-3 flex items-center justify-center aspect-square"
                            onPress={() => setModalOpen(true)}
                        >
                            <Ionicons name="pencil" size={20} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="bg-rose-700 rounded-md p-3 flex items-center justify-center aspect-square"
                            onPress={() => deleteMicrocycle(item.id)}
                        >
                            <Ionicons name="trash-bin" size={20} color="white" />
                        </TouchableOpacity>
                        <AnimatedModal updateFn={updateMicrocycleName} item={item} open={modalOpen} onClose={closeModal} />
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
