// app/mesocycles/[mesocycleId]/index.tsx
import React, { Suspense, useEffect, useState } from 'react';
import { FlatList, Text, Button, View, TouchableOpacity, TextInput } from 'react-native';
import { Link, useRouter, useLocalSearchParams, usePathname, Href } from 'expo-router';
import useItemStore, { Workout, WorkoutPreset } from '@/app/stores/store';
import { SofiaSans_700Bold, useFonts } from '@expo-google-fonts/sofia-sans';
import Ionicons from '@expo/vector-icons/Ionicons';
import AnimatedModal from '@/components/Modal';
import { getDBConnection } from '@/db/db';
import { Picker } from '@react-native-picker/picker';

export const updateWorkoutName = async (newName: string, id: number) => {
    const db = await getDBConnection();

    const statement = await db.prepareAsync(
        `UPDATE Workouts SET name = $newName WHERE id = $id;`
    );

    try {
        const result = await statement.executeAsync<Workout[]>({
            $newName: newName,
            $id: id
        });
        const workouts = await result.getAllAsync()
        if (workouts.length > 0) {
            console.log(`Workout with ID ${id} updated successfully.`);
        } else {
            console.warn(`No Workout found with ID ${id}.`);
        }
        return workouts; // Returns the number of rows updated
    } catch (error) {
        console.error("Error updating Workout name:", error);
        throw error; // Propagate the error to handle it further up the chain
    } finally {
        await statement.finalizeAsync();
    }
};

export default function MicrocyclesScreen() {
    const [loaded, error] = useFonts({ SofiaSans_700Bold })
    const { mesocycle_id, microcycle_id } = useLocalSearchParams();
    const path = usePathname()
    const { loadWorkouts, updateMicrocycle, addWorkout, loadWorkoutPresets, workoutPresets, deleteWorkout, workouts } = useItemStore();
    const router = useRouter();
    const [workoutName, setWorkoutName] = useState<string>("")
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const closeModal = () => {
        setModalOpen(false);
    };


    useEffect(() => {
        loadWorkoutPresets()
        loadWorkouts(parseInt(microcycle_id as string));
    }, [microcycle_id, workouts]);


    return (
        <View className="flex bg-[hsl(210,5%,7%)] w-full h-full justify-start flex-col gap-4">
            <Text style={{ fontFamily: "SofiaSans_700Bold" }} className='text-white font-bold text-3xl text-center p-4'>Workouts</Text>
            <FlatList
                className="bg-[hsl(210,5%,7%)] p-4 m-2 rounded-xs flex fle-col gap-6"
                contentContainerStyle={{ justifyContent: "space-evenly", gap: 10 }}
                data={workouts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        key={item.id}
                        className="bg-[hsl(221,20%,16%)] border-[hsl(221,20%,20%)] border rounded-sm p-4 flex flex-row items-center justify-center gap-4"
                        onPress={() => router.push(`mesocycles/${mesocycle_id}/${microcycle_id}/${item.id}` as Href)}
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
                            onPress={() => deleteWorkout(item.id)}
                        >
                            <Ionicons name="trash-bin" size={20} color="white" />
                        </TouchableOpacity>
                        <AnimatedModal updateFn={updateWorkoutName} item={item} open={modalOpen} onClose={closeModal} />

                    </TouchableOpacity>
                )}
            />
            <View className="flex flex-col justify-center">
                <Text className="text-slate-400 text-center pb-3">Choose your workout</Text>
                <Suspense>
                    <Picker
                        selectionColor={"red"}
                        dropdownIconColor={"white"}
                        style={{ backgroundColor: "hsl(210,5%,7%)" }}
                        onValueChange={(itemValue) => setWorkoutName(itemValue)}
                        selectedValue="0"
                    ><Picker.Item
                            label={"Choose your workout"}
                            value={"0"}
                            style={{ backgroundColor: "hsl(210,5%,11%)" }}
                            color="#fff"
                        />
                        {workoutPresets.map((workout: WorkoutPreset, index: number) => (
                            <Picker.Item
                                key={workout.id + index}
                                label={workout.name}
                                value={workout.name}
                                style={{ backgroundColor: "hsl(210,5%,11%)" }}
                                color="#fff"
                            />
                        ))}
                    </Picker>
                </Suspense>
                <TouchableOpacity
                    className="bg-slate-800 rounded-xs w-full"
                    onPress={() => {
                        addWorkout(Number(microcycle_id), workoutName), setWorkoutName("");
                        updateMicrocycle(Number(microcycle_id))
                    }}
                    disabled={!workoutName}
                >
                    <Text className="text-white py-4 px-6  font-bold text-center">
                        Add Workout
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
