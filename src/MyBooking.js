import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    Image,
    AsyncStorage,
    FlatList,
    
} from 'react-native';
import API from './Api/Api';
import { ListItem, Icon } from 'react-native-elements';


export default class MyBooking extends Component {

    constructor(props) {
        super(props)
        this.state = {
           data: [],
           refreshing: false,
        }
    }
    componentDidMount() {
        this.getBooking()
    }

    async getBooking() {
        var self = this;
        var loginData = JSON.parse(await AsyncStorage.getItem('loginData'))
        if(loginData.length) {
            var lastSlot = loginData.pop()
            var request = {
                EMPID: lastSlot.EMPID,
            }
            var response = new API('Booking',request).getApiResponse();
            response.then(result => {
                console.log("result: ",result)
                if(result.data) {
                    this.setState({data: result.data})
                }
            }).catch(error => {
                console.log("error: ",error)
            })
        }
    }

    getTimeFormat(date) {
       var date = new Date(date);
        var dd = String(date.getDate()).padStart(2, '0');
        var mm = String(date.getMonth() + 1).padStart(2, '0');
        var yyyy = date.getFullYear();
        var dateZone = yyyy+"-"+mm+"-"+dd;
        
        return dateZone
    }

    cancelBooking = async (item) => {
        // var request = {Id: item.userid, booking: item};
        var response = new API('CancelBooking',item).getResponse();
        console.log("response: ",response,"request: ",item)
        response.then(result => {
            alert('Booking Cancelled Successfully')
            this.getBooking()
        }).catch(error => {
            console.log("error: ",error)
        })
    }

    showCancelAlert = (item) => {
        Alert.alert(
            'Are you sure you want to cancel this booking?',
            '',
            [
              {
                text: 'No',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {text: 'Yes', onPress: () => this.cancelBooking(item)},
            ],
            {cancelable: false},
        );
    }

    getTitle = (item) => {
        return (
            <View>
                <Text>Floor {item.flno}</Text>
                <Text>Slot no {item.slotno}</Text>
                <View>
                    <Text>Booking From: {this.getTimeFormat(item.tdate)} {item.ftime}</Text>
                    <Text>Booking To: {this.getTimeFormat(item.tdate)} {item.ttime}</Text>
                </View>
                <Text>Transaction ID: {item.transid}</Text>
            </View>
        )
    }
    renderItem = ({item, index}) => {
        var title = this.getTitle(item);
        var subtitle = "Booked on: "+this.getTimeFormat(item.bookeddate) + " " + item.bookedtime;
        return (
            <ListItem title={title}
            rightSubtitle={subtitle}
            bottomDivider
            rightIcon={<Icon name="times" raised onPress={() => this.showCancelAlert(item)} type="font-awesome" color="#000033" />}
            />
        )
    }

    refresh = () => {
        this.getBooking()
    }
    

    render() {
        return (
            <FlatList
                data={this.state.data}
                keyExtractor={(item, index) => index}
                renderItem={this.renderItem}
                refreshing={this.state.refreshing}
                onRefresh={this.refresh}
            />
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

});