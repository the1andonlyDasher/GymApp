import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TabHeader } from "@/components/TabHeader";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "hsl(223, 16%, 9%)",
          borderTopColor: "hsl(223, 16%, 9%)",
          borderTopWidth: 0,
        },
        tabBarInactiveBackgroundColor: "hsl(223, 16%, 9%)",
        tabBarActiveBackgroundColor: "hsl(223, 16%, 12%)",
        tabBarActiveTintColor: "#b9742f",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          header: () => (
            <TabHeader title="Home">
              <Ionicons color="white" size={28} name="home" />
            </TabHeader>
          ),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="mesocycles"
        options={{
          title: "Cycles",
          header: () => (
            <TabHeader title="Cycles">
              <Ionicons color="white" size={28} name="list-circle" />
            </TabHeader>
          ),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "albums" : "albums-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
