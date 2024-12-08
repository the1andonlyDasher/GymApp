import { SofiaSans_900Black } from "@expo-google-fonts/sofia-sans";
import { useFonts } from "expo-font";
import { ReactNode } from "react";
import { View, Text } from "react-native";

export const TabHeader = ({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) => {
    const [loaded, error] = useFonts({ SofiaSans_900Black })
    return (
        <View className="flex  flex-row gap-6 w-full p-4 items-center justify-center bg-[hsl(210,5%,5%)] drop-shadow-[5px_5px_10px_white]">
            <Text style={{ fontFamily: "SofiaSans_900Black" }} className="text-3xl font-extrabold text-white">{title}</Text>
            {children}
        </View>
    );
};