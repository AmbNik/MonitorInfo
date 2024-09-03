import axios from "@/api/axios";

const getVirtualmachines = () => {
  return axios.get(`/virtualmachines/`);
};

const addVirtualmachines = (virtualMachinesData: any) => {
  return axios.post(`/virtualmachines/`, virtualMachinesData);
};
const updateVirtualmachines = (id: any, virtualMachinesData: any) => {
  return axios.put(`/virtualmachines/${id}/`, virtualMachinesData);
};

const deleteVirtualmachines = (id: any) => {
  return axios.delete(`/virtualmachines/${id}/`);
};

export default {
  getVirtualmachines,
  addVirtualmachines,
  updateVirtualmachines,
  deleteVirtualmachines,
};
