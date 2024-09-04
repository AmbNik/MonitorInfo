import axios from "@/api/axios";

const getVirtualMachines = () => {
  return axios.get(`/virtualmachines/`);
};

const addVirtualMachines = (virtualMachinesData: any) => {
  return axios.post(`/virtualmachines/`, virtualMachinesData);
};
const updateVirtualMachines = (id: any, virtualMachinesData: any) => {
  return axios.put(`/virtualmachines/${id}/`, virtualMachinesData);
};

const deleteVirtualMachines = (id: any) => {
  return axios.delete(`/virtualmachines/${id}/`);
};

export default {
  getVirtualMachines,
  addVirtualMachines,
  updateVirtualMachines,
  deleteVirtualMachines,
};
