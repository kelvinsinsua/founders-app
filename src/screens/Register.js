import React, {useState} from 'react';
import { Text } from '@react-native-material/core';
import { TextInput, Button } from "@react-native-material/core";
import { useToast } from "react-native-toast-notifications";
import {
    View,
    SafeAreaView,
    StyleSheet,
    Image,
    Dimensions,
    ScrollView,
    TouchableOpacity
  } from 'react-native';
import API, {KEY} from '../api'
import {isValidEmail} from '../utilities'

const Register = ({navigation}) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const toast = useToast();

    const register = async () => {
        if(email.trim() && password.trim() && confirmPassword.trim()){
            if(!isValidEmail(email)){
                setMessage('Please enter a valid email.');
                return;
            }
            if(password !== confirmPassword){
                setMessage("Passwords don't match.");
                return;
            }
            setMessage('');
            setLoading(true);
            const data = {
                email,
                password
            }
            const response = await API.post(`/user.json?key=${KEY}`,data);
            if(response.status == 200){
                setPassword('');
                setEmail('');
                setConfirmPassword('');
                toast.show("Successful registration", {type: "success"});
                navigation.navigate('Login');
            }else{
                setMessage('Something went wrong, please try again.');
            }
            setLoading(false);
        }else{
            setMessage('Username, password and confirm password are required.')
        }
    }
    return(
        <SafeAreaView>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.logoContainer}>
                    <Image source={require('../app.png')} style={styles.logo} />
                </View>
                <View style={styles.formContainer}>
                    <Text style={styles.textLogin}>Register</Text>
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
                        <TextInput
                            label="Confirm password"
                            variant="outlined"
                            style={styles.input}
                            onChangeText={(text) => setConfirmPassword(text)}
                            secureTextEntry
                            value={confirmPassword}
                        />
                        <Text style={styles.error}>{message}</Text>
                        <Button 
                            title="Register" 
                            style={styles.input} 
                            onPress={register}
                            loading={loading}
                            disabled={loading} 
                        />
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}><Text style={styles.link}>Login</Text></TouchableOpacity>
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

export default Register;