import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, router,} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { useColorScheme } from '@/components/useColorScheme';
import { PersistGate } from 'redux-persist/integration/react';
import { RootState, persistor, store } from '@/state/store';
import { Provider, useDispatch, useSelector } from 'react-redux';
import ConfirmDialog from '@/components/modals/ConfirmDialog';
import { RootSiblingParent } from 'react-native-root-siblings';
import ModalController from '@/components/ui/modal';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/Colors';
import { Platform, TouchableOpacity, View } from 'react-native';
import Icon from '@/components/ui/Icon';
import Loader from '@/components/ui/Loader';
import { setIsFetching } from '@/state/slices/modalState';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    fontLight: require('../assets/fonts/MontserratAlternates-Light.otf'),
    fontBold: require('../assets/fonts/MontserratAlternates-Bold.otf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <PersistGate loading={null} persistor={persistor}>
    <Provider store={store}>
      <RootSiblingParent>
        {loaded && <RootLayoutNav />}
        <ConfirmDialog/>
        <ModalController/>
      </RootSiblingParent>
    </Provider>
    <StatusBar style='dark' />
  </PersistGate>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isFetching } = useSelector((state: RootState) => state.modalState);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setIsFetching({state:false,text:''}));
  },[]) 
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {isFetching.state && <Loader text={isFetching.text}/>}
      <Stack screenOptions={{
        headerStyle: {backgroundColor: colors.primary},
        headerTintColor: "#fff",
        headerTitleStyle: {fontFamily:'fontBold',fontSize:15},
        headerLeft: () => (<TouchableOpacity onPress={() => router.back()} style={{marginRight:Platform.OS === 'android' ? 5 : 0,marginLeft:-10}}><Icon type="Feather" name="arrow-left-circle" size={30} color={colors.white} /></TouchableOpacity>)
      }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="KidProfile" />
        <Stack.Screen name="FaceReco" />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
