import React from 'react';

export const ImageUriContext = React.createContext({
  imageUri: '',
  setImageUri: (uri: string) => {},
});
