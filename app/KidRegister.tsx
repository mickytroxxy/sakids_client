
import React, { useState } from 'react'
import { View, Dimensions, Text, TouchableOpacity, Platform, ScrollView } from 'react-native';
import Icon from '../components/ui/Icon';
import { colors } from '../constants/Colors';
import { Stack, router, useRouter } from 'expo-router';
import { GlobalStyles } from '../styles';
import TextArea from '@/components/ui/TextArea';
import { AddressButton, Button, DatePickerButton, SchoolsButton } from '@/components/ui/Button';
import CountrySelector from '@/components/ui/CountrySelector';
import useAuth from '@/hooks/useAuth';
import { LocationType } from '@/constants/Types';
import { AntDesign } from '@expo/vector-icons';
import { Switch, TouchableRipple } from 'react-native-paper';
import useLocation from '@/hooks/useLocation';
import { useDispatch } from 'react-redux';
import { setConfirmDialog } from '@/state/slices/ConfirmDialog';
import { phoneNoValidation, sendSms, showToast } from '@/helpers/methods';
import { createData, getGeoPoint, getUserDetailsByPhone } from '@/helpers/api';
import useProfile from '@/hooks/useProfile';
import moment from 'moment';
import useLoader from '@/hooks/useLoader';

const KidRegister = () => {
    const [formData,setFormData] = useState({fname:'',dateOfBirth:null, grade:null,class:null});
    const [formData1,setFormData1] = useState({fname:'',phoneNumber:null, address:{} as LocationType,password:'000000'});
    const {selectedSchool} = useLocation()
    const handleChange = (field:string,value:string) => setFormData(v =>({...v, [field] : value}));
    const handleChange1 = (field:string,value:string) => setFormData1(v =>({...v, [field] : value}));
    const [isGurdian,setIsGuardian] = useState(true);
    const dispatch = useDispatch();
    const {countryData} = useAuth();
    const {mainProfile,getCurrentProfile} = useProfile()
    const {updateLoadingState} = useLoader();
    const getParentId = async () => {
        if(!isGurdian){
            dispatch(setConfirmDialog({isVisible:true,text:`Hi ${formData.fname}, please confirm if you have entered the correct details`,okayBtn:'CONFIRM',cancelBtn:'Cancel',response:async(res:boolean) => { 
                const phoneNumber = phoneNoValidation(formData1?.phoneNumber as any,countryData.dialCode);
                const parentId:string = formData1.fname?.toUpperCase().slice(0, 2) + Math.floor(Math.random() * 89999999 + 10000009).toString();
                const geoHash = getGeoPoint(formData1?.address.latitude,formData1?.address.longitude);
                if(phoneNumber){
                    updateLoadingState(true,'Registration in progress, please wait...')
                    if(res){
                        const code = Math.floor(Math.random()*89999+10000);
                        const obj = {...formData1,date:Date.now(),phoneNumber,code,parentId,geoHash}

                        const response = await getUserDetailsByPhone(phoneNumber || "");
                        if (response.length === 0) {
                            const res = await createData("users", parentId, obj);
                            if(res){
                                return parentId;
                            }
                        }else{
                            const res = response[0];
                            return res.parentId;
                        }

                        //sendSms(phoneNumber,`Hi ${formData1.fname}, your smartID secret code for your kid code is ${code}`)
                    }
                }else{
                    showToast("Invalid phonenumber");
                    return null;
                }
            }}))
        }else{
            updateLoadingState(true,'Registration in progress, please wait...')
            console.log('Wowowowo')
            return mainProfile?.parentId;
        }
        
    }
    const enroll = async() => {
        if((formData1.fname !== '' && formData1?.phoneNumber && formData1?.address) || isGurdian){
            const parentId = await getParentId(); 
            if(formData?.fname?.length > 5 && formData?.grade !== '' && formData?.dateOfBirth !== null){
                if(selectedSchool){
                    const id:string = formData.fname?.toUpperCase().slice(0, 2) + Math.floor(Math.random() * 89999999 + 10000009).toString();
                    const obj = {...formData,id,date:Date.now(),parentId,schoolId:selectedSchool?.schoolId};
                    const res = await createData("kids", id, obj);
                    if(res){
                        getCurrentProfile(id);
                    }
                }
            }
            console.log(parentId)
        }else{
            showToast('Please carefully fill in to proceed!')
        } 
    }
    return(
        <View style={GlobalStyles.container}>
            <Stack.Screen options={{ 
                title:'Enroll A Kid', 
                headerTitleStyle:{fontFamily:'fontBold',color:colors.white}, 
            }} />

            <ScrollView style={{padding:20,gap:20}}>
                <View>
                    <TextArea attr={{field:'fname',icon:{name:'user',type:'Feather',min:5,color:'#5586cc'},keyboardType:'default',placeholder:'Kid Full Name',color:'#009387',handleChange}} />
                    <View><DatePickerButton mode='date' handleBtnClick={(value:string) => handleChange('dateOfBirth',moment(value).format("DD/MM/YYYY") as any)} /></View>
                    <View><SchoolsButton handleBtnClick={(value:LocationType) => handleChange('school',value as any)} /></View>
                    <TextArea attr={{field:'grade',icon:{name:'list',type:'Feather',min:5,color:'#5586cc'},keyboardType:'default',placeholder:'Grade',color:'#009387',handleChange}} />
                    <TextArea attr={{field:'class',icon:{name:'list',type:'Feather',min:5,color:'#5586cc'},keyboardType:'default',placeholder:'Grade class eg A,B,C,D',color:'#009387',handleChange}} />
                </View>

                <View style={{marginTop:20}}>
                    <View style={{flexDirection:'row',borderColor:'#f2eae9',borderBottomWidth:0.8,padding:10,marginBottom:10,backgroundColor:colors.primary,justifyContent:'center',borderRadius:10}}>
                        <View style={{width:30,justifyContent:'center'}}>
                            <AntDesign name="infocirlceo" size={30} color={colors.white}/>
                        </View>
                        <View style={{justifyContent:'center',alignContent:'center',flex:1}}>
                            <Text style={{color:colors.white,fontFamily:'fontBold',paddingLeft:15,fontSize:Platform.OS === 'android' ? 12 : 14}}>GURDIAN DETAILS</Text>
                        </View>
                    </View>
                    <View style={{flexDirection:'row',borderColor:'#f2eae9',borderBottomWidth:0.8,paddingBottom:10,marginBottom:10}}>
                        <View style={{width:30,justifyContent:'center'}}>
                            <AntDesign name="Safety" size={30} color="#0e75b4"/>
                        </View>
                        <View style={{justifyContent:'center',alignContent:'center',flex:1}}>
                            <Text style={{color:'#2a2828',fontFamily:'fontBold',paddingLeft:15,fontSize:Platform.OS === 'android' ? 10 : 12}}>I AM THE GURDIAN</Text>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                            <TouchableRipple onPress={() => setIsGuardian(!isGurdian)}>
                                <View>
                                    <View pointerEvents="none">
                                        <Switch value={isGurdian} color={colors.green} />
                                    </View>
                                </View>
                            </TouchableRipple>
                        </View>
                    </View>
                    {!isGurdian &&
                        <View>
                            <CountrySelector/>
                            <TextArea attr={{field:'phoneNumber',icon:{name:'phone',type:'FontAwesome',min:5,color:'#5586cc'},keyboardType:'phone-pad',placeholder:'Guardian phone number',color:'#009387',handleChange:(field,value) => handleChange1(field,value)}} />
                            <TextArea attr={{field:'fname',icon:{name:'user',type:'Feather',min:5,color:'#5586cc'},keyboardType:'default',placeholder:'Gurdian full name',color:'#009387',handleChange:(field,value) => handleChange1(field,value)}} />
                            <View><AddressButton placeholder='Guardian address' handleBtnClick={(value:LocationType) => handleChange1('address',value as any)} /></View>
                        </View>
                    }
                    <View style={{marginTop:15,alignItems:'center'}}>
                        <Button 
                            btnInfo={{styles:{borderRadius:10,borderColor:colors.green,width:'50%'}}} 
                            textInfo={{text:'PROCEED',color:colors.green}} 
                            iconInfo={{type:'MaterialIcons', name:'save',color:colors.green,size:16}}
                            handleBtnClick={enroll}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}
export default KidRegister