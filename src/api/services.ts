import axios from "@/api/axios";

const getServices = () => {
  return axios.get(`/services/`);
};

export default { getServices };
