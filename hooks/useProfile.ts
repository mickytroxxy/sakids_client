import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveUser, setCurrentProfile, setMainProfile } from '@/state/slices/accountDetails';
import { RootState } from '@/state/store';
import { useEffect, useState } from 'react';
import { getKidByID, getParentByID, getUsers } from '@/helpers/api';
import { showToast } from '@/helpers/methods';
import Constants from 'expo-constants';
import useLoader from './useLoader';
const useProfile = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { mainProfile, currentProfile, activeUser } = useSelector((state: RootState) => state.accountDetails);
    const {updateLoadingState} = useLoader();
    const getCurrentProfile = async(id:any) => {
        const response = await getKidByID(id);
        if(response.length > 0){
            dispatch(setCurrentProfile(response?.[0]));   
            router.push('/KidProfile');
        }else{
            showToast('No matching profile found!')
        }
        updateLoadingState(false,'');
    }
    const getActiveUser = async(parentId:any) => {
        if(parentId === mainProfile?.parentId){
            dispatch(setActiveUser({...mainProfile,profileOwner:true}));
            router.push('/ParentProfile');
        }else{
            const response = await getParentByID(parentId);
            if(response.length > 0){
                dispatch(setActiveUser({...response?.[0],profileOwner:false}));
                router.push('/ParentProfile');
            }
        }

    }
    const getNearByUsers = async (latitude:number,longitude:number,range:number) => {
        try {
            const response : any = await getUsers(latitude,longitude,Constants.isDevice ? range : 30000);
            if(response.length > 0){
                return response;
            }
        } catch (error) {
            console.error('Error retrieving local users:', error);
            return []
        }
    }
    useEffect(() => {
        //dispatch(setIsFetching({state:false,text:'woo'}));
    },[])
    return {mainProfile, currentProfile, getCurrentProfile, getActiveUser, activeUser, getNearByUsers, setActiveUser };
};

export default useProfile;
