import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { phoneNoValidation, sendSms, showToast } from '../helpers/methods';
import { createData, getGeoPoint, getUserDetailsByPhone, loginApi, updateUser } from '../helpers/api';
import { setConfirmDialog } from '../state/slices/ConfirmDialog';
import { useRouter } from 'expo-router';
import { LocationType } from '../constants/Types';
import { setMainProfile } from '@/state/slices/accountDetails';
import useProfile from './useProfile';

const isVerified:boolean = false;
const address:LocationType = {text:'No address associated',latitude:0,longitude:0};
const avatar:string = '';

const useAuth = () => {
    const router = useRouter();
    const { countryData,locationWithText } = useSelector((state: RootState) => state.location);
    const [confirmationCode, setConfirmationCode] = useState<number | string>(0);
    const dispatch = useDispatch();
    const [formData,setFormData] = useState({phoneNumber:'', password:'', fname:'',gender:'MALE', address:null});
    const handleChange = (field:string,value:string) => setFormData(v =>({...v, [field] : value}));
    const {mainProfile,setActiveUser,getActiveUser} = useProfile();
    const login = async() =>{
        if(formData.phoneNumber.length > 7){
            if(formData.password.length > 5){
                const phoneNumber = phoneNoValidation(formData.phoneNumber,countryData.dialCode);
                if(phoneNumber){
                    const response = await loginApi(phoneNumber,formData.password);
                    if(response.length > 0){
                        dispatch(setActiveUser({...response[0],profileOwner:true}));
                        dispatch(setMainProfile(response[0]))
                        router.push("/ParentProfile")
                    }else{
                        showToast("Invalid login details")
                    }
                }
            }else{
                showToast("Your password should be at least 6 characters long!")
            }
        }else{
            showToast("Your phone number is not valid!");
        }
    }
    const logOut = () => {
        dispatch(setConfirmDialog({isVisible:true,text:`Hi ${mainProfile?.fname}, You are about to sign out, your phone number and password will be required to sign in again!`,okayBtn:'Cancel',severity:true,cancelBtn:'LOG_OUT',response:(res:boolean) => { 
            if(!res){
                router.push("/(tabs)")
                dispatch(setMainProfile(null));
            }
        }}))
    }
    const register = async() => {
        if(formData.fname !== '' && formData.password.length > 5 && formData.phoneNumber.length > 7 && formData?.address){
            dispatch(setConfirmDialog({isVisible:true,text:`Hi ${formData.fname}, please confirm if you have entered the correct details`,okayBtn:'CONFIRM',cancelBtn:'Cancel',response:(res:boolean) => { 
                const phoneNumber = phoneNoValidation(formData.phoneNumber,countryData.dialCode);
                if(phoneNumber){
                    if(res){
                        const code = Math.floor(Math.random()*89999+10000);
                        const obj = {...formData,date:Date.now(),phoneNumber,code}
                        router.push({ pathname: "/ConfirmScreen", params: obj as any });
                        sendSms(phoneNumber,`Hi ${formData.fname}, your SAKids confirmation code is ${code}`)
                    }
                }else{
                    showToast("Invalid phonenumber")
                }
            }}))
        }else{
            showToast('Please carefully fill in to proceed!')
        }
    }

    const confirmCode = async (obj:any) => {
        if (confirmationCode.toString() === (obj.code || "").toString() || null) {
            const phoneNumber = obj.phoneNumber;
            const parentId:string = obj.fname?.toUpperCase().slice(0, 2) + Math.floor(Math.random() * 89999999 + 10000009).toString();
            const geoHash = getGeoPoint(locationWithText.latitude,locationWithText.longitude);
            const newObj = { ...obj, parentId,avatar,isVerified,address:(locationWithText || address),geoHash };
    
            const response = await getUserDetailsByPhone(phoneNumber || "");
            
            if (response.length === 0) {
                const res = await createData("users", parentId, newObj);
                if(res){
                    dispatch(setMainProfile(newObj));
                    getActiveUser(parentId)
                }
            }else{
                const res = response[0];
                const updatedObj = { ...newObj, parentId: res.parentId };
                dispatch(setMainProfile(updatedObj));
                getActiveUser(parentId)
                await updateUser("users", res.parentId.toString(), updatedObj);
            }
        } else {
          showToast("Invalid confirmation code!");
        }
    };
    const createServiceProviderAccount = async(obj:any,isSelf:boolean) => {
        
    }
    return { countryData,accountInfo:null,logOut,createServiceProviderAccount,handleChange,login,formData,register,confirmCode,setConfirmationCode,confirmationCode};
};

export default useAuth;
