import { View, Text, TouchableOpacity, Image } from "react-native";
import EmotionRecording from "./EmotionRecording";
import * as Icon from 'react-native-feather';
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EmptyPieChart from "./EmptyPieChart";
import { RecordingContext } from "../contexts/contexts";

export default function EmotionRecordingsSlider() {

    const [records, setRecords] = useState([])
    const [indexPeriod, setindexPeriod] = useState(0)
    const [indexDate, setindexDate] = useState(0)
    const { recordingState } = useContext(RecordingContext)
    const [user, setUser] = useState(null)


    
    useEffect(() => {
        AsyncStorage.getItem('user')
        .then(user => {
            setUser(JSON.parse(user))
            const id = JSON.parse(user)._id;
            axios.get('http://10.0.2.2:5000/users/' + id + '/emotion-recordings')
                    .then((response) => {
                        console.log(response.data.records)
                        setRecords(response.data.records)
                    })
                    .catch((error) => console.log(error))
        })
        .catch(error => console.log("Error getting user from local storage in EmotionRecordingsSilder component"));

    }, [])

    const adjustDate = (date) => {
        console.log(date)
        let day = date.split('-')[0]
        let month = date.split('-')[1]
        let year = date.split('-')[2]
        if (day.length == 1) {
            day = "0" + day
        }
        if (month.length == 1) {
            month = "0" + month
        }
        return day + '-' + month + '-' + year
    }

    const adjustPeriod = (period) => {
        const hourAndMinute = period.split(':')
        for (let index = 0; index < hourAndMinute.length; index++) {
            if (hourAndMinute[index].length == 1) {
                hourAndMinute[index] = "0" + hourAndMinute[index]
            }
        }
        return hourAndMinute.join(':')
    }
    if (records[indexDate]) {
        return (
            <View>
                <View className="mb-5">
                    <View className="flex-row justify-around mb-5">
                        <TouchableOpacity className="mt-3" disabled={indexDate === 0} onPress={() => {
                            setindexDate(indexDate - 1)
                            setindexPeriod(0)
                        }}><Icon.ArrowLeft height="25" width="25" stroke="black" /></TouchableOpacity>
                        <Text className="mt-1 text-slate-950 bold text-2xl"><Text className="font-bold">Date:  </Text>{records[indexDate] ? adjustDate(records[indexDate].date) : 'No recordings available'}</Text>
                        <TouchableOpacity className="mt-3" disabled={indexDate === records.length - 1} onPress={() => {
                            setindexDate(indexDate + 1)
                            setindexPeriod(0)
                        }}><Icon.ArrowRight height="25" width="25" stroke="black" /></TouchableOpacity>
                    </View>
                    {/*  */}
                    <View className="flex-row justify-center items-center">
                        <View className="flex-1">
                        <EmptyPieChart radius={70} strokeWidth={20} percentages={records[indexDate] ? [Math.trunc(parseFloat(records[indexDate]['anger'])), Math.trunc(parseFloat(records[indexDate]['disgust'])), 
                        Math.trunc(parseFloat(records[indexDate]['sad'])), Math.trunc(parseFloat(records[indexDate]['fear'])), 
                        Math.trunc(parseFloat(records[indexDate]['happy'])), Math.trunc(parseFloat(records[indexDate]['surprise']))] : [100, 0, 0, 0, 0, 0]} />
                        </View>
                        <View className="flex-1 items-center border border-black rounded-xl mr-5 bg-white gap-y-1">
                            <View className="flex-row gap-x-2">
                                <Icon.Activity className="mt-1" height="20" width="20" stroke="black" />
                                <Text className="text-black text-base font-bold">Emotions per day</Text>
                            </View>
                            <View className="flex-row gap-x-1">
                                <Text className="text-black">
                                    Joy
                                </Text>
                                <Text className="text-yellow-400">
                                    ({Math.trunc(parseFloat(records[indexDate]['happy']))}%)
                                </Text>     
                            </View>
                            <View className="flex-row gap-x-1">
                                <Text className="text-black">
                                    Anger
                                </Text>
                                <Text className="text-red-600">
                                    ({Math.trunc(parseFloat(records[indexDate]['anger']))}%)
                                </Text>     
                            </View>
                            <View className="flex-row gap-x-1">
                                <Text className="text-black">
                                    Sad
                                </Text>
                                <Text className="text-blue-600">
                                    ({Math.trunc(parseFloat(records[indexDate]['sad']))}%)
                                </Text>     
                            </View>
                            <View className="flex-row gap-x-1">
                                <Text className="text-black">
                                    Fear
                                </Text>
                                <Text className="text-black">
                                    ({Math.trunc(parseFloat(records[indexDate]['fear']))}%)
                                </Text>     
                            </View>
                            <View className="flex-row gap-x-1">
                                <Text className="text-black">
                                    Disgust
                                </Text>
                                <Text className="text-green-600">
                                    ({Math.trunc(parseFloat(records[indexDate]['disgust']))}%)
                                </Text>     
                            </View>
                            <View className="mb-2 flex-row gap-x-1">
                                <Text className="text-black">
                                    Surprise
                                </Text>
                                <Text className="text-orange-400">
                                    ({Math.trunc(parseFloat(records[indexDate]['surprise']))}%)
                                </Text>     
                            </View>
                        </View>
                    </View>
                    </View>
                    <View className="items-center">
                    <View style={{height: 2, width: '90%'}} className="bg-black my-4" />
                    </View>
            <View className="items-center">
                <View className="flex-row gap-x-4 justify-between">
                <TouchableOpacity className="items-center">
                <Icon.ArrowLeft className="mt-1" height='25' width="25" stroke="black" disabled={indexPeriod === 0} onPress={() => setindexPeriod(indexPeriod - 1)} />
                </TouchableOpacity>
                <Text className="text-xl text-slate-950 bold"><Text className="font-bold">Period:  </Text>{records[indexDate] ? adjustPeriod(records[indexDate].recordings[indexPeriod].period_start) + ' - ' : ''}{records[indexDate] ? adjustPeriod(records[indexDate].recordings[indexPeriod].period_end) : ''}</Text>
                <TouchableOpacity className="items-center" disabled={records[indexDate] ? indexPeriod === records[indexDate].recordings.length - 1 : true} onPress={() => setindexPeriod(indexPeriod + 1)}> 
                <Icon.ArrowRight className="mt-1" height='25' width="25" stroke="black" />
                </TouchableOpacity>
                
                </View>
                {/* <View style={{height: '0.5%', width: '75%'}} className="bg-black mt-4" /> */}
                <EmotionRecording period={records[indexDate] ? records[indexDate].recordings[indexPeriod] : null} />
                
            </View>
            </View>
        )   
    } else {
        return (
            <View className="flex items-center justify-center">
                <Text>No recordings for {user ? user.fullName : 'User'}</Text>
            </View>
        )
    }
    
} 