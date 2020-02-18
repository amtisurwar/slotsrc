import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    Image,
    AsyncStorage
} from 'react-native';
import API from './Api/Api';


export default class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            // companyCode: 'C01',
            // username: 'E01',
            // password: 'pass@123_',
            companyCode: '',
            username: '',
            password: '',
            
        }
    }
    componentDidMount() {
        //this.bootStrap();
    }

    async bootStrap() {
        var token = await AsyncStorage.getItem('token')
        if (token) {
            this.props.navigation.navigate('Home')
        } else {
            this.props.navigation.navigate('Login')
        }
    }

    async success(data) {
        console.log("data: ",data)
        await AsyncStorage.setItem("loginData",JSON.stringify(data))
        this.props.navigation.navigate('Home');
    }

    getLoginDetails = async () => {
        var query = "?EMP_ID="+this.state.username;
        var response = await new API('Profile').getApiResponse(query);
        
        if(response.status == 200) {
            this.success(response.data);
        }
        else {
            alert('Failed to get your details, please try again later')
        }
    }

    login = async () => {
        const { username, password, companyCode } = this.state;
        if(!username || !companyCode || !password) {
            alert('All fields are mandatory')
        }
        else {
            var query = "?Comp_code="+companyCode+"&LoginName="+username+"&Password="+password
            var response = await new API('Login').getApiResponse(query);
            console.log("result login: ",response)
            if(response.status == 200 && response.data) {
                this.getLoginDetails();
            }
            else {
                alert('Invalid Details')
            }
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <Image style={[styles.icon, styles.inputIcon]} source={{ uri: 'https://png.icons8.com/password/androidL/40/3498db' }} />
                    <TextInput style={styles.inputs}
                        placeholder="Company Code"
                        value={this.state.companyCode}
                        onChangeText={(text) => this.setState({companyCode: text})}
                        underlineColorAndroid='transparent' />
                </View>
                <View style={styles.inputContainer}>
                    <Image style={[styles.icon, styles.inputIcon]} source={{ uri: 'https://png.icons8.com/password/androidL/40/3498db' }} />
                    <TextInput style={styles.inputs}
                        placeholder="Emp Id"
                        value={this.state.username}
                        onChangeText={(text) => this.setState({username: text})}
                        underlineColorAndroid='transparent' />
                </View>
                <View style={styles.inputContainer}>
                    <Image style={[styles.icon, styles.inputIcon]} source={{ uri: 'https://png.icons8.com/envelope/androidL/40/3498db' }} />
                    <TextInput style={styles.inputs}
                        placeholder="Password"
                        value={this.state.password}
                        onChangeText={(text) => this.setState({password: text})}
                        secureTextEntry={true}
                        underlineColorAndroid='transparent' />
                </View>
                {/* <TouchableOpacity style={styles.restoreButtonContainer}>
                    <Text>Forgot?</Text>
                </TouchableOpacity> */}
                <TouchableOpacity onPress={() => this.login()} style={[styles.buttonContainer, styles.loginButton]}>
                    <Text style={styles.loginText}>Login</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#B0E0E6',
    },
    inputContainer: {
        borderBottomColor: '#F5FCFF',
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        borderBottomWidth: 1,
        width: 250,
        height: 45,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    inputs: {
        height: 45,
        marginLeft: 16,
        borderBottomColor: '#FFFFFF',
        flex: 1,
    },
    icon: {
        width: 30,
        height: 30,
    },
    inputIcon: {
        marginLeft: 15,
        justifyContent: 'center'
    },
    buttonContainer: {
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        width: 250,
        borderRadius: 30,
    },
    loginButton: {
        backgroundColor: '#3498db',
    },
    fabookButton: {
        backgroundColor: "#3b5998",
    },
    googleButton: {
        backgroundColor: "#ff0000",
    },
    loginText: {
        color: 'white',
    },
    restoreButtonContainer: {
        width: 250,
        marginBottom: 15,
        alignItems: 'flex-end'
    },
    socialButtonContent: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    socialIcon: {
        color: "#FFFFFF",
        marginRight: 5
    }
});