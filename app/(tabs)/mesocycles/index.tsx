// app/mesocycles/index.tsx
import React, { useEffect, useRef, useState } from "react";
import {
    FlatList,
    Text,
    Button,
    View,
    TouchableOpacity,
    TextInput,
    Modal,
    Animated,
    Easing,
} from "react-native";

import { Href, Link, useRouter } from "expo-router";
import useItemStore, { Mesocycle } from "@/app/stores/store";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getDBConnection } from "@/db/db";
import AnimatedModal from "@/components/Modal";




export default function MesocyclesMainScreen() {
    const { mesocycles, loadMesocycles, addMesocycle, deleteMesocycle } =
        useItemStore();
    const router = useRouter();

    const [mesocycleName, setMesocycleName] = useState<string>("");
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };


    useEffect(() => {
        loadMesocycles();
    }, [mesocycles]);

    return (
        <View className="flex bg-[hsl(210,5%,7%)] w-full h-full justify-start flex-col">
            <Text className="font-semibold text-2xl text-[hsl(206,13%,79%)] py-4 text-center">
                Mesocycles
            </Text>
            <FlatList
                className="bg-[hsl(210,5%,9%)] p-4 m-2 border-[#16213b] rounded-xs flex fle-col gap-6"
                contentContainerStyle={{ justifyContent: "space-evenly" }}
                data={mesocycles}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        className="bg-[hsl(221,20%,16%)] border-[hsl(221,20%,20%)] border rounded-sm p-4 flex flex-row items-center justify-center gap-4"
                        onPress={() => router.push(`mesocycles/${item.id}` as Href)}
                    ><View className="flex flex-row flex-1">
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
                            onPress={() => deleteMesocycle(item.id)}
                        >
                            <Ionicons name="trash-bin" size={20} color="white" />
                        </TouchableOpacity>
                        <AnimatedModal mesocycle={item} open={modalOpen} onClose={closeModal} />

                    </TouchableOpacity>
                )}
            />
            <View className="flex flex-col gap-6 justify-center">
                <Text className="text-slate-400 text-center">Choose your name</Text>
                <TextInput
                    className="bg-slate-300 w-4/5 m-auto p-4 rounded-md"
                    placeholder="Mesocycle Name..."
                    onChangeText={setMesocycleName}
                    value={mesocycleName}
                ></TextInput>
                <TouchableOpacity
                    className="bg-slate-800 rounded-xs w-full"
                    onPress={() => {
                        addMesocycle(mesocycleName), setMesocycleName("");
                    }}
                    disabled={!mesocycleName}
                >
                    <Text className="text-white py-4 px-6  font-bold text-center">
                        Add Mesocycle
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}


