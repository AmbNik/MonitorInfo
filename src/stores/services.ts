import { ref } from "vue";
import { defineStore } from "pinia";
import servicesApi from "@/api/services";

export const useServicesStore = defineStore("services", () => {
  const data = ref<any | null>(null);

  const getServices = async (): Promise<any> => {
    try {
      const services = await servicesApi.getServices();
      data.value = services;
      console.log("servi");
      return services;
    } catch (errors: any) {
      throw errors;
    }
  };

  return {
    data,
    getServices,
  };
});
