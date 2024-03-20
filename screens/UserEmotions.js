import { View, Text, TouchableOpacity } from "react-native";
import EmotionRecordingsSlider from "../components/EmotionRecordingsSlider";
import NavBar from "../components/NavBar";
import { useState } from "react";
import Profile from "./Profile";
import { RecordingContext } from "../contexts/contexts";




export default function UserEmotions() {

    const [showProfile, setShowProfile] = useState(false)
    const [recordingState, setRecordingState] = useState('ready')

    return (
        <RecordingContext.Provider value={{recordingState, setRecordingState}}>
            <View>
                <NavBar />
                <View className="bg-white flex-row justify-center items-center border rounded-lg border-black my-4 mx-5">
                    <View className="flex-1 items-center">
                        <TouchableOpacity disabled={showProfile} onPress={() => setShowProfile(true)}>
                            <Text className="text-black py-5">Profile</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="flex-1 items-center">
                    <TouchableOpacity disabled={!showProfile} onPress={() => setShowProfile(false)}>
                            <Text className="text-black py-5">Statistics</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {showProfile ? (<Profile />) : (
                    <EmotionRecordingsSlider />
                )}
            </View> 
        </RecordingContext.Provider>
    )
}