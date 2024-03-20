import { View, Text } from "react-native";
import * as Icon from "react-native-feather" 

/**
 * A component that renders percentages of each lived emotion
 * 
 * @param {*} param0 
 * @returns {import("react").ReactNode}
 */

export default function EmotionRecording({period}) {

    if (period) {
        return (
        
            <View className="flex-column items-center bg-white border border-black px-5 mt-5 mx-5 pb-5 rounded-xl" style={{height: '50%'}}>
                    <View className="flex-row gap-x-1 mt-1 pb-5">
                        <Icon.Activity className="mt-1" height="20" width="20" stroke="black" />
                        <Text className="font-bold text-base text-black">Emotions per period</Text>
                    </View>
                    <View className="flex-row items-end" style={{width: '100%', height: '80%'}}>
                        <View className="flex-1 items-center mt-6">
                            <View className="bg-yellow-300" style={{height: period ? period.happy : '0%', width: '90%'}}></View>
                            <Text className="font-bold text-xs text-slate-950">Happy</Text>
                        </View>
                        <View className="flex-1 items-center">
                            <View className="bg-red-600" style={{height: period ? period.anger : '0%', width: '90%'}}></View>
                            <Text className="font-bold text-xs text-slate-950">Anger</Text>
                        </View>
                        <View className="flex-1 items-center">
                            <View className="bg-blue-600" style={{height: period ? period.sad : '0%', width: '90%'}}></View>
                            <Text className="font-bold text-xs text-slate-950">Sadness</Text>
                        </View>
                        <View className="flex-1 items-center">
                            <View className="bg-slate-950" style={{height: period ? period.fear : '0%', width: '90%'}}></View>
                            <Text className="font-bold text-xs text-slate-950">Fear</Text>
                        </View>
                        <View className="flex-1 items-center">
                            <View className="bg-green-600" style={{height: period ? period.disgust : '0%', width: '90%'}}></View>
                            <Text className="font-bold text-xs text-slate-950">Disgust</Text>
                        </View>
                        <View className="flex-1 items-center">
                            <View className="bg-orange-400" style={{height: period ? period.surprise : '0%', width: '90%'}}></View>
                            <Text className="font-bold text-xs text-slate-950">Surprise</Text>
                        </View>
                    </View>
                </View>
        )
    } else {
        return (
            <View>
                <Text>No recordings to show</Text>
            </View>
        )
    }
}