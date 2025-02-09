// app/mesocycles/[mesocycleId]/index.tsx
import React, { Suspense, useEffect, useState } from 'react';
import { FlatList, Text, Button, View, TouchableOpacity, TextInput } from 'react-native';
import { Link, useRouter, useLocalSearchParams, Href, usePathname } from 'expo-router';
import useItemStore, { Mesocycle, MesoPreset, Microcycle, MicroPreset, Workout } from '@/app/stores/store';
import Ionicons from '@expo/vector-icons/Ionicons';
import AnimatedModal from '@/components/Modal';
import { getDBConnection } from '@/db/db';
import { Picker } from '@react-native-picker/picker';

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



const isMicrocycle = (cycle: Microcycle | Mesocycle): cycle is Microcycle =>
    (cycle as Microcycle).num_workouts !== undefined;

const CycleProgressBar = ({ micros }: { micros: Microcycle[] | Mesocycle[] }) => {
    const colorScale = (micro: Microcycle | Mesocycle) => {
        const value = isMicrocycle(micro) ? micro.num_workouts : micro.num_microcycles;
        switch (value) {
            case null:
            case undefined:
                return "bg-transparent"
            case 1:
                return "bg-[#481414]"
            case 2:
                return "bg-[#c94214]"
            case 3:
                return "bg-[#d47c12]"
            case 4:
                return "bg-[#e4bf1c]"
            case 5:
                return "bg-[#92db15]"
            case 6:
                return "bg-[#208f0f]"
        }
    }
    return (<View className='flex flex-row gap-6 py-2 w-full justify-center items-center'>
        {micros.map((micro: Microcycle | Mesocycle) => <View className={`h-full w-10` + colorScale(micro)} />)}
    </View>)
}


export default function MesocyclesScreen() {
    const { mesocycle_id, microcycle_id } = useLocalSearchParams();
    const { loadMicrocycles, addMicrocycle, deleteMicrocycle, microcycles, microcyclePresets, loadMicroPresets } = useItemStore();
    const router = useRouter();
    const [microcycleName, setMicrocycleName] = useState<string>("")
    const path = usePathname()
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [numM, setnumM] = useState()
    const [micro, setMicro] = useState<Pick<Microcycle, "name" | "num_workouts">>(
        { name: "", num_workouts: 0 }
    );
    const closeModal = () => {
        setModalOpen(false);
    };

    useEffect(() => {
        loadMicrocycles(parseInt(mesocycle_id as string));
        microcycles.map((item: Microcycle) => console.log(item))
    }, [mesocycle_id, microcycles]);

    useEffect(() => {
        loadMicroPresets();
    }, [microcyclePresets])





    const handleAdd = async () => {
        if (micro) {
            try {
                await addMicrocycle(parseInt(mesocycle_id as string), micro.name, micro.num_workouts)
            }
            catch (error) {
                alert(`error ${error}`)
            }
        }
    }

    return (
        <View className="flex bg-[hsl(210,5%,7%)] w-full h-full justify-start flex-col">
            <Text className="font-semibold text-2xl text-[hsl(206,13%,79%)] py-4 text-center">Microcycles</Text>
            <CycleProgressBar micros={microcycles} />
            <FlatList
                className="bg-[hsl(210,5%,7%)] p-4 m-2  rounded-xs flex fle-col gap-6"
                contentContainerStyle={{ justifyContent: "space-evenly" }}
                data={microcycles}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        className="bg-[hsl(221,20%,16%)] border-[hsl(221,20%,20%)] border rounded-sm p-4 flex flex-row items-center justify-center gap-4"
                        onPress={() => router.push(`/mesocycles/${mesocycle_id}/${item.id}`)}
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
                    onChangeText={(e) => setMicro({ ...micro, name: e })}
                >
                </TextInput>
                <Suspense>
                    <Picker
                        selectionColor={"red"}
                        dropdownIconColor={"white"}
                        style={{ backgroundColor: "hsl(210,5%,7%)" }}
                        onValueChange={(itemValue: MicroPreset) => setMicro({ ...micro, num_workouts: itemValue.num_workouts })}
                    >
                        {microcyclePresets.map((preset: MicroPreset) => (
                            <Picker.Item
                                key={preset.name}
                                label={preset.name}
                                value={preset.name}
                                style={{ backgroundColor: "hsl(210,5%,11%)" }}
                                color="#fff"
                            />
                        ))}
                    </Picker>
                </Suspense>
                <TouchableOpacity className='flex justify-center items-center p-2 bg-emerald-400' onPress={handleAdd} disabled={!micro.name}>
                    <Text className='text-white py-4 px-6  font-bold text-center'>Add Microcycle</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
