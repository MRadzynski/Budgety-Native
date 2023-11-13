import * as SecureStore from 'expo-secure-store';

export const deleteFromSecureStore = async (key: string) => {
  await SecureStore.deleteItemAsync(key);
};

export const getFromSecureStore = async (key: string) => {
  const result = await SecureStore.getItemAsync(key);

  if (!result) return null;

  return result;
};

export const saveToSecureStore = async (key: string, value: string) => {
  await SecureStore.setItemAsync(key, value);
};
