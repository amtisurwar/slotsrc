import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  FlatList,
  Picker,
  Dimensions,
} from 'react-native';
import DatePicker from 'react-native-datepicker'
import { Container, Header, Content, Form, Title, Left, Body, Right } from "native-base";
import { CheckBox, Icon, Card } from 'react-native-elements'
import API from './Api/Api';

const { width, height } = Dimensions.get('window')

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: null,
      data: [],
      checked: false,
      startDate: new Date(),
      endDate: '',
      startTime: '',
      endTime: '',
      formList: [],
      checkedHome: [],
      tomorrow: new Date(),
      showBooking: false,
    };
  }

  componentDidMount() {
   this.getData()
  }

  getTomorrow() {
    var date = new Date();
    var dd = String(date.getDate() + 1).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0');
    var yyyy = date.getFullYear();
    return yyyy+"-"+mm+"-"+dd;
  }

  getData() {
    var response = new API('Floors').getApiResponse();
    response.then(result => {
      if(result.status == 200) {
        this.setState({formList: result.data, showBooking: false})
        
      }
    })
  }

  check(book) {
    this.setState({
      checkedHome: book
    })
  }

  showBookingSection = () => {
    // if(!this.state.startDate || !this.state.startTime || !this.state.endDate || !this.state.endTime) {
    //   alert('All fields are mandatory')
    //   return;
    // }
    this.setState({showBooking: true})
  }

  printBookingSection2 = () => {
    
    return (
     <View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent:'center'}}>
        {this.state.data.map((book, index) => {
          var selection = book.slotno == this.state.checkedHome.slotno ? {backgroundColor:'#000033'} : null;
          return (
            <TouchableOpacity
              onPress={() => this.check(book, index)}
              key={index}
              disabled={!book.vacatE_YN ? true : false}
              style={[!book.vacatE_YN ? styles.disable : styles.enable, selection]}>
              <Text style={selection && {color:'#FFF'}}>{book.slotno}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
      <TouchableOpacity onPress={() => this.confirmBooking()} style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', backgroundColor: '#000033', padding: 12, marginTop: 30, marginHorizontal:40 }}>
      <Text style={{ color: 'white' }}>Confirm Booking</Text>
      </TouchableOpacity>
     </View>
    )
  }

  getRooms = async (value) => {
    this.setState({ language: value, checkedHome: [], showBooking: false })
    var query = "?flno="+value;
    var response = new API('Rooms').getApiResponse(query);
    console.log('response: ',response)
    response.then(result => {
      if(result.status == 200) {
        this.setState({data: result.data})
        
      }
    })
  }

  getTimeFormat(date = null) {
    if(!date) {
        date = new Date();
    }
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0');
    var yyyy = date.getFullYear();
    var dateZone = yyyy+"-"+mm+"-"+dd;
    var timeZone = (date.getHours()<10 ? '0' : '') + date.getHours() + ':' + (date.getMinutes()<10 ? '0' : '') + date.getMinutes() + ':' + (date.getSeconds()<10 ? '0' : '') + date.getSeconds();
    return dateZone+"T"+timeZone
  }

  getTimeOnly(date) {
    return (date.getHours()<10 ? '0' : '') + date.getHours() + ':' + (date.getMinutes()<10 ? '0' : '') + date.getMinutes()
  }


  success() {
    alert('Booking Successfully')
    this.setState({
      language: null,
      data: [],
      checked: false,
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      checkedHome: [],
    })
  }

  confirmBooking = async () => {
      var request = {
        comP_CODE: this.state.checkedHome.comP_CODE,
        USERID: this.state.checkedHome.userid,
        TIMESTAMP: this.state.checkedHome.timestamp,
        FLNO: this.state.checkedHome.flno,
        TRANSID: "",
        SLOTNO: this.state.checkedHome.slotno,
        TDATE: this.state.endDate+"T00:00:00",
        TTIME: this.state.endTime,
        FDATE: this.state.startDate+"T:00:00:00",
        FTIME: this.state.startTime,
        EMPID: this.state.checkedHome.userid,
        BOOKEDDATE: this.getTimeFormat(),
        BOOKEDTIME: this.getTimeFormat(),
        VACATED_YN: "",
      }
      
      console.log("request: ",request)
      var response = new API('Booking',request).getResponse();
      console.log("response: ",response)
      response.then(result => {
        this.success()
      }).catch(error => {
        console.log("error: ",error)
      })
  }

  printDateSection = () => {
    return (
      <Card>
        <View style={{ flexDirection: 'row', marginTop: 18 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 17, marginTop: 6 }}>From Date: </Text>
          <DatePicker
            style={{ width: 200 }}
            date={this.state.startDate}
            mode="date"
            //placeholder="mm/dd/yyyy"
            format="YYYY-MM-DD"
            minDate={this.state.tomorrow}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                width: 0,
                height: 0
              },
              dateInput: {
                marginLeft: 10
              }
            }}
            onDateChange={(startDate) => { this.setState({ startDate: startDate }) }}
          />
        </View>
        <View style={{ flexDirection: 'row', marginTop: 18 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 17, marginTop: 6 }}>Time: </Text>
          <DatePicker
            style={{ width: 242, paddingLeft: 40 }}
            date={this.state.startTime}
            mode="time"
            //placeholder="From Time"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                width: 0,
                height: 0
              },
              dateInput: {
                marginLeft: 10
              }
            }}
            onDateChange={(startTime) => { this.setState({ startTime: startTime }) }}
          />
        </View>
        <View style={{ flexDirection: 'row', marginTop: 18 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 17, marginTop: 6 }}>To Date: </Text>
          <DatePicker
            style={{ width: 225, paddingLeft: 22 }}
            date={this.state.endDate}
            mode="date"
            minDate={this.state.startDate}
            //placeholder="mm/dd/yyyy"
            format="YYYY-MM-DD"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                width: 0,
                height: 0
              },
              dateInput: {
                marginLeft: 10
              }
            }}
            onDateChange={(endDate) => { this.setState({ endDate: endDate }) }}
          />
        </View>
        <View style={{ flexDirection: 'row', marginTop: 18 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 17, marginTop: 6 }}>To </Text>
          <DatePicker
            style={{ width: 270, paddingLeft: 67 }}
            date={this.state.endTime}
            //placeholder="To Time"
            mode="time"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                width: 0,
                height: 0
              },
              dateInput: {
                marginLeft: 10
              }
            }}
            onDateChange={(endTime) => { this.setState({ endTime: endTime }) }}
          />
        </View>
        <TouchableOpacity onPress={() => this.showBookingSection()} style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', backgroundColor: '#000033', padding: 12, marginTop: 30 }}>
          <Text style={{ color: 'white' }}>Next</Text>
        </TouchableOpacity>
      </Card>
    )
  }

  render() {
    return (
      <Container style={{ flex: 1 }}>
        <View style={{ padding: 20 }}>
          <View style={{ marginTop: 50, flexDirection: 'row', justifyContent:'center' }}>
            <Text style={{ fontSize: 17, fontWeight: 'bold', marginTop: 11 }}>Select Floor</Text>
            <View style={{ paddingLeft: 20 }}>
              <Picker
                selectedValue={this.state.language}
                style={{ height: 30, width: 150, backgroundColor: '#000033', marginTop: 8, color: 'white' }}
                onValueChange={(itemValue, itemIndex) => this.getRooms(itemValue) }>
                <Picker.Item label="Select Floor" value="" style={{ width: 300 }} />
                {this.state.formList.map(floor => <Picker.Item key={floor.sno} label={floor.DESCRIPTION} value={floor.FLNO} />)}
              </Picker>
            </View>
          </View>
          {this.state.language && this.state.showBooking ?
            <View style={{ marginTop: 15, marginBottom: 15, }}>
              <Text style={{fontSize: 17, fontWeight: 'bold', marginLeft: 10}}>Block A</Text>
              {this.printBookingSection2()}
            </View>
            : null}
        </View>
        {this.state.language && !this.state.showBooking ? this.printDateSection() : null}
      </Container>
    );
  }
}

const size = width / 10 - 8;
const styles = StyleSheet.create({
  cardImage: {
    height: 45,
    width: 45,
    alignSelf: 'center'
  },
  
  enable: { backgroundColor: 'grey', margin: 1, width: size, height: size, alignItems: 'center', justifyContent: 'center' },
  disable: { backgroundColor: 'grey', opacity: 0.3, margin: 1, width: size, height: size, alignItems: 'center', justifyContent: 'center' },
  
});

console.disableYellowBox = true;