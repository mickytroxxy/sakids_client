import {TouchableOpacity, View, Text, StyleSheet, Clipboard, Platform, Image} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { AntDesign, Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/Colors";
import useProfile from "@/hooks/useProfile";
import { getParentByID, getSchoolByID, updateData } from "@/helpers/api";
import { useEffect, useState } from "react";
import { School } from "@/constants/Types";
import { ageCalculator, nativeLink, sendPushNotification, showToast } from "@/helpers/methods";
import { Button } from "../ui/Button";
import { setConfirmDialog } from "@/state/slices/ConfirmDialog";
import useLocation from "@/hooks/useLocation";
export type TokenTypes = {
    accountId:string;
    currentAmount: number;
    purchaseValue:number;
    token: string;
    timeStamp:number;
}
export const BodySection = () =>{
    const navigation = useRouter();
    const dispatch = useDispatch();
    const {currentProfile:{class:klas,grade,parentId,dateOfBirth,schoolId,id,isMissing},getActiveUser,getNearByUsers} = useProfile(); 
    const {location} = useLocation();
    const {activeUser:{profileOwner}} = useProfile(); 
    const [studentInfo,setStudentInfo] = useState<{guardianInfo:any,schoolInfo:School}>({guardianInfo:null,schoolInfo:{} as any});
    const {guardianInfo,schoolInfo} = studentInfo;
    const getStudentInfo = async () => {
        const parentResponse = await getParentByID(parentId);
        const schoolResponse = await getSchoolByID(schoolId);
        if(parentResponse.length > 0){
            setStudentInfo(prevState => ({...prevState,guardianInfo:parentResponse[0]}))
        }
        if(schoolResponse.length > 0){
            setStudentInfo(prevState => ({...prevState,schoolInfo:schoolResponse[0]}))
        }
    }

    useEffect(() => {
        getStudentInfo();
    },[])
    return(
        <View style={{flex: 1,marginTop:5,borderRadius:10}}>
            <LinearGradient colors={["#fff","#e8e9f5","#fff","#F6BDA7"]} style={styles.footerStyle}>
                <View style={styles.ProfileFooterHeader}>
                    <View style={{alignContent:'center',alignItems:'center',marginTop:-10}}>
                        <FontAwesome name="ellipsis-h" color="#63acfa" size={36}></FontAwesome>
                    </View>

                    <View style={{flexDirection:'row',padding:12}}>
                        <View style={{alignItems:'flex-start',width:'25%'}}>
                            <View>
                                <Text style={{color:colors.grey,fontFamily:'fontLight',textAlign:'center'}}>AGE</Text>
                                <Text style={{color:colors.grey,fontFamily:'fontBold',textAlign:'center'}}>{ageCalculator(dateOfBirth)?.toFixed()}</Text>
                            </View>
                        </View>
                        <View style={{alignItems:'center',flex:1,borderRightWidth:1,borderRightColor:colors.secondary,borderLeftWidth:1,borderLeftColor:colors.secondary}}>
                            <View>
                                <Text style={{color:colors.grey,fontFamily:'fontLight',textAlign:'center'}}>GRADE</Text>
                                <Text style={{color:colors.grey,fontFamily:'fontBold',textAlign:'center'}}>{grade}</Text>
                            </View>
                        </View>
                        <View style={{alignItems:'flex-end',width:'25%'}}>
                            <View>
                                <Text style={{color:colors.grey,fontFamily:'fontLight',textAlign:'center'}}>CLASS</Text>
                                <Text style={{color:colors.grey,fontFamily:'fontBold',textAlign:'center'}}>{klas}</Text>
                            </View>
                        </View>
                    </View>

                </View>
                <View style={{marginTop:20}}>
                    <View style={{flexDirection:'row',borderColor:'#f2eae9',borderBottomWidth:0.8,padding:10,marginBottom:10,backgroundColor:colors.primary,justifyContent:'center',borderRadius:10}}>
                        <View style={{width:30,justifyContent:'center'}}>
                            <AntDesign name="infocirlceo" size={30} color={colors.white}/>
                        </View>
                        <View style={{justifyContent:'center',alignContent:'center',flex:1}}>
                            <Text style={{color:colors.white,fontFamily:'fontBold',paddingLeft:15,fontSize:Platform.OS === 'android' ? 12 : 14}}>SCHOOL DETAILS</Text>
                        </View>

                    </View>
                    <View style={{flexDirection:'row',borderBottomColor:colors.secondary,borderBottomWidth:0.7,padding:10,marginBottom:10}}>
                        <View style={{width:30,justifyContent:'center'}}>
                            <Ionicons name="school-outline" size={30} color="#0e75b4"/>
                        </View>
                        <View style={{justifyContent:'center',alignContent:'center',flex:1}}>
                            <Text style={{color:colors.grey,fontFamily:'fontLight',paddingLeft:15,fontSize:Platform.OS === 'android' ? 10 : 12}}>{schoolInfo?.name}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => nativeLink('call',{phoneNumber:schoolInfo?.contact})} style={{flexDirection:'row',borderBottomColor:colors.secondary,borderBottomWidth:0.7,padding:10,marginBottom:10}}>
                        <View style={{width:30,justifyContent:'center'}}>
                            <AntDesign name="phone" size={30} color="#0e75b4"/>
                        </View>
                        <View style={{justifyContent:'center',alignContent:'center',flex:1}}>
                            <Text style={{color:colors.grey,fontFamily:'fontLight',paddingLeft:15,fontSize:Platform.OS === 'android' ? 10 : 12}}>{schoolInfo?.contact}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() =>nativeLink('map',{lat:schoolInfo?.address?.latitude,lng:schoolInfo?.address?.longitude,label:schoolInfo?.address?.text})}  style={{flexDirection:'row',borderBottomColor:colors.secondary,borderBottomWidth:0.7,padding:10,marginBottom:10}}>
                        <View style={{width:30,justifyContent:'center'}}>
                            <Ionicons name="location-outline" size={30} color="#0e75b4"/>
                        </View>
                        <View style={{justifyContent:'center',alignContent:'center',flex:1}}>
                            <Text style={{color:colors.grey,fontFamily:'fontLight',paddingLeft:15,fontSize:Platform.OS === 'android' ? 10 : 12}}>{schoolInfo?.address?.text}</Text>
                        </View>
                    </TouchableOpacity>
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
                    <TouchableOpacity onPress={() => getActiveUser(parentId)} style={{flexDirection:'row',borderBottomColor:colors.secondary,borderBottomWidth:0.7,padding:10,marginBottom:10}}>
                        <View style={{width:30,justifyContent:'center'}}>
                            <Feather name="user" size={30} color="#0e75b4"/>
                        </View>
                        <View style={{justifyContent:'center',alignContent:'center',flex:1}}>
                            <Text style={{color:colors.grey,fontFamily:'fontLight',paddingLeft:15,fontSize:Platform.OS === 'android' ? 10 : 12}}>{guardianInfo?.fname}</Text>
                        </View>
                        <View>
                            <Image source={{uri:guardianInfo?.avatar}} style={{width:45,height:45,borderRadius:100,borderWidth:3,borderColor:colors.primary}} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => nativeLink('call',{phoneNumber:guardianInfo?.contact})} style={{flexDirection:'row',borderBottomColor:colors.secondary,borderBottomWidth:0.7,padding:10,marginBottom:10}}>
                        <View style={{width:30,justifyContent:'center'}}>
                            <AntDesign name="phone" size={30} color="#0e75b4"/>
                        </View>
                        <View style={{justifyContent:'center',alignContent:'center',flex:1}}>
                            <Text style={{color:colors.grey,fontFamily:'fontLight',paddingLeft:15,fontSize:Platform.OS === 'android' ? 10 : 12}}>{guardianInfo?.phoneNumber}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() =>nativeLink('map',{lat:guardianInfo?.address?.latitude,lng:guardianInfo?.address?.longitude,label:guardianInfo?.address?.text})} style={{flexDirection:'row',borderBottomColor:colors.secondary,borderBottomWidth:0.7,padding:10,marginBottom:10}}>
                        <View style={{width:30,justifyContent:'center'}}>
                            <Ionicons name="location-outline" size={30} color="#0e75b4"/>
                        </View>
                        <View style={{justifyContent:'center',alignContent:'center',flex:1}}>
                            <Text style={{color:colors.grey,fontFamily:'fontLight',paddingLeft:15,fontSize:Platform.OS === 'android' ? 10 : 12}}>{guardianInfo?.address?.text}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {(isMissing && profileOwner) &&
                    <View style={{marginTop:24,alignItems:'center'}}>
                        <Button
                            btnInfo={{styles:{borderRadius:10,borderColor:colors.white,width:'70%',backgroundColor:colors.green}}} 
                            textInfo={{text:'REMOVE FROM MISSING LIST',color:colors.white}} 
                            iconInfo={{type:'MaterialIcons', name:'report',color:colors.orange,size:24}}
                            handleBtnClick={() => {
                                dispatch(setConfirmDialog({isVisible:true,text:`You are about to report that you have found your missing kid, by pressing the confirm button your kid will be removed from the missing list.`,okayBtn:'CONFIRM',cancelBtn:'Cancel',response:async(res:boolean) => { 
                                    if(res){
                                        const response = await updateData("kids",id,{field:'isMissing',value:false});
                                        if(response){
                                            showToast('You have successfully removed your kid from the missing list!')
                                        }
                                    }
                                }}))
                            }}
                        />
                    </View>
                }
                {!isMissing &&
                    <View style={{marginTop:24,alignItems:'center'}}>
                        <Button
                            btnInfo={{styles:{borderRadius:10,borderColor:colors.white,width:'50%',backgroundColor:colors.tomato}}} 
                            textInfo={{text:'REPORT MISSING',color:colors.white}} 
                            iconInfo={{type:'MaterialIcons', name:'report',color:colors.orange,size:24}}
                            handleBtnClick={() => {
                                return new Promise(async (resolve, reject) => {
                                    try {
                                        dispatch(setConfirmDialog({
                                            isVisible: true,
                                            text: `You are about to report the kid as missing, by doing so you will notify nearby users and the police.`,
                                            okayBtn: 'CONFIRM',
                                            cancelBtn: 'Cancel',
                                            response: async (res: boolean) => {
                                                if (res) {
                                                    const response = await updateData("kids", id, { field: 'isMissing', value: true });
                                                    if (response) {
                                                        const users = await getNearByUsers(location.latitude, location.longitude, 300);
                                                        if (users.length > 0) {
                                                            users.forEach(async (user: any) => {
                                                                await sendPushNotification(user?.notificationToken, 'MISSING KID', 'There is a missing kid notification, please help', {});
                                                            });
                                                        }
                                                        showToast('You have successfully reported a missing kid and a notification has been sent nearby');
                                                        resolve(true); // Resolve the promise with a success indicator
                                                    }
                                                }
                                            }
                                        }));
                                    } catch (error) {
                                        console.error('Error handling button click:', error);
                                        reject(error); // Reject the promise
                                    }
                                });
                            }}
                            
                        />
                    </View>
                }
            </LinearGradient>
        </View>
    )
};
//9812270611089
//mickylyricalkartel@gmail.com
export const styles = StyleSheet.create({
    footerStyle: {
        flex: 1,
        backgroundColor: "#fff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        elevation: 10,
        paddingBottom:30,
        marginTop:-70
    },
    ProfileFooterHeader:{
        backgroundColor:'#fff',borderTopLeftRadius: 30, borderTopRightRadius: 30,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        elevation: 1,
        borderBottomWidth:1,
        borderBottomColor:'#63acfa'
    },
});