import { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, TextInput, BackHandler } from "react-native"
import * as Icon from 'react-native-feather'
import AuthButton from "../components/AuthButton";
import NavBar from "../components/NavBar";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { SERVER_ADDRESS } from "../config";


export default function Login({ navigation }) {
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(true);
    
    const route = useRoute();

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            return true;
          });
      
          return () => backHandler.remove();
    })
    
    const login = () => {
        console.log(SERVER_ADDRESS, username, password)
        if (username.length > 0 && password.length > 0) {
            console.log('http://' + SERVER_ADDRESS + ':5000/api/auth/signin')
            axios.post('http://' + SERVER_ADDRESS + ':5000/api/auth/signin', {
                username: username,
                password: password
            }).then((response) => {
                setUsername('')
                setPassword('')
                Toast.show({
                    type: 'success',
                    text1: 'Login',
                    text2: 'User successfully logged in'
                  });
                AsyncStorage.setItem('user', JSON.stringify(response.data.user))
                .then((data) => console.log('User saved to local storage: ' + data))
                .catch(error => {
                    console.log(error)
                });
                navigation.navigate('UserEmotions')
            })
            .catch(error => {
                Toast.show({
                    type: 'error',
                    text1: 'Login error',
                    text2: 'Wrong username or password'
                  });
                  console.log(error)
            });
        } else {
            Toast.show({
                type: 'error',
                text1: 'Login error',
                text2: 'Empty fileds'
              });
        }


    }

    return (
        <View>
            {route.name != 'Login' && route.name != 'Signup' ? <NavBar /> : ''}
            <AuthButton button={{type: 'login', size: 'large'}} onPress={login} /> 

            <Text className="mx-10 mb-2  text-slate-950">Username</Text>
            <View className="flex-row border-solid border-2 rounded-full mx-10 mb-5">
                <Icon.User className="m-2" height="25" width="25" stroke="black" />
                <TextInput
                    defaultValue={username}
                    placeholder="Enter you username here..."
                    onChangeText={(value) => setUsername(value)}
                />
            </View>

            <Text className="mx-10 mb-2 text-slate-950">Password</Text>
            <View className="flex-row border-solid border-2 rounded-full mx-10 mb-10">
                <Icon.Lock className="m-3" height="25" width="25" stroke="black" />
                <TextInput
                    defaultValue={password}
                    secureTextEntry={showPassword}
                    placeholder="Enter you password here..."
                    onChangeText={(value) => setPassword(value)}
                />
                <TouchableOpacity>
                {
                    showPassword ? (<Icon.Eye onPress={() => setShowPassword(!showPassword)} className="mt-3 ml-1" height="20" width="20" stroke="black" />) 
                                 : (<Icon.EyeOff onPress={() => setShowPassword(!showPassword)} className="mt-3 ml-12" height="20" width="20" stroke="black" />) 
                }
                </TouchableOpacity>
            </View>

            <View className="flex-row justify-center items-center">
                <Text className="font-bold text-lg">Create a new account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                    <AuthButton button={{type: 'signup', size: 'small'}} />
                </TouchableOpacity>
            </View>
                
        </View>
    )
}
