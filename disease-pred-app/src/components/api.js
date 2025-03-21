import axios from "axios";

const API_URL = "http://127.0.0.1:5000"; // Adjust if needed

export const predictDisease = async (symptoms) => {
  try {
    const response = await axios.post(`${API_URL}/predict`, { symptoms });
    return response.data;
  } catch (error) {
    console.error("Error predicting disease:", error);
    return null;
  }
};
