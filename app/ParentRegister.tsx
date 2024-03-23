
import React, { useState } from 'react'
import { View, Dimensions, Text, TouchableOpacity } from 'react-native';
import Icon from '../components/ui/Icon';
import { colors } from '../constants/Colors';
import { Stack, router, useRouter } from 'expo-router';
import { GlobalStyles } from '../styles';
import TextArea from '@/components/ui/TextArea';
import { AddressButton, Button } from '@/components/ui/Button';
import CountrySelector from '@/components/ui/CountrySelector';
import useAuth from '@/hooks/useAuth';
import { LocationType } from '@/constants/Types';

const ParentRegister = () => {
    const {handleChange,register} = useAuth();
    return(
        <View style={GlobalStyles.container}>
            <Stack.Screen options={{ 
            title:'Create Account', 
            headerTitleStyle:{fontFamily:'fontBold',color:colors.white}, 
            }} />

            <View style={{padding:20,gap:20}}>
                <View><Text style={{fontFamily:'fontBold',color:colors.grey}}>To register your child, please complete the enrollment process. This will allow you to actively monitor your child's whereabouts and receive timely notifications regarding their scanning activity. Stay informed about the precise locations where your child has been scanned and gain insights into the individuals conducting the scans.</Text></View>

                <View>
                    <CountrySelector/>
                    <TextArea attr={{field:'phoneNumber',icon:{name:'phone',type:'FontAwesome',min:5,color:'#5586cc'},keyboardType:'phone-pad',placeholder:'ENTER YOUR PHONENUMBER',color:'#009387',handleChange}} />
                    <TextArea attr={{field:'fname',icon:{name:'user',type:'Feather',min:5,color:'#5586cc'},keyboardType:'default',placeholder:'Full Name',color:'#009387',handleChange}} />
                    <View><AddressButton handleBtnClick={(value:LocationType) => handleChange('address',value as any)} /></View>
                    <TextArea attr={{field:'password',icon:{name:'lock',type:'Feather',color:'#5586cc',min:6},keyboardType:'default',placeholder:'ENTER YOUR PASSWORD',color:'#009387',handleChange}} />
                    <View style={{marginTop:15,alignItems:'center'}}>
                        <Button 
                            btnInfo={{styles:{borderRadius:10,borderColor:colors.green,width:'50%'}}} 
                            textInfo={{text:'CREATE AN ACCOUNT',color:colors.green}} 
                            iconInfo={{type:'MaterialIcons', name:'lock',color:colors.green,size:16}}
                            handleBtnClick={register}
                        />
                        <TouchableOpacity style={{marginTop:15}} onPress={()=>router.back()}><Text style={{fontFamily:'fontBold',textAlign:'center',color:'#757575'}}>Have an account? Login Now</Text></TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}
export default ParentRegister