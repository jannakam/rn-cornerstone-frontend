import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";

const setToken = async (token) => {
  try {
    await setItemAsync("token", token);
    console.log("Token stored successfully ");
    console.log("Token :", token);
  } catch (error) {
    console.error("Error storing the token:", error);
  }
};

const getToken = async () => {
  try {
    const token = await getItemAsync("token");
    return token;
  } catch (error) {
    console.error("Error retrieving the token:", error);
  }
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
