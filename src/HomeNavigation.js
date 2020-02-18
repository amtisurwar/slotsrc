import React, { Component } from 'react';
import {
  createStackNavigator,
} from 'react-navigation-stack';
import Login from './Login';
import Home from './Home';
import MyBooking from './MyBooking';
import { Icon } from 'react-native-elements'
const LoginStack = createStackNavigator({
  Login: {
    screen: Login,
    navigationOptions: ({ navigation }) => ({
      header: null,
    })
  },
  Home: {
    screen: Home,
    navigationOptions: ({ navigation }) => ({
      headerLeft: null,
      headerTitle: 'SLOT Booking',
      headerTitleStyle:{color:'#FFF'},
      headerStyle:{backgroundColor: '#000033'},
      headerRight: <Icon name="server" onPress={() => navigation.navigate('MyBooking')} type="font-awesome" color="#FFF" iconStyle={{marginRight:10}} />
    })
  },
  MyBooking: {
    screen: MyBooking,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'My Booking',
      headerTitleStyle:{color:'#FFF'},
      headerStyle:{backgroundColor: '#000033'},
    })
  },

},
  { headerLayoutPreset: 'center' }
  , {
    initialRouteName: 'Login'
  });


module.exports = LoginStack;