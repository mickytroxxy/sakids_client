import {TouchableOpacity, View, Text, StyleSheet, Clipboard, Platform, ScrollView, Image} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router, useRouter } from "expo-router";
import Icon from "../ui/Icon";
import { useDispatch } from "react-redux";
import { AntDesign, Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/Colors";
import useProfile from "@/hooks/useProfile";
import { useEffect, useState } from "react";
import { Kid } from "@/constants/Types";
import { getUserKids } from "@/helpers/api";
import { nativeLink } from "@/helpers/methods";
export type TokenTypes = {
    accountId:string;
    currentAmount: number;
    purchaseValue:number;
    token: string;
    timeStamp:number;
}
export const BodySection = () =>{
    const {activeUser,getCurrentProfile} = useProfile(); 
    const fname = activeUser?.fname;
    const profileOwner = activeUser?.profileOwner;
    const address = activeUser?.address;
    const parentId = activeUser?.parentId;
    const phoneNumber = activeUser?.phoneNumber;
    const [kids,setKids] = useState<Kid[]>([]);

    const getKids = async () => {
        const response = await getUserKids(parentId);
        if(response?.length > 0){
            setKids(response);
        }
    }
    useEffect(() => {
        if(profileOwner){
            getKids();
        }
    },[])
    return(
        <View style={{marginTop:5,borderRadius:10}}>
            <LinearGradient colors={["#fff","#e8e9f5","#fff","#e8e9f5","#e8e9f5","#e8e9f5",colors.primary]} style={styles.footerStyle}>
                <View style={styles.ProfileFooterHeader}>
                    <View style={{alignContent:'center',alignItems:'center',marginTop:-10}}>
                        <FontAwesome name="ellipsis-h" color="#63acfa" size={36}></FontAwesome>
                    </View>

                    <View style={{flexDirection:'row',padding:12}}>
                        <View style={{alignItems:'flex-start',width:'25%'}}>
                            <View>
                                <Text style={{color:colors.grey,fontFamily:'fontLight',textAlign:'center'}}>KIDS</Text>
                                <Text style={{color:colors.grey,fontFamily:'fontBold',textAlign:'center'}}>{kids?.length}</Text>
                            </View>
                        </View>
                        <View style={{alignItems:'center',flex:1,borderRightWidth:1,borderRightColor:colors.secondary,borderLeftWidth:1,borderLeftColor:colors.secondary}}>
                            <View>
                                <Text style={{color:colors.grey,fontFamily:'fontLight',textAlign:'center'}}>PARENT ID</Text>
                                <Text style={{color:colors.grey,fontFamily:'fontBold',textAlign:'center'}}>{parentId}</Text>
                            </View>
                        </View>
                        <View style={{alignItems:'flex-end',width:'25%'}}>
                            <TouchableOpacity style={{alignItems:'center'}} onPress={() => {
                                if(profileOwner){
                                    router.push('/KidRegister')
                                }
                            }}>
                                <Text style={{color:colors.grey,fontFamily:'fontLight',textAlign:'center'}}>ADD KID</Text>
                                <Icon type="Ionicons" name="add-circle-outline" size={24} color="green" />
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>

                <ScrollView style={{marginTop:20}} horizontal showsHorizontalScrollIndicator={false}>
                    {kids?.length > 0 && kids?.map((item, i) => {
                        return(
                            <View key={i}>
                                <TouchableOpacity onPress={() => getCurrentProfile(item.id)} style={{width:160,height:160,backgroundColor:colors.primary,margin:6,borderRadius:20,padding:3,alignItems:'center',justifyContent:'center'}}>
                                    <Image source={{uri:item?.avatar}} style={{width:157,height:157,borderRadius:20}} />
                                </TouchableOpacity>
                                <View style={{paddingHorizontal:12}}><Text style={{fontFamily:'fontBold',color:colors.grey}}>{item?.fname}</Text></View>
                            </View>
                        )
                    })}
                </ScrollView>

                <View style={{marginTop:20}}>
                    <View style={{flexDirection:'row',borderColor:'#f2eae9',borderBottomWidth:0.8,padding:10,marginBottom:10,backgroundColor:colors.primary,justifyContent:'center',borderRadius:10}}>
                        <View style={{width:30,justifyContent:'center'}}>
                            <AntDesign name="infocirlceo" size={30} color={colors.white}/>
                        </View>
                        <View style={{justifyContent:'center',alignContent:'center',flex:1}}>
                            <Text style={{color:colors.white,fontFamily:'fontBold',paddingLeft:15,fontSize:Platform.OS === 'android' ? 12 : 14}}>GURDIAN DETAILS</Text>
                        </View>
                    </View>
                    <View style={{flexDirection:'row',borderBottomColor:colors.secondary,borderBottomWidth:0.7,padding:10,marginBottom:10}}>
                        <View style={{width:30,justifyContent:'center'}}>
                            <Feather name="user" size={30} color="#0e75b4"/>
                        </View>
                        <View style={{justifyContent:'center',alignContent:'center',flex:1}}>
                            <Text style={{color:colors.grey,fontFamily:'fontLight',paddingLeft:15,fontSize:Platform.OS === 'android' ? 10 : 12}}>{fname}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() =>nativeLink('call',{phoneNumber})} style={{flexDirection:'row',borderBottomColor:colors.secondary,borderBottomWidth:0.7,padding:10,marginBottom:10}}>
                        <View style={{width:30,justifyContent:'center'}}>
                            <AntDesign name="phone" size={30} color="#0e75b4"/>
                        </View>
                        <View style={{justifyContent:'center',alignContent:'center',flex:1}}>
                            <Text style={{color:colors.grey,fontFamily:'fontLight',paddingLeft:15,fontSize:Platform.OS === 'android' ? 10 : 12}}>{phoneNumber}</Text>
                        </View>
                    </TouchableOpacity >
                    <TouchableOpacity onPress={() =>nativeLink('map',{lat:address?.latitude,lng:address?.longitude,label:address?.text})} style={{flexDirection:'row',borderBottomColor:colors.secondary,borderBottomWidth:0.7,padding:10,marginBottom:10}}>
                        <View style={{width:30,justifyContent:'center'}}>
                            <Ionicons name="location-outline" size={30} color="#0e75b4"/>
                        </View>
                        <View style={{justifyContent:'center',alignContent:'center',flex:1}}>
                            <Text style={{color:colors.grey,fontFamily:'fontLight',paddingLeft:15,fontSize:Platform.OS === 'android' ? 10 : 12}}>{address?.text}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                
            </LinearGradient>
        </View>
    )
};
//9812270611089
//mickylyricalkartel@gmail.com
export const styles = StyleSheet.create({
    footerStyle: {
        flex:1,
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