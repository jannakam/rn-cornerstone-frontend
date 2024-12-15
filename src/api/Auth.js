import instance from "./index";

const login = async (data) => {
  return await instance.post("/v1/auth/login", data);
};

const register = async (data) => {
  console.log(data);
  return await instance.post("/v1/auth/signup", data);
};

export { login, register };
