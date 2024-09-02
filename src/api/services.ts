import axios from "@/api/axios";

// Метод для получения списка сервисов
const getServices = () => {
  return axios.get(`/services/`);
};

// Метод для добавления нового сервиса
const addService = (serviceData: any) => {
  return axios.post(`/services/`, serviceData);
};
// Метод для обновления существующего сервиса
const updateService = (id: any, serviceData: any) => {
  return axios.put(`/services/${id}/`, serviceData);
};

export default { getServices, addService, updateService };
