// app/mesocycles/[mesocycleId]/index.tsx
import {Picker} from '@react-native-picker/picker';
import React, { Dispatch, useEffect, useState } from "react";
import {
    FlatList,
    Text,
    Button,
    View,
    TouchableOpacity,
    TextInput,
} from "react-native";
import {
    Link,
    useRouter,
    useLocalSearchParams,
    usePathname,
    Href,
} from "expo-router";
import useItemStore, { ExerciseWithSets, Set, Workout } from "@/app/stores/store";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
    faChartLine,
    faDumbbell,
    faRepeat,
} from "@fortawesome/free-solid-svg-icons";
import { SofiaSans_100Thin_Italic, SofiaSans_700Bold, useFonts } from "@expo-google-fonts/sofia-sans";
import Ionicons from "@expo/vector-icons/Ionicons";

const WorkoutItem = ({
    mesocycle_id,
    microcycle_id,
    workout_id,
    item,
    setModalOpen,
    deleteExercise
}: {
    mesocycle_id: string | string[],
    microcycle_id: string | string[],
    workout_id: string | string[],
    item: ExerciseWithSets
    setModalOpen: Dispatch<React.SetStateAction<boolean>>
    deleteExercise: (id: number) => Promise<void>
}) => {
    const router = useRouter()
    const [showSets, setShowSets] = useState<boolean>(false);
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
        <TouchableOpacity
            className="bg-[hsl(221,20%,16%)] border-[hsl(221,20%,20%)] border rounded-sm p-4 flex flex-col gap-4"
            onPress={() =>
                router.push(
                    `mesocycles/${mesocycle_id}/${microcycle_id}/${workout_id}/${item.id}` as Href
                )
            }
        >
            <View className="flex flex-row justify-between gap-4">
                <View className="flex flex-row flex-1">
                    <Text className="text-white font-semibold text-xl flex flex-[1_1_60%]">
                        {item.name}
                    </Text>
                    <Text className="text-slate-400 font-semibold text-xl flex flex-1">
                        {item.id}
                    </Text>
                </View>
                <TouchableOpacity
                    className={`${showSets ? 'bg-[hsl(210,5%,4%)] rotate-180' : 'bg-emerald-500 rotate-0'} rounded-md p-3 flex items-center justify-center aspect-square`}
                    onPress={() => setShowSets(!showSets)}
                >
                    <Ionicons name="arrow-down" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                    className="bg-sky-700 rounded-md p-3 flex items-center justify-center aspect-square"
                    onPress={() => setModalOpen(true)}
                >
                    <Ionicons name="pencil" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                    className="bg-rose-700 rounded-md p-3 flex items-center justify-center aspect-square"
                    onPress={() => deleteExercise(item.id)}
                >
                    <Ionicons name="trash-bin" size={20} color="white" />
                </TouchableOpacity>
            </View>
            <View className={`grid ${showSets ? 'grid-rows-[1fr] h-auto' : 'grid-rows-[0fr] h-0'}  overflow-hidden w-full`}>
                <FlatList
                    className="flex flex-col justify-between w-full gap-4 overflow-hidden"
                    contentContainerStyle={{
                        justifyContent: "space-between",
                        width: "100%",
                    }}
                    data={item.setsDetails}
                    keyExtractor={(item) => item.id?.toString() ?? "unknown"}
                    renderItem={({ item }) => (
                        <View className="flex flex-row gap-6 justify-center flex-1 border-[hsl(210,5%,7%)] border bg-[hsl(210,5%,6%)] px-6 py-4">
                            <Text className="flex flex-row items-center justify-center text-slate-500">
                                <FontAwesomeIcon
                                    size={12}
                                    style={{ margin: 0 }}
                                    color="#64748b"
                                    icon={faRepeat}
                                />{" "}
                                {item.reps}
                            </Text>
                            <Text className="flex flex-row items-center justify-center text-slate-500">
                                <FontAwesomeIcon
                                    size={14}
                                    style={{ margin: 0 }}
                                    color="#64748b"
                                    icon={faDumbbell}
                                />{" "}
                                {item.weight}
                            </Text>
                            <Text
                                className={`flex flex-row items-center justify-center`}
                                style={{ color: `${getStyleBasedOnValue(item.rpe)}` }}
                            >
                                <FontAwesomeIcon
                                    size={12}
                                    style={{ margin: 0 }}
                                    color={getStyleBasedOnValue(item.rpe)}
                                    icon={faChartLine}
                                />{" "}
                                {item.rpe}
                            </Text>
                        </View>
                    )}
                />
            </View>
        </TouchableOpacity>
    )
}

export default function WorkoutsScreen() {
    const { mesocycle_id, microcycle_id, workout_id } = useLocalSearchParams();
    const {
        loadExercises,
        addExercise,
        deleteExercise,
        exercisesWithSets,
        loadSetsAndExercises,
    } = useItemStore();
    const router = useRouter();
    const [workoutName, setWorkoutName] = useState<string>("");
    const [modalOpen, setModalOpen] = useState<boolean>(false);




    useEffect(() => {
        loadExercises(parseInt(workout_id as string));
        loadSetsAndExercises(parseInt(workout_id as string));
    }, [workout_id]);

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

    const [loaded, error] = useFonts({ SofiaSans_100Thin_Italic });

    if (!loaded) {
        return console.log(error);
    }

    return (
        <View className="flex bg-[hsl(210,5%,7%)] w-full h-full justify-start flex-col">
            <Text
                style={{ fontFamily: "SofiaSans_100Thin_Italic" }}
                className="text-white font-bold text-3xl text-center p-4"
            >
                Exercises
            </Text>
            <FlatList
                className=" p-4 m-2 border-[#16213b] rounded-xs flex fle-col gap-6"
                contentContainerStyle={{ justifyContent: "space-evenly", gap: 20 }}
                data={exercisesWithSets}
                keyExtractor={(item) => item.id?.toString() ?? "unknown"}
                renderItem={({ item }) => (
                    <WorkoutItem mesocycle_id={mesocycle_id} microcycle_id={microcycle_id} workout_id={workout_id} item={item} setModalOpen={setModalOpen} deleteExercise={deleteExercise} />
                )}
            />
            <View className="flex flex-col gap-6 justify-center">
                <Text className="text-slate-400 text-center">
                    Choose your exercise name
                </Text>
                <TextInput
                    className="bg-slate-300 w-4/5 m-auto p-4 rounded-md"
                    placeholder="Exercise Name..."
                    onChangeText={setWorkoutName}
                    value={workoutName}
                ></TextInput>
                <Picker dropdownIconColor={'white'} style={{backgroundColor:'hsl(210,5%,7%)'}} onValueChange={(itemValue) => console.log(itemValue)} selectedValue="0">
                    <Picker.Item label="Select an exercise" value="0" style={{backgroundColor:'#000'}} color="#fff"/>
                    <Picker.Item label="Bench Press" value="1"  style={{backgroundColor:'#000'}} color="#fff"/>
                    <Picker.Item label="Squat" value="2"  style={{backgroundColor:'#000'}} color="#fff"/>
                    <Picker.Item label="Deadlift" value="3"  style={{backgroundColor:'#000'}} color="#fff"/>
                </Picker>
                <TouchableOpacity
                    className="bg-slate-800 rounded-xs w-full"
                    onPress={() => {
                        addExercise(Number(workout_id), workoutName), setWorkoutName("");
                    }}
                    disabled={!workoutName}
                >

                    <Text className="text-white py-4 px-6  font-bold text-center">
                        Add Exercise
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
