import { View, Text, TouchableOpacity, NativeModules } from "react-native";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { io } from "socket.io-client";


export default function Options() {

    const navigation = useNavigation();
    const { FacesRecordingModule } = NativeModules;

    const stopRecording = () => {
        FacesRecordingModule.stopRecording();
      }

    const signOut = () => {
        AsyncStorage.removeItem('user')
        .then(() => console.log('User removed from local storage'))
        .catch(error => console.log(error));
        Toast.show({
            type: 'success',
            text1: 'Signout',
            text2: 'User successfully Signed Out'
          });
          stopRecording();
        navigation.navigate('Login')
    }

    return (
        <View className="items-end" style={{ marginRight: '15%', position: 'absolute', pointerEvents: 'box-none', width: '100%', marginTop: '10%', zIndex: 100}}>
            <View className="bg-slate-50 p-4 border border-black">
                <TouchableOpacity onPress={() => signOut()} className="p-4">
                    <Text>
                        Sign out
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}