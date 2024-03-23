
import React, { useState } from 'react'
import { View, ScrollView } from 'react-native';
import { colors } from '../constants/Colors';
import { Stack, router } from 'expo-router';
import { GlobalStyles } from '../styles';
import TextArea from '@/components/ui/TextArea';
import { AddressButton, Button } from '@/components/ui/Button';
import { LocationType, School } from '@/constants/Types';
import { useDispatch } from 'react-redux';
import { setConfirmDialog } from '@/state/slices/ConfirmDialog';
import {showToast } from '@/helpers/methods';
import { createData, getGeoPoint } from '@/helpers/api';

const SchoolRegister = () => {
    const [formData,setFormData] = useState<School>({name:'',schoolId:'', address:null as any,contact:''});
    const handleChange = (field:string,value:string) => setFormData(v =>({...v, [field] : value}));
    const dispatch = useDispatch();
    
    const registerSchool = async() =>{
        if(formData.address && formData.name !== '' && formData.contact){
            const schoolId:string = formData.name?.toUpperCase().slice(0, 2) + Math.floor(Math.random() * 89999999 + 10000009).toString();
            const geoHash = getGeoPoint(formData.address.latitude,formData.address.longitude);
            const obj = {...formData,date:Date.now(),schoolId,geoHash}
            dispatch(setConfirmDialog({isVisible:true,text:`You are about to register ${formData.name} on the SAKids system, to proceed with the registration please press the confirm button`,okayBtn:'CONFIRM',cancelBtn:'Cancel',response:async(res:boolean) => { 
                if(res){
                    const res = await createData("schools", schoolId, obj);
                    if(res){
                        showToast('You have successfully registered a new school')
                        router.back();
                        router.back();
                    }else{
                        showToast('There was an error while trying to register a school')
                    }
                }
            }}))
        }
    }

    return(
        <View style={GlobalStyles.container}>
            <Stack.Screen options={{ 
                title:'Register A School', 
                headerTitleStyle:{fontFamily:'fontBold',color:colors.white}, 
            }} />

            <ScrollView style={{padding:20,gap:20}}>
                <View>
                    <TextArea attr={{field:'name',icon:{name:'user',type:'Feather',min:5,color:'#5586cc'},keyboardType:'default',placeholder:'School Name',color:'#009387',handleChange}} />
                    <TextArea attr={{field:'contact',icon:{name:'phone',type:'Feather',min:5,color:'#5586cc'},keyboardType:'phone-pad',placeholder:'Contact number',color:'#009387',handleChange}} />
                    <View><AddressButton placeholder='School address' handleBtnClick={(value:LocationType) => handleChange('address',value as any)} /></View>
                </View>
            </ScrollView>
            <View style={{padding:24,alignItems:'center'}}>
                <Button 
                    btnInfo={{styles:{borderRadius:10,borderColor:colors.green,width:'50%'}}} 
                    textInfo={{text:'PROCEED',color:colors.green}} 
                    iconInfo={{type:'MaterialIcons', name:'save',color:colors.green,size:16}}
                    handleBtnClick={registerSchool}
                />
            </View>
        </View>
    )
}
export default SchoolRegister