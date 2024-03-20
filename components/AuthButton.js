import { View, Text, TouchableOpacity } from "react-native"

/**
 * A component that renders the login/signup button
 * 
 * @param {*} param0 
 * @returns 
 */

export default function AuthButton({button, onPress}) {
    const login = button.type == 'login';
    if (button.size == 'large') {    
        return (
                <View className="p-7" style={{transform: [{rotate: '345deg'}]}}>
                    <View>
                        <View className="flex justify-center items-center">
                            <View className="flex-col justify-between bg-slate-950 p-3" style={{width: 125, height: 150, zIndex: 10}}>
                                <View className="p-2 bg-slate-50 flex-1">
                                <TouchableOpacity onPress={() => onPress()} className={login ? 'items-center justify-center flex-1 bg-violet-700' 
                                                                                             : 'items-center justify-center flex-1 bg-yellow-300'}
                                >
                                    <View>
                                        <Text className="font-bold text-xl">{login ? 'Login' : 'Sign up'}</Text>
                                    </View>
                                    </TouchableOpacity>
                                </View>
                                <View className="items-center mt-3 bg-slate-50 flex-2">
                                    <Text className="text-slate-950 font-bold mb-1">{login ? '@@@@@@' : '******'}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
        )
    } else {
        return (
            <View className="px-5" style={{transform: [{rotate: '345deg'}]}}>
                        <View>
                            <View className="flex justify-center items-center">
                                <View className="flex-col justify-between bg-slate-950 p-3" style={{width: 75, height: 100}}>
                                    <View className="p-2 bg-slate-50 flex-1">
                                        <View className={login ? "items-center justify-center flex-1 bg-violet-700" : 'items-center justify-center flex-1 bg-yellow-300'}>
                                            <Text className="font-bold" style={{fontSize: 8}}>{login ? 'Login' : 'Sign up'}</Text>
                                        </View>
                                    </View>
                                    <View className="items-center mt-3 bg-slate-50 flex-2">
                                    <Text className="text-slate-950 text-xs font-bold mb-1">{login ? '@@@@' : '******'}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
        )
    }
}