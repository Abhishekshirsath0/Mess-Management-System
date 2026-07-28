import axios from "axios";

const API = "http://localhost:8000/api";

// ================= USER =================

const mapUser = (user) => ({
  id: user._id,
  name: user.Name,
  mobile: user.Mobile,
  parent_mob: user.Parent_Mob,
  email: user.Email,
  address: user.Address,
  gender: user.Gender,
});

export const postUserdata = async (userdata) => {
  try {
    const response = await axios.post(`${API}/user`, {
      Name: userdata.fullname,
      Mobile: userdata.mobile,
      Parent_Mob: userdata.parentMobile,
      Email: userdata.email,
      Address: userdata.address,
      Gender: userdata.gender,
      Password: userdata.password,
    });

    return mapUser(response.data);
  } catch (error) {
    console.error("POST USER ERROR:", error.response?.data || error.message);
    throw error;
  }
};

export const getUserdatafromserver = async () => {
  try {
    const response = await axios.get(`${API}/user`);
    return response.data.map(mapUser);
  } catch (error) {
    console.error("GET USER ERROR:", error.response?.data || error.message);
    throw error;
  }
};

// ==================== ATTENDANCE =======================

export const postAttendance = async (data) => {
  try {
    const response = await axios.post(`${API}/attendance`, data);
    return response.data;
  } catch (error) {
    console.error(
      "POST ATTENDANCE ERROR:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getAttendanceByDate = async (date) => {
  try {
    const response = await axios.get(`${API}/attendance`, { params: { date } });
    return response.data.data;
  } catch (error) {
    console.error("GET ATTENDANCE ERROR:", error.response?.data || error.message);
    throw error;
  }
};

export const updateAttendance = async (records) => {
  try {
    const response = await axios.put(`${API}/attendance`, { records });
    return response.data;
  } catch (error) {
    console.error(
      "UPDATE ATTENDANCE ERROR:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ==================== MEAL =======================

export const postMeal = async (meal, mealType) => {
  try {
    const response = await axios.post(`${API}/meal`, {
      date: meal.date,
      mealType,
      veg: meal.veg,
      nonVeg: meal.nonVeg,
    });
    return response.data;
  } catch (error) {
    console.error("POST MEAL ERROR:", error.response?.data || error.message);
    throw error;
  }
};

export const getMeals = async (date) => {
  try {
    const response = await axios.get(`${API}/meal`, {
      params: date ? { date } : {},
    });
    return response.data;
  } catch (error) {
    console.error("GET MEAL ERROR:", error.response?.data || error.message);
    throw error;
  }
};