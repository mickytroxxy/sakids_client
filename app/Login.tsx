
import React, { useState } from 'react'
import { View, Dimensions, Text, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '../constants/Colors';
import { Stack, router, useLocalSearchParams, useRouter } from 'expo-router';
import { GlobalStyles } from '../styles';
import TextArea from '@/components/ui/TextArea';
import { Button } from '@/components/ui/Button';
import CountrySelector from '@/components/ui/CountrySelector';
import useAuth from '@/hooks/useAuth';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '@/components/ui/Icon';
const Login = () => {
    const {handleChange,login} = useAuth();
    const router = useRouter();
    const { q } = useLocalSearchParams<{ q: string }>();
    return(
        <View style={GlobalStyles.container}>
            <Stack.Screen options={{ 
                title:'LOGIN TO PROCEED', 
                headerTitleStyle:{fontFamily:'fontBold',color:colors.white}, 
            }} />

            <LinearGradient colors={["#fff","#e8e9f5","#fff",colors.primary]} style={{flex:1,paddingTop:10,borderRadius:10}}>
                <ScrollView style={{padding:10}}> 
                    <View style={{alignItems:'center',padding:36}}>
                        <Icon type='AntDesign' name='unlock' color={colors.green} size={120} />
                    </View>
                    <CountrySelector/>
                    <TextArea attr={{field:'phoneNumber',icon:{name:'phone',type:'FontAwesome',min:5,color:'#5586cc'},keyboardType:'phone-pad',placeholder:'ENTER YOUR PHONENUMBER',color:'#009387',handleChange}} />
                    <TextArea attr={{field:'password',icon:{name:'lock',type:'Feather',color:'#5586cc',min:6},keyboardType:'default',placeholder:'ENTER YOUR PASSWORD',color:'#009387',handleChange}} />
                    <View style={{marginTop:15,alignItems:'center'}}>
                        <Button 
                            btnInfo={{styles:{borderRadius:10,borderColor:colors.green,width:'50%'}}} 
                            textInfo={{text:'LOGIN',color:colors.green}} 
                            iconInfo={{type:'AntDesign', name:'unlock',color:colors.green,size:24}}
                            handleBtnClick={login}
                        />
                        <TouchableOpacity style={{marginTop:15}} onPress={()=>router.push('/ParentRegister')}><Text style={{fontFamily:'fontBold',textAlign:'center',color:'#757575'}}>Don't have an account? Register Now</Text></TouchableOpacity>
                    </View>
                </ScrollView>
            </LinearGradient>
        </View>
    )
}
export default Login