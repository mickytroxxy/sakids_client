import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, query, where, updateDoc, GeoPoint, orderBy, limit, deleteDoc, onSnapshot } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { initializeFirestore } from 'firebase/firestore'
import { geohashForLocation, geohashQueryBounds,Geohash} from 'geofire-common';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { UserProfile } from "../constants/Types";
// @ts-ignore
import geohash from "ngeohash";
import axios from "axios";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}
//export const BASE_URL = 'http://192.168.71.186:7625'
export const BASE_URL = 'http://empiredigitalsapi.net:7625'
const firebaseConfig = {
  apiKey: "AIzaSyAGFeA3lGSbetYpwF1NkCajCx279wjymAQ",
  authDomain: "sakids-52169.firebaseapp.com",
  projectId: "sakids-52169",
  storageBucket: "sakids-52169.appspot.com",
  messagingSenderId: "743868067655",
  appId: "1:743868067655:web:2caf46c7422fcdfd86e662"
};

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, { experimentalForceLongPolling: true })

export const getGeoPoint = (latitude: number, longitude: number) => geohashForLocation([latitude, longitude]);
export const createData = async (tableName: string, docId: string, data: any): Promise<boolean> => {
  try {
    await setDoc(doc(db, tableName, docId), data);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const loginApi = async (phoneNumber: string, password: string): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(query(collection(db, "users"), where("phoneNumber", "==", phoneNumber), where("password", "==", password)));
    const data = querySnapshot.docs.map((doc) => doc.data());
    console.log(data)
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};
export const getKidByID = async (id: string): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(query(collection(db, "kids"), where("id", "==", id)));
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};
export const getParentByID = async (parentId: string): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(query(collection(db, "users"), where("parentId", "==", parentId)));
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};
export const getUserKids = async (parentId: string): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(query(collection(db, "kids"), where("parentId", "==", parentId)));
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};
export const getSchoolByID = async (schoolId: string): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(query(collection(db, "schools"), where("schoolId", "==", schoolId)));
    const data = querySnapshot.docs.map((doc) => doc.data());

    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};
export const getSchools = async (latitude: number, longitude: number, radius: number): Promise<any[]> => {
  try {
    const range = getGeohashRange(latitude, longitude, radius);
    const querySnapshot = await getDocs(query(collection(db, "schools"),
      where('geoHash', '>=', range.lower),
      where('geoHash', '<=', range.upper)
    ));
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data
  } catch (e) {
    console.error(e);
    return [];
  }
};
export const getUsers = async (latitude: number, longitude: number, radius: number): Promise<any[]> => {
  try {
    const range = getGeohashRange(latitude, longitude, radius);
    const querySnapshot = await getDocs(
      query(
        collection(db, 'users'),
        limit(1000),
        where('geoHash', '>=', range.lower),
        where('geoHash', '<=', range.upper)
      )
    );

    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};
export const getUserDetailsByPhone = async (phoneNumber: string): Promise<any[]> => {
    try {
      const querySnapshot = await getDocs(query(collection(db, "users"), where("phoneNumber", "==", phoneNumber)));
      const data = querySnapshot.docs.map((doc) => doc.data());
      return data;
    } catch (e) {
      console.error(e);
      return [];
    }
};
export const getMissingKids = (cb:any) => {
  const q = query(collection(db, "kids"), where("isMissing", "==", true));
  onSnapshot(q, (snapshot) => {
    const messagesFirestore = snapshot.docChanges().map(({ doc }) => {
      const message = doc.data();
      return message;
    });
    cb(messagesFirestore) 
  });
}

export const updateData = async (tableName: string, docId: string, obj: { field: string; value: any }): Promise<boolean> => {
  try {
    const docRef = doc(db, tableName, docId);
    await updateDoc(docRef, { [obj.field]: obj.value });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};
export const deleteData = async (tableName: string, docId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, tableName, docId));
    return true;
  } catch (e) {
    return false;
  }
};

export const updateUser = async (tableName: string, docId: string, obj:any): Promise<boolean> => {
    try {
      const docRef = doc(db, tableName, docId);
      await updateDoc(docRef, obj);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

export const uploadFile = async (file: string, path: string): Promise<string> => {
  const storage = getStorage(app);
  const fileRef = ref(storage, path);
  const response = await fetch(file);
  const blob = await response.blob();
  const uploadTask = await uploadBytesResumable(fileRef, blob);
  const url = await getDownloadURL(uploadTask.ref);
  return url;
};

const getGeohashRange = (latitude:number,longitude:number,distance:number) => {
  const lat = 0.0144927536231884;
  const lon = 0.0181818181818182;
  const lowerLat = latitude - lat * distance;
  const lowerLon = longitude - lon * distance;
  const upperLat = latitude + lat * distance;
  const upperLon = longitude + lon * distance;
  const lower = geohash.encode(lowerLat, lowerLon);
  const upper = geohash.encode(upperLat, upperLon);
  return {
    lower,
    upper
  };
};
export const uploadToNode = async (
  uri: string,
  schoolId: string,
  BASE_URL: string,
  type: string,
  studentId: string,
  cb: (response: any) => void
): Promise<void> => {
  const apiUrl: string = `${BASE_URL}/uploadavatar`;
  const name: string = uri.substr(uri.lastIndexOf('/') + 1);
  const formData: FormData = new FormData();
  //@ts-ignore
  formData.append('fileUrl', {uri,name,type});
  formData.append('schoolId', schoolId);
  formData.append('studentId', studentId);
  try {
    const response = await axios({
      method: 'post',
      url: apiUrl,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    cb(response);
  } catch (error) {
    console.log(error);
  }
};
export const recognize = async (
  uri: string,
  BASE_URL: string,
  type: string,
  parentId: string,
  cb: (response: any) => void
): Promise<void> => {
  const apiUrl: string = `${BASE_URL}/recognize`;
  const name: string = uri.substr(uri.lastIndexOf('/') + 1);
  const formData: FormData = new FormData();
  //@ts-ignore
  formData.append('fileUrl', {uri,name,type});
  formData.append('parentId', parentId);
  try {
    const response = await axios({
      method: 'post',
      url: apiUrl,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    cb(response);
  } catch (error) {
    console.log(error);
  }
};