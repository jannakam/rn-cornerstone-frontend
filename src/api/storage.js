import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";

const setToken = async (token) => {
  await setItemAsync("token", token);
};

const getToken = async () => {
  return await getItemAsync("token");
  return token;
};
const deleteToken = async () => {
  await deleteItemAsync("token");
};
const setUserData = async (user) => {
  await setItemAsync("user", JSON.stringify(user));
};
const getUserData = async () => {
  const user = await getItemAsync("user");
  return user ? JSON.parse(user) : null;
};
const deleteUserData = async () => {
  await deleteItemAsync("user");
};

export {
  setToken,
  getToken,
  deleteToken,
  setUserData,
  getUserData,
  deleteUserData,
};
