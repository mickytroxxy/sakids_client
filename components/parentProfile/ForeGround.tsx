import React, { memo, useRef } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, Platform } from 'react-native';
import { showToast } from '../../helpers/methods';
import Icon from '../ui/Icon';
import { colors } from '../../constants/Colors';
import useUpdates from '../../hooks/useUpdates';
import useProfile from '@/hooks/useProfile';

interface ForeGroundProps {}

const ForeGround: React.FC<ForeGroundProps> = memo(() => {
  const {activeUser} = useProfile(); 
  const fname = activeUser?.fname;
  const profileOwner = activeUser?.profileOwner;
  const {handleUploadPhotos} = useUpdates();

  return (
    <View style={{flex: 1,marginTop: Platform.OS === 'android' ? -120 : -50 }}>
      <View style={{flex:3}}></View>
      <View style={{flex:1,padding:5,flexDirection:'row'}}>
        <View style={styles.usernameView}><Text style={{color:'#fff',fontSize:12,fontFamily:'fontBold'}}>{fname}</Text></View>
        <View style={{marginLeft:30}}>
            {profileOwner ? (
                <TouchableOpacity onPress={() => handleUploadPhotos('avatar','PARENT')} style={{backgroundColor:colors.primary,padding:5,borderRadius:100,height:48,width:48,alignItems:'center',justifyContent:'center'}}>
                    <Icon type='AntDesign' name="camerao" size={30} color={colors.white} />
                </TouchableOpacity>
            ):(
                <View>
                    <TouchableOpacity onPress={()=>{
                        
                    }}>
                        <Icon type='Ionicons' name="shield-checkmark" size={44} color="green" />
                    </TouchableOpacity>
                </View>
                
            )}
        </View>
      </View>
    </View>
  );
});

export const styles = StyleSheet.create({
  usernameView:{
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    height: 50, 
    alignContent:"center", 
    alignItems:"center",
    borderTopRightRadius:50,
    borderBottomRightRadius:700,
    justifyContent:'center',
    marginLeft:5,
    borderTopLeftRadius:700,
    flex:1
  },  
});

export default ForeGround;
