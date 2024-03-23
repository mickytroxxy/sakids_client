
import React, { useState } from 'react'
import { View, Dimensions } from 'react-native';
import Icon from '../components/ui/Icon';
import { colors } from '../constants/Colors';
import { Stack, useRouter } from 'expo-router';
import { GlobalStyles } from '../styles';
// @ts-ignore
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { HeaderSection } from '@/components/profile/HeaderSection';
import { BodySection } from '@/components/profile/BodySection';
import ForeGround from '@/components/profile/ForeGround';

const KidProfile = () => {
  const {height} = Dimensions.get("screen");
  const parallaxH = parseInt((0.5 * height).toFixed(0));
  return(
    <View style={GlobalStyles.container}>
        <Stack.Screen options={{ 
          title:'Profile', 
          headerTitleStyle:{fontFamily:'fontBold',color:colors.white}, 
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
export default KidProfile