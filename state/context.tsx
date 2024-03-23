import React, { useState } from 'react';

export const AppContext = React.createContext<any>(null);

export const AppProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const appState: any = {};
    return (
        <AppContext.Provider value={{appState}}>
            {children}
        </AppContext.Provider>
    );
};
