import { ref } from "vue";
import { defineStore } from "pinia";
import servicesApi from "@/api/services";

export const useServicesStore = defineStore("services", () => {
  const isLoading = ref<boolean>(false);
  const data = ref<any | null>(null);
  const error = ref<null>(null);

  const getServicesStart = () => {
    isLoading.value = true;
    data.value = null;
  };

  const getServicesSuccess = (items: any) => {
    isLoading.value = false;
    data.value = items;
  };
  const getServicesFailure = () => {
    isLoading.value = false;
  };

  const getServices = async (): Promise<any> => {
    try {
      getServicesStart();
      const services = await servicesApi.getServices();
      getServicesSuccess(services);
      return services;
    } catch (errors: any) {
      getServicesFailure();
      throw errors;
    }
  };

  const ServicesStart = () => {
    isLoading.value = true;
  };

  const ServicesSuccess = () => {
    isLoading.value = false;
  };
  const ServicesFailure = () => {
    isLoading.value = false;
  };

  const addServices = async (serviceData: any): Promise<any> => {
    try {
      ServicesStart();
      await servicesApi.addService(serviceData);
      ServicesSuccess();
    } catch (errors: any) {
      getServicesFailure();
      throw errors;
    }
  };

  const updateService = async (id: any, selectedItem: any): Promise<any> => {
    try {
      ServicesStart();
      await servicesApi.updateService(id, selectedItem);
      ServicesSuccess();
    } catch (errors: any) {
      ServicesFailure();
      throw errors;
    }
  };

  return {
    data,
    getServices,
    isLoading,
    error,
    getServicesStart,
    getServicesSuccess,
    getServicesFailure,
    addServices,
    ServicesStart,
    ServicesSuccess,
    ServicesFailure,
    updateService,
  };
});
