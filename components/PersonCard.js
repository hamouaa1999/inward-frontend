import { View, Text, Image } from 'react-native'

export default function PersonCard({person}) {

    return (
        <View className="pt-7 pb-1">
                <View>
                    <View className="flex justify-center items-center">
                        <View className="flex-col justify-between bg-slate-950 p-3" style={{width: 170, height: 220}}>
                            <View className="p-2 bg-slate-50 flex-1">
                                <View className="items-center justify-center flex-1 bg-violet-700">
                                    <Image className="rounded-full" source={{ uri: person.image }} style={{width: 110, height: 110}} />
                                </View>
                            </View>
                            <View className="flex-row mt-3 bg-slate-50 flex-2 px-2">
                                <Text className="flex-1 text-lg text-slate-950">{person.name}</Text>
                                <Text className="text-sm flex-2 text-slate-950 mt-1">{person.age} YO</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
    )
}