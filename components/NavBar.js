import { useContext, useEffect, useState } from "react";
import { Text, View, Switch, PermissionsAndroid, Button, TouchableOpacity, Image, ViewBase } from "react-native";
import * as Icon from 'react-native-feather';
import { NativeModules } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RecordingContext } from "../contexts/contexts";
import Toast from "react-native-toast-message";

export default function NavBar() {

  const [optionsShown, setOptionsShown] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const { FacesRecordingModule } = NativeModules;
  const navigation = useNavigation();
  const { recordingState, setRecordingState } = useContext(RecordingContext)
  const [user, setUser] = useState(null)

  useEffect(() => {
    AsyncStorage.getItem('user')
        .then(user => {
            setUser(JSON.parse(user))
        })
        .catch(error => console.log(error));
  })

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

  const startRecording = async () => {
    setRecordingState('started')
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        AsyncStorage.getItem('user')
        .then(user => {
            setUser(JSON.parse(user))
            FacesRecordingModule.startRecording(JSON.parse(user)._id);
        })
        .catch(error => console.log(error));
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  const stopRecording = () => {
    FacesRecordingModule.stopRecording();
    setRecordingState('stopped')
    console.log(recordingState)
  }


  return (
    
      <View className="shadow-black shadow-lg py-3" style={{ height: 'fit-content', width: '100%', backgroundColor: 'white' }}>
        <View className='flex-row justify-between'>
          <View className="pt-1 pl-2 flex-row gap-x-2">
            <Image className="rounded-full" source={{ uri: user ? (user.image.length ? user.image : 'https://logodix.com/logo/1070509.png') : 'https://logodix.com/logo/1070509.png' }} style={{width: 40, height: 40}} />
            <Text className="pt-2 text-black"> {user ? user.username : 'Username'} </Text>
          </View>
          <View className="flex-row gap-x-5">
            <TouchableOpacity onPress={() => startRecording()}><Icon.Video className="mt-2" height="25" width="25" stroke="black" /></TouchableOpacity>
            <TouchableOpacity onPress={() => stopRecording()}><Icon.VideoOff className="mt-2" height="25" width="25" stroke="black" /></TouchableOpacity>
            <TouchableOpacity onPress={() => signOut()} className="p-0">
              <Icon.LogOut className="m-2" height="25" width="25" stroke="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    
  )
}