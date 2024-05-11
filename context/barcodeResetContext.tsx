import React, { createContext, useContext } from 'react';

interface ResetScannerContextType {
  resetBarcodeScanner: () => void;
}

const defaultValues: ResetScannerContextType = {
  resetBarcodeScanner: () => { /* Default empty function */ },
};

export const ResetScannerContext = createContext<ResetScannerContextType>(defaultValues);
export const useResetScanner = () => useContext(ResetScannerContext); 

