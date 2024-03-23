import React, { useEffect, useRef, useState } from 'react';
import {StyleSheet,View,Text,Dimensions,ActivityIndicator,SafeAreaView, TouchableOpacity} from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import * as Permissions from 'expo-permissions';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FaceDetector from 'expo-face-detector';
import * as Animatable from 'react-native-animatable';
import { Camera, CameraType } from 'expo-camera';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import Icon from '@/components/ui/Icon';
import { BASE_URL, recognize } from '@/helpers/api';
import useProfile from '@/hooks/useProfile';
import useLoader from '@/hooks/useLoader';

const { height, width } = Dimensions.get('screen');
const { width: windowWidth } = Dimensions.get('window')
const PREVIEW_SIZE = 300;
const PREVIEW_RECT = {
  minX: (windowWidth - PREVIEW_SIZE) / 2,
  minY: 50,
  width: PREVIEW_SIZE,
  height: PREVIEW_SIZE,
};

export default function FaceReco() {
    const {activeUser:{fname,address,parentId},getCurrentProfile} = useProfile(); 
    const [propsFaceDetector, setPropsFaceDetector] = useState<any>({});
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const router = useRouter();
    const obj = useLocalSearchParams();
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [camera, setCamera] = useState<Camera | null>(null);
    const {updateLoadingState} = useLoader();
    const currentIndexRef = useRef<number>(0);
    const [instructions, setInstructions] = useState<{ status: boolean; text: string }>({status: false,text: 'Position face in the circle'});
    const progress = 5  * 20;
    useEffect(() => {
        const checkCamera = async() => {
          const res = await requestPermission();
          setHasCameraPermission(res.granted)
        }
        checkCamera()
    }, []);

  const onFacesDetected = (result: any) => {
    if (result.faces.length !== 1) {
      currentIndexRef.current = 0;
      setInstructions({ status: false, text: 'Position face in the circle' });
      return;
    }

    const face = result.faces[0];
    const faceRect = {
      minX: face.bounds.origin.x,
      minY: face.bounds.origin.y,
      width: face.bounds.size.width,
      height: face.bounds.size.height,
    };
    const edgeOffset = 50;
    const faceRectSmaller = {
      width: faceRect.width - edgeOffset,
      height: faceRect.height - edgeOffset,
      minY: faceRect.minY + edgeOffset / 2,
      minX: faceRect.minX + edgeOffset / 2,
    };
    const previewContainsFace = contains({ outside: PREVIEW_RECT, inside: faceRectSmaller });

    if (!previewContainsFace) {
      setInstructions({ status: false, text: 'Position face in the circle' });
      return;
    }

    const faceMaxSize = PREVIEW_SIZE - 90;

    if (faceRect.width >= faceMaxSize && faceRect.height >= faceMaxSize) {
      setInstructions({ status: false, text: "You're too close. Hold the device further and then" });
      return;
    }

    if (previewContainsFace && !(faceRect.width >= faceMaxSize && faceRect.height >= faceMaxSize)) {
      if (!instructions.status) {
        setInstructions({ status: true, text: 'Keep the device still and wait for 5 seconds:' });
      }
    }
  };
  const takePicture = async () => {
    if (camera) {
      const result = await camera.takePictureAsync(null || undefined);
      await ImageManipulator.manipulateAsync(result.uri, [{ resize: { width: width * 2, height: height * 2 } }], {
        compress: 0.4,
        format: ImageManipulator.SaveFormat.PNG,
        base64: false,
      }).then(async (result) => {
        router.back();
        router.back();
        updateLoadingState(true,'Uploading photo for recognition...')
        recognize(result.uri,BASE_URL,'image/png',parentId,(response)=> {
            updateLoadingState(true,'Match found, now fetching user details...')
            if(response?.data?.status === 200){
                getCurrentProfile(response?.data?.message?.studentId)
            }
        })
      });
    }
  };

  function contains({ outside, inside }: { outside: any; inside: any }): boolean {
    const outsideMaxX = outside.minX + outside.width;
    const insideMaxX = inside.minX + inside.width;

    const outsideMaxY = outside.minY + outside.height;
    const insideMaxY = inside.minY + inside.height;

    if (inside.minX < outside.minX) {
      return false;
    }
    if (insideMaxX > outsideMaxX) {
      return false;
    }
    if (inside.minY < outside.minY) {
      return false;
    }
    if (insideMaxY > outsideMaxY) {
      return false;
    }
    
    return true;
  }
  
  if (hasCameraPermission === null) {
    return (
      <View style={styles.information}>
        <ActivityIndicator size="large" color="#757575" />
      </View>
    );
  } else if (hasCameraPermission === false) {
    return (
      <View style={styles.information}>
        <Text>No access tocamera</Text>
      </View>
    );
  } else {
    return (
      <SafeAreaView style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center',backgroundColor:'white' }]}>
        <Stack.Screen options={{title:'VERIFICATION PHOTO'}} />
        <View style={{ height: 300, width: 300, borderRadius: 200, overflow: 'hidden' }}>
          <Animatable.View>
            <Camera
              type={CameraType.back}
              whiteBalance={8}
              style={{ height: 380, width: 300 }}
              {...propsFaceDetector}
              onCameraReady={() => {
                setPropsFaceDetector({
                  onFacesDetected: onFacesDetected,
                  faceDetectorSettings: {
                    mode: FaceDetector.FaceDetectorMode.fast,
                    minDetectionInterval: 500,
                    detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
                    runClassifications: FaceDetector.FaceDetectorClassifications.all,
                    tracking: false,
                  },
                });
              }}
              ref={(ref) => {
                setCamera(ref);
              }}
            >
              <AnimatedCircularProgress
                size={300}
                width={5}
                backgroundWidth={7}
                fill={progress}
                tintColor="green"
                backgroundColor="#e8e8e8"
              />
            </Camera>
          </Animatable.View>
        </View>
        <View style={{ marginTop: 30 }}>
          <Text style={{ fontFamily: 'fontBold', marginTop: 20, textAlign: 'center' }}>{instructions.text}</Text>
        </View>
        {instructions.status &&
          <View style={{marginTop:30,alignItems:'center'}}>
            <Text style={{ fontFamily: 'fontLight', textAlign: 'center' }}>Take the kid facial photo</Text>
            <TouchableOpacity style={{marginTop:10}} onPress={() => {
              takePicture();
            }}>
              <Icon name='check-circle' type='Feather' color='green' size={120} />
            </TouchableOpacity>
          </View>
        }
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  information: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  cameraPreview: {
    flex: 1,
  },
  cameraActionView: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  mask: {
    borderRadius: PREVIEW_SIZE / 2,
    height: PREVIEW_SIZE,
    width: PREVIEW_SIZE,
    marginTop: PREVIEW_RECT.minY,
    alignSelf: 'center',
    backgroundColor: 'white',
  },
  circularProgress: {
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
    marginTop: PREVIEW_RECT.minY,
    marginLeft: PREVIEW_RECT.minX,
  },
  instructions: {
    fontSize: 20,
    textAlign: 'center',
    top: 25,
    position: 'absolute',
  },
  instructionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: PREVIEW_RECT.minY + PREVIEW_SIZE,
  },
  action: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});