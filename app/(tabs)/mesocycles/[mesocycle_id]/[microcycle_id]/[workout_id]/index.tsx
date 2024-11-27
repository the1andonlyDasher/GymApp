// app/mesocycles/[mesocycleId]/index.tsx
import React, { useEffect, useState } from "react";
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
import useItemStore, { Set } from "@/app/stores/store";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
    faChartLine,
    faDumbbell,
    faRepeat,
} from "@fortawesome/free-solid-svg-icons";
import { SofiaSans_100Thin_Italic, SofiaSans_700Bold, useFonts } from "@expo-google-fonts/sofia-sans";

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
    const path = usePathname();

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
        <View className="flex bg-slate-950 w-full h-full justify-start flex-col">
            <Text
                style={{ fontFamily: "SofiaSans_100Thin_Italic" }}
                className="text-white font-bold text-3xl text-center p-4"
            >
                Exercises
            </Text>
            <FlatList
                className="bg-slate-900 p-4 m-2 border-[#16213b] rounded-xs flex fle-col gap-6"
                contentContainerStyle={{ justifyContent: "space-evenly", gap: 1 }}
                data={exercisesWithSets}
                keyExtractor={(item) => item.id?.toString() ?? "unknown"}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        className="bg-[#151f38] border-slate-800 border rounded-sm p-4 flex flex-col gap-4"
                        onPress={() =>
                            router.push(
                                `mesocycles/${mesocycle_id}/${microcycle_id}/${workout_id}/${item.id}` as Href
                            )
                        }
                    >
                        <Text className="text-white font-semibold text-xl">
                            {item.name}
                        </Text>
                        <Text className="text-white font-semibold text-xl hidden">
                            {item.id}
                        </Text>
                        <View className="flex justify-center w-full">
                            <FlatList
                                className="flex flex-col justify-between w-full gap-4"
                                contentContainerStyle={{
                                    justifyContent: "space-between",
                                    width: "100%",
                                }}
                                data={item.setsDetails}
                                keyExtractor={(item) => item.id?.toString() ?? "unknown"}
                                renderItem={({ item }) => (
                                    <View className="flex flex-row gap-6 justify-center flex-1 border border-slate-800 bg-slate-900 px-6 py-4">
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
                        <TouchableOpacity
                            className="bg-rose-700 rounded-xs w-full"
                            onPress={() => deleteExercise(item.id)}
                        >
                            <Text className="text-white py-2 px-4  font-bold text-center">
                                Remove
                            </Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
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
