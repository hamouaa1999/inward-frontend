import { View, TouchableOpacity, Text, TextInput } from "react-native";
import { useEffect, useState } from "react";
import PersonCard from "../components/PersonCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Icon from 'react-native-feather';
import axios from "axios";
import * as ImagePicker from 'react-native-image-picker'
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";

export default function Profile() {
    const [fullName, setFullName] = useState('')
    const [image, setImage] = useState(null)
    const navigation = useNavigation()

    useEffect(() => {

        const setUserData = () => {
            AsyncStorage.getItem('user').then((user) => {
                setFullName(JSON.parse(user).fullName)
                setImage(JSON.parse(user).image)
            }).catch((error) => console.log(error))
        }

        setUserData()
    }, [])

    const imageGalleryLaunch = () => {
        let options = {
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
          includeBase64: true
        };
        try {
            ImagePicker.launchImageLibrary(options, (res) => {
                if (res.didCancel) {
                  console.log('User cancelled image picker');
                } else if (res.error) {
                  console.log('ImagePicker Error: ', res.error);
                } else if (res.customButton) {
                  console.log('User tapped custom button: ', res.customButton);
                  alert(res.customButton);
                } else {
                  setImage(`data:${res.assets[0].type};base64,${res.assets[0].base64}`)
                }
              });
        } catch (error) {
            console.log(error)
        }
      }

      const updateUser = () => {
        AsyncStorage.getItem('user').then((user) => {
            axios.put('http://' + SERVER_ADDRESS + ':5000/api/update-user/' + JSON.parse(user)._id, {
                fullname: fullName,
                image: image
            })
            .then((response) => {
                AsyncStorage.removeItem('user')
                .then(() => AsyncStorage.setItem('user', JSON.stringify(response.data.user))
                .then(() => console.log('User updated successfully'))
                .catch(error => console.log(error)))
                .catch((error) => console.log(error))
                
                setFullName(response.data["user"].fullName)
                setImage(response.data["user"].image)
                Toast.show({
                    type: 'success',
                    text1: 'User update',
                    text2: 'User updated successfully'
                  });
            })
        }).catch((error) => console.log(error.error))
      }

      const deleteUser = () => {
        AsyncStorage.getItem('user')
        .then(user => {
            const id = JSON.parse(user)._id;

            AsyncStorage.removeItem('user')
            .then(() => {
                axios.delete('http://' + SERVER_ADDRESS + ':5000/api/delete-user/' + id)
                .then(response => {
                    console.log('user deleted successfully')
                    Toast.show({
                        type: 'success',
                        text1: 'User delete',
                        text2: 'User deleted successfully'
                      });
                    navigation.navigate('Login')
                })
                .catch(error => console.log(error));
            })
            .catch(error => console.log(error))
        })
        .catch(error => console.log(error));
      }

    return (
        <View>
            <View>
            <PersonCard person={{name: 'Hamou', age: '24', image: image ? image : 'https://logodix.com/logo/1070509.png' }} />
            <View style={{left: '65%'}}>
                <TouchableOpacity onPress={() => imageGalleryLaunch()}>
                <Icon.Camera height="30" width="30" stroke="black" />
                </TouchableOpacity>
            </View>
            </View>
            <View>
                <Text className="mx-10 mb-2  text-slate-950">Full Name</Text>
                <View className="flex-row border-solid border-2 rounded-full mx-10 mb-2">
                    <Icon.User className="mt-3 ml-2" height="25" width="25" stroke="black" />
                    <TextInput
                        defaultValue={fullName}
                        className="ml-3"
                        placeholder="Enter the full name here..."
                        onChangeText={(value) => setFullName(value)}
                    />
                </View>
            </View>
                <View className="items-end px-10 mt-1">
                    <View className="flex-row">
                        <View className="px-3 py-1">
                            <TouchableOpacity onPress={() => deleteUser()}>
                            <Icon.UserX width="35" height="35" stroke="black" />
                            </TouchableOpacity>
                        </View>
                        <View className="px-3 py-1">
                            <TouchableOpacity onPress={() => updateUser()}>
                            <Icon.UserCheck width="35" height="35" stroke="black" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
        </View>
    )
}