import React, {useState, useEffect} from 'react';
import { Text } from '@react-native-material/core';
import { Button } from "@react-native-material/core";
import {
    View,
    SafeAreaView,
    StyleSheet,
    Dimensions,
    FlatList,
  } from 'react-native';
import API, {KEY} from '../api'

const Reminders = ({navigation}) => {

    const [reminders, setReminders] = useState();
    const [message, setMessage] = useState('');

    useEffect(() => {
        getReminders();
    }, [])

    const getReminders = async () => {
        const response = await API.get(`/reminder.json?key=${KEY}`);
        if(response.status == 200){
            setReminders(response.data);
        }else{
            setMessage('Something went wrong, please try again.');
        }
    }
    return(
        <SafeAreaView>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.userContainer}>
                        <Text>
                            My reminders
                        </Text>
                    </View>
                    <View style={styles.newReminderContainer}>
                        <Button 
                            title="New reminder"  
                            onPress={() => navigation.navigate('Reminder')}
                        />
                    </View>
                </View>
                {reminders && Array.isArray(reminders) && reminders.length ?  
                <FlatList
                    data={reminders}
                    renderItem={({item}) => <Item item={item} />}
                    keyExtractor={item => item.id}
                /> : <View><Text>{message}</Text></View>}
            </View>
        </SafeAreaView>
    )
}


const Item = ({item}) => {
    return(
        <View style={styles.reminderItemContainer}>
                <Title title="Date" value={item.reminder_date} />
                <Title title="To" value={item.send_to} />
                <Title title="Sent" value={item.sent ? 'Yes' : 'No'} />
                <Title title="Email" value={item.email ? 'Yes' : 'No'} />
                <Title title="SMS" value={item.sms ? 'Yes' : 'No'} />
            <Text>{item.reminder_message}</Text>
        </View>
    )
}

const Title = ({title, value}) => {
    return(
        <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}: </Text><Text>{value}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      height: Dimensions.get('window').height
    },
    reminderItemContainer: {
        borderBottomColor: "#c3c3c3",
        borderBottomWidth: 1,
        padding: 3
    },
    header:{
        flexDirection: "row",
        height: 50,
        borderBottomColor: "#c3c3c3",
        borderBottomWidth: 2
    },
    userContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 3
    },
    newReminderContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 3,
        alignItems: "flex-end"
    },
    title: {
        fontWeight: "bold"
    },
    titleContainer: {
        flexDirection: "row"
    }
  });

export default Reminders;