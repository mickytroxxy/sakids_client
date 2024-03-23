import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { BASE_URL, updateData, uploadFile, uploadToNode } from '../helpers/api';

import { setConfirmDialog } from '../state/slices/ConfirmDialog';
import { pickImage, showToast, takePicture } from '../helpers/methods';
import moment from 'moment';
import { useRouter } from 'expo-router';
import useProfile from './useProfile';
import { setActiveUser, setCurrentProfile, setMainProfile } from '@/state/slices/accountDetails';
import useLoader from './useLoader';

const useUpdates = () => {
    const dispatch = useDispatch();
    const {updateLoadingState} = useLoader();
    const {activeUser,currentProfile} = useProfile();
    const { schoolId = '0', id = '0' } = currentProfile || {};
    const handleUploadPhotos = (field:string, type:'PARENT' | 'KID') => {
        if(field !== "selfiePhoto"){
            dispatch(setConfirmDialog({isVisible:true,text:`Would You Like To Select From The Gallery Or You Would Like To Snap Using Your Camera?`,severity:false,okayBtn:'GALLERY',cancelBtn:'CAMERA',response:async(res:boolean) => { 
                if(res){
                    const assets: any = await pickImage(field);
                    uploadPhotos(assets,field,type);
                }else{
                    snapAPhoto(field,type)
                }
            }}))
        }else{
            snapAPhoto(field,type)
        }
    }
    const snapAPhoto = async(field:string, type:'PARENT' | 'KID') =>{
        const assets: any = await takePicture(field);
        uploadPhotos(assets,field,type);
    }
    const uploadPhotos = async (assets:any,field:string, type:'PARENT' | 'KID') => {
        updateLoadingState(true,'Uploading your photo, please wait...')
        const fileUrl = assets[0].uri;
        if(type === 'PARENT'){
            let location = `kids/${field}/${currentProfile?.id}`;
            if(type === 'PARENT'){
                location = `parents/${field}/${activeUser?.parentId}`;
            }
            const url = await uploadFile(fileUrl,location)
            const response = await updateData("users",activeUser?.parentId,{field,value:url});
            if(response){
                const updatedData = {...activeUser,[field] : url}
                dispatch(setActiveUser(updatedData))
                dispatch(setMainProfile(updatedData))
                showToast(`Your profile picture has been updated!`);
                updateLoadingState(false,'')
            }
        }else{
            uploadToNode(fileUrl,schoolId,BASE_URL,'image/png',id, async(res) => {
                if(res?.data?.status === 200){
                    const url = `${BASE_URL}/files/${schoolId}/${id}.png`
                    const response = await updateData("kids",id,{field,value:url});
                    if(response){
                        console.log({...currentProfile,avatar : url})
                        dispatch(setCurrentProfile({...currentProfile,avatar : url}));
                        showToast(res?.data?.message);
                        updateLoadingState(false,'')
                    }
                }else{
                    showToast(res?.data?.message);
                }
                
            })
        }

    }
    const handleChange = (field:string,value:string | any) => {
    };
    return {handleUploadPhotos,handleChange};
};

export default useUpdates;
