import axios from "@/api/axios";

// Метод для получения списка сервисов
const getServices = () => {
  return axios.get(`/services/`);
};

// Метод для добавления нового сервиса
// Метод для добавления нового сервиса
const addService = async (serviceData: any) => {
  try {
    const response = await axios.post(`/services/`, serviceData);
    // Предполагаем, что ID нового сервиса возвращается в response.data.id
    return response;
  } catch (error) {
    console.error("Ошибка при добавлении сервиса:", error);
    throw error;
  }
};

// Метод для обновления существующего сервиса
const updateService = (id: any, serviceData: any) => {
  return axios.put(`/services/${id}/`, serviceData);
};

// Метод для удаления сервиса
const deleteService = (id: any) => {
  return axios.delete(`/services/${id}/`);
};

export default { getServices, addService, updateService, deleteService };
