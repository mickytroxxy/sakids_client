import { Dimensions, View } from "react-native"
import { memo } from "react"
import * as Animatable from 'react-native-animatable';
import useProfile from "@/hooks/useProfile";
const {width} = Dimensions.get("screen");
export const HeaderSection = memo(() =>{
    const {currentProfile} = useProfile(); 
    const avatar = currentProfile?.avatar || '';
    return(
        <View style={{alignItems:'center'}}>
            <Animatable.Image animation="slideInDown" duration={1500} useNativeDriver={true} source={{uri : avatar !== "" ? avatar : 'https://picsum.photos/400/400'}} style={{width: width,minHeight: width}} resizeMode="stretch"></Animatable.Image>
        </View>
    )
})