import instance from "./index";
import { setToken, setUserData, getToken, getUserData } from "./storage";

const login = async (userInfo) => {
  try {
    console.log("USER INFO: ", userInfo);
    const { data } = await instance.post("/v1/auth/login", userInfo);

    if (!data) {
      throw new Error("No data received from server");
    }

    console.log("Received login response:", data);

    if (!data.token) {
      throw new Error("No token received from server");
    }

    try {
      // Remove "Bearer " prefix before storing
      const cleanToken = data.token.replace("Bearer ", "");
      await setToken(cleanToken);
      console.log("Token storage successful");

      // Then store user data
      const userToStore = {
        id: data.id,
        username: data.username,
        role: data.role,
      };
      await setUserData(userToStore);
      console.log("User data storage successful");

      // Verify storage
      const storedToken = await getToken();
      const storedUser = await getUserData();
      console.log("Storage verification - Token exists:", !!storedToken);
      console.log("Storage verification - User exists:", !!storedUser);
    } catch (storageError) {
      console.error("Storage error:", storageError);
      throw storageError;
    }

    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

const register = async (userInfo) => {
  try {
    const { data } = await instance.post("/v1/auth/signup", userInfo);
    return await login({
      username: userInfo.username,
      password: userInfo.password,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// update function
const updateUser = async (userInfo) => {
  try {
    console.log("Updating user with:", userInfo);
    const { data } = await instance.put("/v1/user/update-profile", userInfo);
    console.log("Update response:", data);
    return data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

const getUserProfile = async () => {
  try {
    const { data } = await instance.get("/v1/user/me");
    return data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};
const addFriend = async (friendId) => {
  try {
    await instance.post(`/v1/user/friends/${friendId}`);
  } catch (error) {
    console.error("Error adding friend:", error);
    throw error;
  }
};

const getAllUsers = async () => {
  try {
    const { data } = await instance.get("/v1/user/getAllUsers");
    return data;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};

const getAllFriends = async () => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const { data } = await instance.get("/v1/user/friends");
    console.log("Friends data received:", data);
    return data;
  } catch (error) {
    console.error(
      "Error fetching friends:",
      error.response?.data || error.message
    );
    throw error;
  }
};

const createDailyChallenge = async (dailyChallenge) => {
  try {
    const { data } = await instance.post("/challenges/daily", dailyChallenge);
    return data;
  } catch (error) {
    console.error("Error creating daily challenge:", error);
    throw error;
  }
};

const createFriendChallenge = async (friendChallenge) => {
  try {
    const { data } = await instance.post("/challenges/friend", friendChallenge);
    return data;
  } catch (error) {
    console.error("Error creating friend challenge:", error);
    throw error;
  }
};

const createEventChallenge = async (eventChallenge) => {
  try {
    const { data } = await instance.post("/events", eventChallenge);
    return data;
  } catch (error) {
    console.error("Error creating event challenge:", error);
    throw error;
  }
};

const getAllDailyChallenges = async () => {
  try {
    const { data } = await instance.get("/challenges/daily");
    return data;
  } catch (error) {
    console.error("Error fetching daily challenges:", error);
    throw error;
  }
};

const getAllFriendChallenges = async () => {
  try {
    const { data } = await instance.get("/challenges/friend");
    return data;
  } catch (error) {
    console.error("Error fetching friend challenges:", error);
    throw error;
  }
};

const getAllEventChallenges = async () => {
  try {
    const { data } = await instance.get("/events");
    return data;
  } catch (error) {
    console.error("Error fetching event challenges:", error);
    throw error;
  }
};

const participateInDailyChallenge = async (dailyChallengeId) => {
  try {
    await instance.post(`/v1/user/participate/daily/${dailyChallengeId}`);
  } catch (error) {
    console.error("Error participating in daily challenge:", error);
    throw error;
  }
};

const participateInFriendChallenge = async (friendChallengeId, friendIds) => {
  try {
    await instance.post(
      `/v1/user/participate/friend/${friendChallengeId}`,
      friendIds
    );
  } catch (error) {
    console.error("Error participating in friend challenge:", error);
    throw error;
  }
};

const participateInEvent = async (eventId) => {
  try {
    await instance.post(`/v1/user/participate/event/${eventId}`);
  } catch (error) {
    console.error("Error participating in event:", error);
    throw error;
  }
};

const updateStepsForDailyChallenge = async (dailyChallengeId, steps) => {
  try {
    await instance.post(`/v1/user/steps/daily/${dailyChallengeId}`, { steps });
  } catch (error) {
    console.error("Error updating steps for daily challenge:", error);
    throw error;
  }
};
const updateStepsForFriendChallenge = async (
  friendChallengeId,
  steps,
  completed = false,
  goalReached = false
) => {
  try {
    // Validate inputs
    if (!friendChallengeId) {
      throw new Error("Challenge ID is required");
    }
    if (typeof steps !== 'number' || steps < 0) {
      throw new Error("Invalid step count");
    }

    // Send request with validated data
    const { data } = await instance.post(`/v1/user/steps/friend/${friendChallengeId}`, {
      steps: Math.round(steps),
      completed,
      goalReached,
    });
    
    return data;
  } catch (error) {
    console.error("Error updating steps for friend challenge:", error);
    // Include more error details in the thrown error
    throw new Error(`Failed to update steps: ${error.response?.data?.message || error.message}`);
  }
};
const updateStepsForEvent = async (eventId, steps, completed = false) => {
  try {
    await instance.post(`/v1/user/steps/event/${eventId}`, {
      steps,
      completed,
    });
  } catch (error) {
    console.error("Error updating steps for event:", error);
    throw error;
  }
};

const getChallengeStatus = async (friendChallengeId) => {
  try {
    const { data } = await instance.get(
      `/v1/user/challenges/friend/${friendChallengeId}/progress`
    );
    return data;
  } catch (error) {
    console.error("Error fetching challenge status:", error);
    throw error;
  }
};

export {
  login,
  register,
  updateUser,
  getUserProfile,
  addFriend,
  getAllFriends,
  participateInDailyChallenge,
  participateInFriendChallenge,
  participateInEvent,
  updateStepsForDailyChallenge,
  updateStepsForFriendChallenge,
  updateStepsForEvent,
  getAllUsers,
  createDailyChallenge,
  createFriendChallenge,
  createEventChallenge,
  getAllDailyChallenges,
  getAllFriendChallenges,
  getAllEventChallenges,
  getChallengeStatus,
};
