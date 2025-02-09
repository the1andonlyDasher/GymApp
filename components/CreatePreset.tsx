import useItemStore, { Mesocycle, Microcycle } from "@/app/stores/store";
import { Picker } from "@react-native-picker/picker";
import { FC, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import PresetModal from "./PresetModal";

type TCreatePresetProps = {

}

type TPResetType = Mesocycle | Microcycle

const presetTypeMap = {
    mesocycle: "Mesocycle",
    microcycle: "Microcycle"
}

export const CreatePreset: FC<TCreatePresetProps> = () => {
    const [presetType, setPresetType] = useState();
    const [open, setOpen] = useState<boolean>(false)

    return (<View>
        <Text>Choose preset type</Text>
        <Picker onValueChange={setPresetType}>
            {Object.values(presetTypeMap).map((type: string, index: number) =>
                <Picker.Item key={type} value={type} label={type.toString().toLocaleUpperCase()} />)}
        </Picker>
        <PresetModal onClose={() => setOpen(!open)} open={open} item={presetType} />
        <TouchableOpacity onPress={() => setOpen(!open)} className="bg-blue-500  p-4">
            <Text className="text-white">Create Preset</Text>
        </TouchableOpacity>
    </View>);
}

export default CreatePreset;