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
  plan: user.Plan,
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
};

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

export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API}/auth/forgot-password`, { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const resetPassword = async (token, password, confirmPassword) => {
  try {
    const response = await axios.post(`${API}/auth/reset-password/${token}`, {
      password,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getUserdatafromserver = async () => {
  try {
    const response = await axios.get(`${API}/user`, {
      headers: getAuthHeaders(),
    });

    return response.data.map(mapUser);
  } catch (error) {
    console.error("GET USER ERROR:", error.response?.data || error.message);

    throw error;
  }
};

export const updateUser = async (id, updateData) => {
  try {
    const response = await axios.put(`${API}/user/${id}`, updateData, {
      headers: getAuthHeaders(),
    });
    return mapUser(response.data);
  } catch (error) {
    console.error("UPDATE USER ERROR:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API}/user/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("DELETE USER ERROR:", error.response?.data || error.message);
    throw error;
  }
};

// ==================== ATTENDANCE =======================

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const postAttendance = async (data) => {
  try {
    const response = await axios.post(`${API}/attendance`, data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(
      "POST ATTENDANCE ERROR:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getAttendanceByDate = async (date) => {
  try {
    const response = await axios.get(`${API}/attendance`, {
      headers: getAuthHeaders(),
      params: { date },
    });
    return response.data.data;
  } catch (error) {
    console.error(
      "GET ATTENDANCE ERROR:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const updateAttendance = async (records) => {
  try {
    const response = await axios.put(
      `${API}/attendance`,
      { records },
      {
        headers: getAuthHeaders(),
      },
    );
    return response.data;
  } catch (error) {
    console.error(
      "UPDATE ATTENDANCE ERROR:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getUserAttendanceStats = async (userId) => {
  try {
    const response = await axios.get(`${API}/attendance/user/${userId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(
      "GET USER ATTENDANCE STATS ERROR:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getUserAttendanceHistory = async (userId, params = {}) => {
  try {
    const response = await axios.get(`${API}/attendance/history/${userId}`, {
      headers: getAuthHeaders(),
      params,
    });
    return response.data;
  } catch (error) {
    console.error(
      "GET USER ATTENDANCE HISTORY ERROR:",
      error.response?.data || error.message,
    );
    throw error.response?.data || error;
  }
};

export const getAllAttendanceHistory = async (params = {}) => {
  try {
    const response = await axios.get(`${API}/attendance/history`, {
      headers: getAuthHeaders(),
      params,
    });
    return response.data;
  } catch (error) {
    console.error(
      "GET ALL ATTENDANCE HISTORY ERROR:",
      error.response?.data || error.message,
    );
    throw error.response?.data || error;
  }
};

// ==================== MEAL =======================

export const postMeal = async (meal, mealType) => {
  try {
    const response = await axios.post(
      `${API}/meal`,
      {
        date: meal.date,
        mealType,
        veg: meal.veg,
        nonVeg: meal.nonVeg,
      },
      {
        headers: getAuthHeaders(),
      },
    );
    return response.data;
  } catch (error) {
    console.error("POST MEAL ERROR:", error.response?.data || error.message);
    throw error;
  }
};

export const getMeals = async (date) => {
  try {
    const response = await axios.get(`${API}/meal`, {
      headers: getAuthHeaders(),
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
    const response = await axios.get(`${API}/meal/today`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(
      "GET TODAY MEAL ERROR:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// ==================== ABSENCE DATE RANGE =======================

export const postAbsence = async (absenceData) => {
  try {
    const response = await axios.post(`${API}/absence`, absenceData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(
      "POST ABSENCE ERROR:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

export const getAbsences = async (params = {}) => {
  try {
    const response = await axios.get(`${API}/absence`, {
      headers: getAuthHeaders(),
      params,
    });
    return response.data;
  } catch (error) {
    console.error("GET ABSENCES ERROR:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const getUserAbsences = async (userId) => {
  try {
    const response = await axios.get(`${API}/absence/user/${userId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(
      "GET USER ABSENCES ERROR:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

export const updateAbsence = async (id, absenceData) => {
  try {
    const response = await axios.put(`${API}/absence/${id}`, absenceData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(
      "UPDATE ABSENCE ERROR:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

export const deleteAbsence = async (id) => {
  try {
    const response = await axios.delete(`${API}/absence/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(
      "DELETE ABSENCE ERROR:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

// ==================== LOGOUT =======================

export const logoutUser = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  window.location.href = "/Login";
};
