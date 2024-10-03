import axios from "@/api/axios";

import type { Service } from "@/types/interfaces/services";

const getServices = () => {
  return axios.get(`/services/`);
};

const addService = async (serviceData: Service) => {
  try {
    const response = await axios.post(`/services/`, serviceData);
    return response;
  } catch (error) {
    console.error("Ошибка при добавлении сервиса:", error);
    throw error;
  }
};

const updateService = (id: number, serviceData: Service) => {
  console.log("serviceData", serviceData);
  return axios.put(`/services/${id}/`, serviceData);
};

const deleteService = (id: number) => {
  return axios.delete(`/services/${id}/`);
};

export default { getServices, addService, updateService, deleteService };
