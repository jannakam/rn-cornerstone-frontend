import instance from "./index";
import { setToken } from "./storage";

const login = async (userInfo) => {
  try {
    console.log(3);
    const { data } = await instance.post("/v1/auth/login", userInfo);
    console.log(4);
    setToken(data.token);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const register = async (userInfo) => {
  //   const formData = new FormData();
  //   for (const key in userInfo) {
  //     formData.append(key, userInfo[key]);
  //   }
  //   console.log(formData);
  try {
    console.log(1);
    const { data } = await instance.post("/v1/auth/signup", userInfo);
    console.log(2);
    return await login(userInfo);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// update function
const updateUser = async (userInfo) => {
  try {
    console.log(5);
    console.log("USER INFO: ", userInfo);
    const { data } = await instance.put("/v1/user/update-profile", userInfo);
    console.log(6);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export { login, register, updateUser };
