import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";

const setToken = async (token) => {
  try {
    if (!token) {
      throw new Error("Token is undefined or null");
    }
    // Ensure token is a string and trim any whitespace
    const tokenString = String(token).trim();
    console.log("About to store token:", tokenString);
    await setItemAsync("token", tokenString);
    console.log("Token stored successfully");
  } catch (error) {
    console.error("Error storing the token:", error);
    throw error;
  }
};

const getToken = async () => {
  try {
    const token = await getItemAsync("token");
    return token;
  } catch (error) {
    console.error("Error retrieving the token:", error);
    throw error;
  }
};

const deleteToken = async () => {
  await deleteItemAsync("token");
};

const setUserData = async (user) => {
  try {
    if (!user) {
      throw new Error("User data is undefined or null");
    }

    // Log the user object to see what we're trying to store
    console.log("Attempting to store user data:", user);

    // Ensure we're working with a plain object
    const userObj = { ...user };

    // Convert to string and verify it's valid
    const userString = JSON.stringify(userObj);
    if (!userString) {
      throw new Error("Failed to stringify user data");
    }

    console.log("Stringified user data:", userString);
    await setItemAsync("user", userString);
    console.log("User data stored successfully");
  } catch (error) {
    console.error("Error storing user data:", error);
    throw error;
  }
};

const getUserData = async () => {
  try {
    const userString = await getItemAsync("user");
    if (!userString) {
      return null;
    }

    try {
      return JSON.parse(userString);
    } catch (parseError) {
      console.error("Error parsing user data:", parseError);
      return null;
    }
  } catch (error) {
    console.error("Error retrieving user data:", error);
    throw error;
  }
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
