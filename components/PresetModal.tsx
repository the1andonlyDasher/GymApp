import useItemStore from "@/app/stores/store";
import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    Modal,
    TextInput,
    Button,
    StyleSheet,
    Animated,
    Easing,
} from "react-native";

type TItem = "Mesocycle" | "Microcycle" | "Workouts" | undefined;

const PresetModal = ({
    open,
    onClose,
    item,
}: {
    open: boolean;
    onClose: () => void;
    item: TItem;
}) => {
    const [presetItem, setItem] = useState({
        name: "",
        num: 0
    });
    const [preset, setPreset] = useState<TItem>();
    const animationValue = useRef(new Animated.Value(0)).current;
    const { addMicroPreset, addMesoPreset } = useItemStore()
    useEffect(() => {
        if (open) {
            // Pre-fill the input and trigger animation when the modal becomes visible
            Animated.timing(animationValue, {
                toValue: 1,
                duration: 300,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(animationValue, {
                toValue: 0,
                duration: 300,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
            }).start();
        }
    }, [open]);

    const handleCreate = (presetItem: { name: string, num: number }) => {
        switch (item) {
            case "Mesocycle":
                return addMesoPreset({ name: presetItem.name, num_microcycles: presetItem.num })
            case "Microcycle":
                return addMicroPreset({ name: presetItem.name, num_workouts: presetItem.num })
            case "Workouts":
                console.log("Workouts are not yet implemented");
                break;
            case undefined:
                throw new Error("Item type is undefined. Please provide a valid item type.");
            default:
                throw new Error(`Unhandled item type: ${item}`);;
        }
    }

    const handleSave = async () => {
        if (presetItem.name.trim()) {
            try {
                await handleCreate(presetItem);
                onClose();
            } catch (error) {
                console.error("Failed to create preset:", error);
                alert("An error occurred while saving. Please try again.");
            }
        } else {
            alert("Name cannot be empty.");
        }
    };

    // Animated styles
    const animatedStyle = {
        opacity: animationValue,
        transform: [
            {
                scale: animationValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1], // Scale from 80% to 100%
                }),
            },
        ],
    };

    return (
        <View style={styles.container}>
            {/* Animated Modal */}
            <Modal
                transparent
                visible={open}
                onRequestClose={onClose}
                animationType="slide"
            >
                <View style={styles.modalOverlay}>
                    <Animated.View style={[styles.modalContainer, animatedStyle]}>
                        <Text style={styles.modalTitle}>Create Preset</Text>
                        <Text className="text-base text-[hsl(221,20%,55%)] pb-2 text-left">{item} Name</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(e) => setItem({ ...presetItem, name: e.trim() })}
                            placeholder="Enter name"
                        />
                        <Text className="text-base text-[hsl(221,20%,55%)] pb-2 text-left">Number of {item === "Mesocycle" ? "Microcycles" : "Workouts"}</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(e) => setItem({ ...presetItem, num: parseInt(e.trim()) })}
                            placeholder="Enter number"
                        />
                        <View style={styles.modalActions}>
                            <Button title="Create" onPress={handleSave} color="#4CAF50" />
                            <Button title="Cancel" onPress={onClose} color="#f44336" />
                        </View>
                    </Animated.View>
                </View>
            </Modal>
        </View>
    );
};

export default PresetModal;

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        flex: 1,
        padding: 16,
        backgroundColor: "transparent",
    },
    mesocycleItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    mesocycleName: {
        fontSize: 16,
        fontWeight: "500",
    },
    editButton: {
        backgroundColor: "#007BFF",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    editButtonText: {
        color: "#fff",
        fontSize: 14,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        width: "80%",
        backgroundColor: "#0e1015",
        borderColor: "#20232c",
        borderStyle: "solid",
        borderWidth: 1,
        padding: 20,
        borderRadius: 10,
        shadowColor: "#00000011",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        color: "white",
    },
    oldName: {
        fontSize: 16,
        color: "#555",
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#3a3e48",
        backgroundColor: "#b6bdd0",
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
        fontSize: 16,
    },
    modalActions: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
});
