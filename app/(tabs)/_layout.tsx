
import React, { useEffect, useState } from 'react'
import { Text, View, TouchableOpacity, Platform, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import * as Animatable from 'react-native-animatable';
import { Stack, useRouter } from 'expo-router';
import useProfile from '@/hooks/useProfile';
import Loader from '@/components/ui/Loader';
import { AntDesign } from '@expo/vector-icons';
import { GlobalStyles } from '@/styles';
import { colors } from '@/constants/Colors';
import Icon from '@/components/ui/Icon';
import { getMissingKids, getSchoolByID } from '@/helpers/api';
import { Kid, School } from '@/constants/Types';
import { ageCalculator, registerForPushNotificationsAsync } from '@/helpers/methods';

const Home = () => {
    const router = useRouter();
    const [actionButtons,setActionButtons] = useState([
        {name:"ENROLL A KID", backgroundColor:colors.primary,onPress:()=>{
            if(mainProfile){
                router.push('/KidRegister');
            }else{
                router.push('/Login');
            }
        }, 
        icon:() => <Icon name='person-add-outline' type='Ionicons' size={96} color={colors.white} />},

        {name:"REPORT MISSING KID", backgroundColor:colors.tomato, onPress:()=>{
            if(mainProfile){
                router.push('/FaceReco');
            }else{
                router.push('/Login');
            }
        }, 
        icon:() => <Icon name='help-circle-outline' type='Ionicons' size={96} color={colors.white} />}
    ])
    const {getCurrentProfile,mainProfile,getActiveUser} = useProfile();
    const [missingKids,setMissingKids] = useState<Kid[]>([]);
    const getStudentInfo = async (schoolId: string, kid: Kid) => {
        try {
        const schoolResponse: School[] = await getSchoolByID(schoolId);
        if (schoolResponse.length > 0) {
            const obj = { ...kid, schoolName: schoolResponse[0]?.name };
            return obj;
        }
        return null;
        } catch (error) {
        console.error("Error fetching school info:", error);
        return null;
        }
    };
    useEffect(() => {
        const fetchMissingKids = async () => {
            try {
                getMissingKids((kids: Kid[]) => {
                    if (kids.length > 0) {
                        Promise.all(
                            kids.map(async (kid) => {
                                const updatedKid = await getStudentInfo(kid.schoolId, kid);
                                if (updatedKid) {
                                    setMissingKids((prevKids) => [...prevKids, updatedKid]);
                                }
                            })
                        );
                    }
                });
            } catch (error) {
                console.error("Error fetching missing kids:", error);
            }
        };
    
        fetchMissingKids();
        if(mainProfile){
            registerForPushNotificationsAsync(mainProfile?.parentId);
        }
  }, []);
  return(
    <View style={GlobalStyles.container}>
        <Stack.Screen options={{ 
            title:'SAKIDS', 
            headerStyle: {backgroundColor: colors.white},
            headerTitleStyle:{fontFamily:'fontBold',color:colors.primary}, 
            headerLeft: () => (<View></View>),
            headerRight: () => (<TouchableOpacity onPress={() => {
                if(mainProfile){
                    getActiveUser(mainProfile?.parentId);
                }else{
                    router.push('/Login');
                }
            }} style={{marginRight:Platform.OS === 'android' ? 5 : 0,marginLeft:-10}}><Icon type="MaterialIcons" name="account-circle" size={30} color={colors.primary} /></TouchableOpacity>)
        }} />
        <LinearGradient colors={["#fff","#e8e9f5","#fff",colors.secondary]} style={{flex:1}}>
            <View style={{padding:20}}>
                <Animatable.View animation="fadeInDownBig" useNativeDriver={true} style={{alignItems:'center'}}>
                    <TouchableOpacity style={{width:'100%'}} onPress={() => router.push('/FaceReco')}>
                        <LinearGradient colors={[colors.primary,colors.grey]}start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={{padding:24,flexDirection:'row',borderRadius:20}}>
                            <View style={{justifyContent:'center'}}><Icon name='face-recognition' type='MaterialCommunityIcons' size={72} color={colors.white} /></View>
                            <View style={{justifyContent:'center',marginLeft:12}}>
                                <Text style={{fontFamily:'fontBold',fontSize:16,color:colors.white,}}>FACIAL RECOGNITION</Text>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                </Animatable.View>
                
                <ScrollView style={{}} showsVerticalScrollIndicator={false}>
                    <View style={{marginTop:20,flexDirection:'row',justifyContent:'space-between'}}>
                        {actionButtons?.map(({name,icon,backgroundColor, onPress},i) => 
                            <TouchableOpacity onPress={onPress} key={i} style={{backgroundColor:backgroundColor, width:'48%',padding:20,borderRadius:20,alignItems:'center'}}>
                                {icon()}
                                <Text style={{color:colors.white,fontFamily:'fontBold',textAlign:'center'}}>{name}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={{marginTop:24,flexDirection:'row',borderColor:'#f2eae9',borderBottomWidth:0.8,padding:10,marginBottom:10,backgroundColor:colors.primary,justifyContent:'center',borderRadius:10}}>
                        <View style={{width:30,justifyContent:'center'}}>
                            <AntDesign name="infocirlceo" size={30} color={colors.white}/>
                        </View>
                        <View style={{justifyContent:'center',alignContent:'center',flex:1}}>
                            <Text style={{color:colors.white,fontFamily:'fontBold',paddingLeft:15,fontSize:Platform.OS === 'android' ? 12 : 14}}>MISSING KIDS</Text>
                        </View>
                    </View>
                    <View style={{marginTop:24,paddingBottom:200}}>
                        {missingKids?.length === 0 && 
                            <View style={{alignItems:'center'}}>
                                <Icon name='like2' type='AntDesign' size={120} color={colors.green} />
                                <Text style={{color:colors.green,fontFamily:'fontLight',textAlign:'center'}}>No missing kids within your 10km radius</Text>
                            </View>
                        }

                        {(missingKids && missingKids?.length > 0) && missingKids?.map((kid,i) => {
                            return(
                                <TouchableOpacity key={i} onPress={() => getCurrentProfile(kid.id)} style={{paddingVertical:12,flexDirection:'row',borderBottomWidth:1,borderBottomColor:colors.faintGray}}>
                                    <View style={{width:100,height:100,backgroundColor:colors.primary,alignItems:'center',justifyContent:'center',borderRadius:20}}>
                                        <Image source={{uri:kid.avatar}} style={{width:98,height:98,borderRadius:20}} />
                                    </View>
                                    <View style={{marginLeft:12,justifyContent:'center',gap:6,flex:1}}>
                                        <Text style={{color:colors.primary,fontFamily:'fontBold'}}>{kid?.fname}</Text>
                                        <Text style={{color:colors.grey,fontFamily:'fontLight'}}>{kid?.schoolName}</Text>
                                        <Text style={{color:colors.grey,fontFamily:'fontLight'}}>AGE: {ageCalculator(kid?.dateOfBirth)?.toFixed()}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </ScrollView>
            </View>
        </LinearGradient>
    </View>
  )
}
export default Home