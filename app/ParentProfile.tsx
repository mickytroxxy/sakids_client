
import React, { useState } from 'react'
import { View, Dimensions, TouchableOpacity } from 'react-native';
import Icon from '../components/ui/Icon';
import { colors } from '../constants/Colors';
import { Stack, useRouter } from 'expo-router';
import { GlobalStyles } from '../styles';
// @ts-ignore
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { HeaderSection } from '@/components/parentProfile/HeaderSection';
import { BodySection } from '@/components/parentProfile/BodySection';
import ForeGround from '@/components/parentProfile/ForeGround';
import useAuth from '@/hooks/useAuth';

const ParentProfile = () => {
  const {height} = Dimensions.get("screen");
  const parallaxH = parseInt((0.5 * height).toFixed(0));
  const {logOut} = useAuth();
  return(
    <View style={GlobalStyles.container}>
        <Stack.Screen options={{ 
          title:'Parent Profile', 
          headerTitleStyle:{fontFamily:'fontBold',color:colors.white}, 
          headerRight: () => (<TouchableOpacity onPress={logOut} style={{}}><Icon type="FontAwesome" name="sign-out" size={40} color={colors.tomato} /></TouchableOpacity>)
        }} />
        <ParallaxScrollView
            backgroundColor="#e8e9f5"
            contentBackgroundColor="#e8e9f5"
            backgroundScrollSpeed={5}
            fadeOutForeground ={true}
            //@ts-ignore
            showsVerticalScrollIndicator ={false}
            parallaxHeaderHeight={parallaxH}
            renderBackground={() => <HeaderSection/>}
            renderContentBackground={() => <BodySection />}
            renderForeground={() => <ForeGround/>}
        />
    </View>
  )
}
export default ParentProfile