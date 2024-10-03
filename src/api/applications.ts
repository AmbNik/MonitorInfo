import axios from "@/api/axios";

const getApplications = () => {
  return axios.get(`/applications/`);
};

const addApplications = (applicationData: any) => {
  try {
    const response = axios.post(`/applications/`, applicationData);
    return response;
  } catch (error) {
    console.error("Ошибка при добавлении приложения:", error);
    throw error;
  }
};

const updateApplications = (id: any, applicationData: any) => {
  return axios.put(`/applications/${id}/`, applicationData);
};

const deleteApplications = (id: any) => {
  return axios.delete(`/applications/${id}/`);
};

export default {
  getApplications,
  addApplications,
  updateApplications,
  deleteApplications,
};
