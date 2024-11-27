import { Stack } from "expo-router";

export default function MesocyclesLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false, title: "Cycles" }} />
            <Stack.Screen
                name="[mesocycle_id]/index"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="[mesocycle_id]/[microcycle_id]/index"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="[mesocycle_id]/[microcycle_id]/[workout_id]/index"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="[mesocycle_id]/[microcycle_id]/[workout_id]/[exercise_id]/index"
                options={{ headerShown: false }}
            />
        </Stack>
    );
}
