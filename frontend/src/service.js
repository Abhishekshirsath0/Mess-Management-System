import axios from "axios";

const API = "http://localhost:8000/api";

// ================= USER =================

export const mapUser = (user) => ({
  id: user._id,
  name: user.Name,
  mobile: user.Mobile,
  parent_mob: user.Parent_Mob,
  email: user.Email,
  address: user.Address,
  gender: user.Gender,
  role: user.Usertype || "user",
  plan: user.Plan ,
  paymentStatus: user.PaymentStatus || "Pending",
  paid: user.PaidAmount ?? 0,
  pending: user.PendingAmount ?? 3600,
  dietType: user.DietType || "Mixed",
});

export const postUserdata = async (userdata) => {
  try {

    const response = await axios.post(`${API}/user`, {

      Name: userdata.fullname,

      Mobile: userdata.mobile,

      Parent_Mob: userdata.parentMobile,

      Email: userdata.email,

      DietType: userdata.dietType || "Mixed",

      Address: userdata.address,

      Gender: userdata.gender,

      Password: userdata.password,

      Plan: userdata.plan?.toUpperCase() || "STANDARD",

    });

    return response.data;

  } catch (error) {
    throw error.response?.data || error;
  }
}

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API}/user/login`, {
      email: credentials.email,
      password: credentials.password,
    });
    const { token, user } = response.data;
    const mapped = mapUser(user);
    localStorage.setItem("user", JSON.stringify(mapped));
    localStorage.setItem("token", token);
    return { token, user: mapped };
  } catch (error) {
    console.error("LOGIN ERROR:", error.response?.data || error.message);
    throw error;
  }
};

export const getUserdatafromserver = async () => {
  try {
    const response = await axios.get(`${API}/user`);

    return response.data.map(mapUser);

  } catch (error) {
    console.error(
      "GET USER ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

export const updateUser = async (id, updateData) => {
  try {
    const response = await axios.put(`${API}/user/${id}`, updateData);
    return mapUser(response.data);
  } catch (error) {
    console.error("UPDATE USER ERROR:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API}/user/${id}`);
    return response.data;
  } catch (error) {
    console.error("DELETE USER ERROR:", error.response?.data || error.message);
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

export const getUserAttendanceStats = async (userId) => {
  try {
    const response = await axios.get(`${API}/attendance/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("GET USER ATTENDANCE STATS ERROR:", error.response?.data || error.message);
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

export const getTodayMeal = async () => {
  try {
    const response = await axios.get(`${API}/meal/today`);
    return response.data;
  } catch (error) {
    console.error("GET TODAY MEAL ERROR:", error.response?.data || error.message);
    throw error;
  }
};