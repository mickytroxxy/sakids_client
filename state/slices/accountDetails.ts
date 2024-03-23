import { Kid } from "@/constants/Types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: {mainProfile:any;currentProfile:Kid,activeUser:any} = {
  mainProfile: null,
  currentProfile: null as any,
  activeUser:null
};

const accountSlice = createSlice({
  name: "accountSlice",
  initialState,
  reducers: {
    setMainProfile: (state, action: PayloadAction<any>) => {
      state.mainProfile = action.payload;
    },
    setCurrentProfile: (state, action: PayloadAction<Kid>) => {
      state.currentProfile = action.payload;
    },
    setActiveUser: (state, action: PayloadAction<Kid>) => {
      state.activeUser = action.payload;
    },
  },
});

export const { setMainProfile, setCurrentProfile, setActiveUser } = accountSlice.actions;
export default accountSlice.reducer;
