
import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import Icon from '../components/ui/Icon';
import { colors } from '../constants/Colors';
import { Stack, router } from 'expo-router';
import { GlobalStyles } from '../styles';
import TextArea from '@/components/ui/TextArea';
import { School } from '@/constants/Types';
import { useDispatch } from 'react-redux';
import { setSelectedSchool } from '@/state/slices/location';
import { useIsFocused } from '@react-navigation/native';
import { getSchools } from '@/helpers/api';
import useLocation from '@/hooks/useLocation';
const KidRegister = () => {
    const [searchValue,setSearchValue] = useState('');
    const dispatch = useDispatch();
    const {location} = useLocation();
    const [schools,setSchools] = useState<School[]>([]);
    const isFocused = useIsFocused();
    const data = schools?.filter(school => JSON.stringify(school)?.toUpperCase().includes(searchValue?.toUpperCase()));

    useEffect(() => {
      if(isFocused){
        (async() => {
          const response = await getSchools(location.latitude,location.longitude,300);
          if(response.length > 0){
            setSchools(response)
          }
        })()
      }
    },[])
    return(
        <View style={GlobalStyles.container}>
            <Stack.Screen options={{ 
                title:'SELECT SCHOOL', 
                headerTitleStyle:{fontFamily:'fontBold',color:colors.white}, 
                headerRight: () => (<TouchableOpacity onPress={() => {
                  router.push('/SchoolRegister');
              }} style={{marginRight:Platform.OS === 'android' ? 5 : 0,marginLeft:-10}}><Icon type="Ionicons" name="add-circle-outline" size={30} color={colors.white} /></TouchableOpacity>)
  
            }} />

            <ScrollView style={{padding:20,gap:20}} showsVerticalScrollIndicator={false}>
                <View>
                    <TextArea attr={{field:'searchSchool',icon:{name:'search',type:'Feather',min:5,color:'#5586cc'},keyboardType:'default',placeholder:'Search for your kid school',color:'#009387',handleChange:(field,value) => {
                      setSearchValue(value)
                    }}} />
                </View>
                <View style={{marginTop:20,gap:10}}>
                    {data?.length > 0 && data?.map((school) => 
                        <TouchableOpacity onPress={() => {
                            dispatch(setSelectedSchool(school));
                            router.back();
                        }} key={school?.schoolId} style={{flexDirection:'row',borderBottomColor:colors.faintGray,borderBottomWidth:1,paddingVertical:5}}>
                            <View style={{justifyContent:'center'}}><Icon type="Ionicons" name="school-outline" color={colors.primary} size={36} /></View>
                            <View style={{marginLeft:12,gap:6,justifyContent:'center'}}>
                                <Text style={{fontFamily:'fontBold'}}>{school?.name}</Text>
                                <Text style={{fontFamily:'fontLight'}}>{school?.address?.text}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </View>
    )
}
export default KidRegister