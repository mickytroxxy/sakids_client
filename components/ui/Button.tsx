import React, { memo, useState } from 'react';
import { TouchableOpacity, Text, View, Platform, StyleSheet} from 'react-native';
import Icon from './Icon';
import { AddressButtonProps, ButtonProps, DateButtonProps, IconButtonProps, LocationType } from '../../constants/Types';
import { useDispatch } from 'react-redux';
import { setModalState } from '../../state/slices/modalState';
import { colors } from '../../constants/Colors';
import { router } from 'expo-router';
import useLocation from '@/hooks/useLocation';
import moment from 'moment';
import DateTimePicker, {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
export const Button: React.FC<ButtonProps> = memo((props) => {
  const { btnInfo, textInfo, iconInfo, handleBtnClick, disabled } = props;

  return (
    <TouchableOpacity disabled={disabled}  onPress={handleBtnClick} style={[{ borderRadius: 5, padding: 15, borderColor: '#14678B', borderWidth: 0.7, flexDirection: 'row', width: '100%', marginTop: 10 }, btnInfo?.styles, disabled && {backgroundColor:'grey'}]}>
      <Icon type={iconInfo.type} name={iconInfo.name} size={iconInfo.size} color={iconInfo.color} />
      <View style={{ marginLeft: 5, justifyContent: 'center' }}>
        <Text style={{ fontFamily: 'fontBold', color: textInfo?.color, fontSize: 11, textAlign: 'center' }} numberOfLines={1}>{textInfo?.text}</Text>
      </View>
    </TouchableOpacity>
  );
});



export const IconButton: React.FC<IconButtonProps> = memo((props) => {
  const { iconInfo, handleBtnClick } = props;

  return (
    <TouchableOpacity onPress={handleBtnClick}>
      <Icon type={iconInfo.type} name={iconInfo.name} size={iconInfo.size} color={iconInfo.color} />
    </TouchableOpacity>
  );
});

export const AddressButton: React.FC<AddressButtonProps> = memo((props) => {
  const dispatch = useDispatch();
  const [searchLocation,setSearchLocation] = useState<LocationType>();
  const handleChange = (field:string,value:LocationType) => {
    setSearchLocation(value)
    props.handleBtnClick(value);
  };
  return(
    <View style={{marginTop:10}}>
      <TouchableOpacity onPress={() => {
        dispatch(setModalState({isVisible:true,attr:{headerText:'SELECT LOCATION',placeHolder:'Give Us A Location',field:'meetUpLocation',cb:handleChange}}))
      }} style={{backgroundColor : "#fff",width:'100%',borderRadius:10,padding:15,borderColor:'#a8a6a5',borderWidth:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
        <Icon type="Ionicons" name="location-outline" color={colors.primary} size={24} />
        <Text style={{fontFamily:'fontLight',color:colors.grey,fontSize:13,flex:1,marginLeft:5}}>{!searchLocation ? (props.placeholder ? props.placeholder : 'Give Us A Location') : searchLocation.text} </Text>
      </TouchableOpacity>
    </View>
  )
})
export const DatePickerButton: React.FC<DateButtonProps> = memo((props) => {
  const dispatch = useDispatch();
  const [isAndroid,setIsAndroid] = useState(false);
  const [time,setTime] = useState<any>(new Date(Date.now()));
  const handleChange = (field:string,value:string) => {
    setTime(value)
    props.handleBtnClick(value);
  };
  return(
    <View style={{marginTop:10}}>
      <TouchableOpacity onPress={() => {
        if(Platform.OS === 'android'){
          setIsAndroid(true)
        }else{
          dispatch(setModalState({isVisible:true,attr:{headerText:'SELECT DATE',field:'meetUpLocation',handleChange}}))
        }
      }} style={{backgroundColor : "#fff",width:'100%',borderRadius:10,padding:15,borderColor:'#a8a6a5',borderWidth:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
        <Icon type="MaterialIcons" name="date-range" color={colors.primary} size={24} />
        <Text style={{fontFamily:'fontLight',color:colors.grey,fontSize:13,flex:1,marginLeft:5}}>{!time ? (props.placeholder ? props.placeholder : 'Select date of birth') : moment(time).format("DD/MM/YYYY")} </Text>
      </TouchableOpacity>
        {(Platform.OS === 'android' && isAndroid) &&
          <DateTimePicker
            value={time}
            mode={props.mode}
            display={'default'}
            is24Hour={true}
            onChange={(event:any, value:any) => {
              setIsAndroid(false);
              setTimeout(() => {
                handleChange('date',value);
              }, 1000);
            }}
            style={styles.datePicker}
          />
        }
    </View>
  )
})
export const SchoolsButton: React.FC<AddressButtonProps> = memo((props) => {
  const {selectedSchool} = useLocation()
  return(
    <View style={{marginTop:10}}>
      <TouchableOpacity onPress={() => {
        router.push('/SchoolList')
      }} style={{backgroundColor : "#fff",width:'100%',borderRadius:10,padding:15,borderColor:'#a8a6a5',borderWidth:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
        <Icon type="Ionicons" name="school-outline" color={colors.primary} size={24} />
        <Text style={{fontFamily:'fontLight',color:colors.grey,fontSize:13,flex:1,marginLeft:5}}>{!selectedSchool ? (props.placeholder ? props.placeholder : 'Select School') : selectedSchool?.name} </Text>
      </TouchableOpacity>
    </View>
  )
})
const styles = StyleSheet.create({
  datePicker: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: 320,
    height: 260,
    display: 'flex',
  },
});