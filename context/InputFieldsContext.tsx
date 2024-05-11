import React from 'react';

export const InputFieldsContext = React.createContext({
  productName: '',
  setProductName: (name: string) => {},
  description:'',
  setDescription: (name: string) => {},
  quantity: 0,
  setQuantity: (num: number) => {},
  price: 0,
  setPrice: (num: number ) => {},
  catergory: '',
  setCategory: (name: string) => {}
  // Add other input fields here
});
