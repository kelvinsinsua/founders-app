import React, {useState} from 'react';
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

const Login = ({navigation}) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const login = async () => {
        if(email.trim() && password.trim()){
            if(!isValidEmail(email)){
                setMessage('Please enter a valid email.');
                return;
            }
            setMessage('');
            setLoading(true);
            const response = await API.post(`/login.json?email=${email}&password=${password}&key=${KEY}`);
            if(response.status == 200){
                await AsyncStorage.setItem('auth', JSON.stringify(response.data));
                setEmail('');
                setPassword('');
                navigation.navigate('Reminders');
            }else{
                setMessage('Something went wrong, please try again.');
            }
            
            setLoading(false);
        }else{
            setMessage('Email and password are required.')
        }
    }
    return(
        <SafeAreaView>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.logoContainer}>
                    <Image source={require('../app.png')} style={styles.logo} />
                </View>
                <View style={styles.formContainer}>
                    <Text style={styles.textLogin}>Login</Text>
                    <View style={styles.inputsContainer}>
                        <TextInput
                            label="Email"
                            variant="outlined"
                            onChangeText={(text) => setEmail(text)}
                            value={email}
                            keyboardType="email-address"
                        />
                        <TextInput
                            label="Password"
                            variant="outlined"
                            style={styles.input}
                            onChangeText={(text) => setPassword(text)}
                            secureTextEntry
                            value={password}
                        />
                        <Text style={styles.error}>{message}</Text>
                        <Button 
                            title="Login" 
                            style={styles.input} 
                            onPress={login}
                            loading={loading}
                            disabled={loading} 
                        />
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}><Text style={styles.link}>Register</Text></TouchableOpacity>
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
        flex: 4,
        justifyContent: "center",
        alignItems: "center"
    },
    formContainer: {
        flex: 6,
        alignItems: "center"
    },
    logo: {
        width: 200,
        height: 200,
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

export default Login;