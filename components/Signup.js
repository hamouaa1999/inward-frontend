import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity, BackHandler } from 'react-native';
import AuthButton from './AuthButton';
import * as Icon from 'react-native-feather'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';


export default function Signup({ navigation }) {

    const [fullname, setFullname] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmationPassword, setConfirmationPassword] = useState('')
    const [showPassword, setShowPassword] = useState(true)
    const [showConfirmationPassword, setShowConfirmationPassword] = useState(true)

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            return true;
          });
      
          return () => backHandler.remove();
    })

    const signup = () => {
        if (password != confirmationPassword) {
            Toast.show({
                type: 'error',
                text1: 'Signup',
                text2: 'Passwords not matching 👋'
              });
        } else {
            if (fullname.length > 0 && username.length > 0 && password.length > 0) {
                axios.post('http://10.0.2.2:5000/api/auth/signup', {
                    fullName: fullname,
                    username: username,
                    password: password
                }).then((response) => {
                    AsyncStorage.setItem('user', JSON.stringify(response.data.user))
                        .then(() => console.log('User saved to local storage'))
                        .catch(error => console.log(error));
                        setFullname('')
                        setUsername('')
                        setPassword('')
                        setConfirmationPassword('')
                        Toast.show({
                            type: 'success',
                            text1: 'Signup',
                            text2: 'User registered successfully 👋'
                          });
                        navigation.navigate('UserEmotions')
                })
                .catch(error => console.log(error.message));
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Signup',
                    text2: 'Fields empty'
                  });
            }
        }
    }

    return (
        <View>
            <TouchableOpacity>
                <AuthButton button={{type: 'signup', size: 'large'}} onPress={() => signup()} />
            </TouchableOpacity>
            <Text className="mx-10 mb-2  text-slate-950">Full Name</Text>
            <View className="flex-row border-solid border-2 rounded-full mx-10 mb-2">
                <Icon.CreditCard className="m-2" height="25" width="25" stroke="black" />
                <TextInput
                    defaultValue={fullname}
                    placeholder="Enter you full name here..."
                    onChangeText={(value) => setFullname(value)}
                />
            </View>

            <Text className="mx-10 mb-2  text-slate-950">Username</Text>
            <View className="flex-row border-solid border-2 rounded-full mx-10 mb-2">
                <Icon.User className="m-3" height="25" width="25" stroke="black" />
                <TextInput
                    defaultValue={username}
                    placeholder="Enter you username here..."
                    onChangeText={(value) => setUsername(value)}
                />
            </View>

            <Text className="mx-10 mb-2 text-slate-950">Password</Text>
            <View className="flex-row border-solid border-2 rounded-full mx-10 mb-2">
                <Icon.Lock className="m-3" height="25" width="25" stroke="black" />
                <TextInput
                    defaultValue={password}
                    secureTextEntry={showPassword}
                    placeholder="Enter you password here..."
                    onChangeText={(value) => setPassword(value)}
                />
                <TouchableOpacity>
                {
                    showPassword ? (<Icon.Eye onPress={() => setShowPassword(!showPassword)} className="mt-3 ml-0" height="20" width="20" stroke="black" />) : (<Icon.EyeOff onPress={() => setShowPassword(!showPassword)} className="mt-3 ml-12" height="20" width="20" stroke="black" />) 
                }
                </TouchableOpacity>
            </View>

            {/* <Text className="mx-10 mb-2  text-slate-950">Password Confirmation</Text>
            <View className="flex-row border-solid border-2 rounded-full mx-10 mb-6">
                <Icon.Lock className="m-3" height="25" width="25" stroke="black" />
                <TextInput
                    defaultValue={confirmationPassword}
                    secureTextEntry={showConfirmationPassword}
                    placeholder="Confirm your password here..."
                    onChangeText={(value) => setConfirmationPassword(value)}
                />
                <TouchableOpacity>
                {
                    showConfirmationPassword ? (<Icon.Eye onPress={() => setShowConfirmationPassword(!showConfirmationPassword)} className="mt-3" height="20" width="20" stroke="black" />) : (<Icon.EyeOff onPress={() => setShowConfirmationPassword(!showConfirmationPassword)} className="mt-3 ml-8" height="20" width="20" stroke="black" />) 
                }
                </TouchableOpacity>
            </View> */}
            <View className="mt-5 flex-row justify-center items-center">
                <Text className="font-bold text-lg" onPress={() => navigation.navigate('UserEmotions')}>Already have an account ?</Text>
                <TouchableOpacity
            onPress={() => navigation.navigate('Login')}>
                    <AuthButton button={{type: 'login', size: 'small'}} />
                </TouchableOpacity>
            </View>
        </View>
    )
}