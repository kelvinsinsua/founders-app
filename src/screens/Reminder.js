import React, {useState, useEffect} from 'react';
import { Text } from '@react-native-material/core';
import { TextInput, Button } from "@react-native-material/core";
import {
    View,
    SafeAreaView,
    StyleSheet,
    Image,
    Dimensions,
    ScrollView,
    TouchableOpacity
  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API, {KEY} from '../api'
import {isValidEmail} from '../utilities'
import CheckBox from '@react-native-community/checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useToast } from "react-native-toast-notifications";

const Reminder = ({navigation}) => {

    useEffect(() => {
        init();
    }, [])

    const [email, setEmail] = useState('');
    const [reminderMessage, setReminderMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [phone, setPhone] = useState('');
    const [checkPhone, setCheckPhone] = useState(false);
    const [schedule, setSchedule] = useState(false);
    const [user, setUser] = useState({});
    const [date, setDate] = useState(new Date());

    const toast = useToast();

    const init = async () => {
        const storageUser = await AsyncStorage.getItem('auth');
        setUser(JSON.parse(storageUser));
        setEmail(JSON.parse(storageUser).email)
    }

    const create = async () => {
        if(email.trim() && reminderMessage.trim()){
            if(!isValidEmail(email)){
                setMessage('Please enter a valid email.');
                return;
            }
            if(checkPhone && !phone.trim()){
                setMessage('Please enter a valid phone.');
                return;
            }
            setMessage('');
            setLoading(true);
            const data = {
                phone,
                reminder_email: email,
                reminder_message: message,
                reminder_date: date,
                sms: checkPhone,
                email: true
            }
            const response = await API.post(`/reminder.json?key=${KEY}`, data);
            if(response.status == 200){
                setEmail('');
                setPhone('');
                setMessage('');
                setCheckPhone(false);
                setSchedule(false);
                toast.show("Reminder created", {type: "success"});
                navigation.navigate('Reminders');
            }else{
                setMessage('Something went wrong, please try again.');
            }
            
            setLoading(false);
        }else{
            setMessage('Email and message are required.')
        }
    }

    const setCalendar = (event) => {
        const {
          type,
          nativeEvent: {timestamp},
        } = event;

        if(type == 'set'){
            setDate(new Date(timestamp));
        }
        setSchedule(false);
      };


    return(
        <SafeAreaView>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.logoContainer}>
                    <Image source={require('../app.png')} style={styles.logo} />
                </View>
                <View style={styles.formContainer}>
                    <Text style={styles.textLogin}>New reminder</Text>
                    <View style={styles.inputsContainer}>
                        <TextInput
                            label="Email"
                            variant="outlined"
                            onChangeText={(text) => setEmail(text)}
                            value={email}
                            keyboardType="email-address"
                            style={styles.input}
                        />
                        <TextInput
                            label="Message"
                            variant="outlined"
                            multiline
                            numberOfLines={4}
                            onChangeText={(text) => setReminderMessage(text)}
                            value={reminderMessage}
                            style={styles.input}
                        />
                        <View>
                            <View style={{ flexDirection: 'column'}}>
                                <View style={{ flexDirection: 'row' }}>
                                    <CheckBox
                                        value={checkPhone}
                                        onValueChange={(value) => setCheckPhone(value)}
                                    />
                                    <Text style={{marginTop: 5}}>Send to phone</Text>
                                </View>
                            </View>
                        </View>
                        {checkPhone ? <TextInput
                            label="Phone number"
                            variant="outlined"
                            onChangeText={(text) => setPhone(text)}
                            value={phone}
                            keyboardType="phone-pad"
                            style={styles.input}
                        />: null}
                        {schedule ? 
                            <DateTimePicker
                                mode="date"
                                placeholder="Select date"
                                format="YYYY-MM-DD"
                                minimumDate={new Date()}
                                onChange={(date) => setCalendar(date)}
                                value={date}
                            />
                        : null}
                        <Text>Date to send: {date.toDateString()}</Text>
                        <TouchableOpacity onPress={() => setSchedule(true)}><Text style={styles.link}>Change date</Text></TouchableOpacity>
                        <Text style={styles.error}>{message}</Text>
                        <Button 
                            title="Create" 
                            style={styles.input} 
                            onPress={create}
                            loading={loading}
                            disabled={loading} 
                        />
                        <TouchableOpacity onPress={() => navigation.navigate('Reminders')}><Text style={styles.link}>My reminders</Text></TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      height: Dimensions.get('window').height
    },
    logoContainer: {
        flex: 2,
        justifyContent: "center",
        alignItems: "center"
    },
    formContainer: {
        flex: 8,
        alignItems: "center"
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    textLogin: {
        fontSize: 30,
        textAlign: "center"
    },
    inputsContainer: {
        width: 300,
        marginTop: 15
    },
    input: {
        marginTop: 10
    },
    error: {
        color: 'red'
    },
    link:{
        color: 'blue',
        textAlign: 'right',
        marginTop: 10
    }
});

export default Reminder;