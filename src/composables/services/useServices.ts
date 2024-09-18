import { ref } from "vue";
import servicesApi from "@/api/services";
import type { Service } from "@/types/interfaces/services";
import { AxiosError } from "axios";

export function useServices() {
  const isLoading = ref<boolean>(false);
  const data = ref<Service[] | null>(null);
  const error = ref<AxiosError | null>(null);

  function getServicesStart() {
    isLoading.value = true;
    data.value = null;
  }

  function getServicesSuccess(items: Service[]) {
    isLoading.value = false;
    data.value = items;
  }

  function getServicesFailure(errors: AxiosError) {
    isLoading.value = false;
    error.value = errors;
  }

  async function getServices(): Promise<Service[]> {
    console.log("sdsd");
    try {
      getServicesStart();
      const response = await servicesApi.getServices();
      const services = response.data; // Извлекаем данные из ответа
      getServicesSuccess(services);
      return services;
    } catch (errors: any) {
      getServicesFailure(errors);

      throw errors;
    }
  }

  function ServicesStart() {
    isLoading.value = true;
  }

  function ServicesSuccess() {
    isLoading.value = false;
  }

  function ServicesFailure(errors: AxiosError) {
    isLoading.value = false;
    error.value = errors;
  }

  async function addServices(serviceData: Service): Promise<Service> {
    try {
      ServicesStart();
      const response = await servicesApi.addService(serviceData);
      ServicesSuccess();
      console.log("response.data.id;", response);
      return response.data;
    } catch (errors: any) {
      getServicesFailure(errors);
      throw errors;
    }
  }

  async function updateService(
    id: number,
    selectedItem: Service
  ): Promise<void> {
    try {
      ServicesStart();
      await servicesApi.updateService(id, selectedItem);
      ServicesSuccess();
    } catch (errors: any) {
      ServicesFailure(errors);
      throw errors;
    }
  }

  async function deleteService(id: number): Promise<void> {
    try {
      ServicesStart();
      await servicesApi.deleteService(id);
      ServicesSuccess();
    } catch (errors: any) {
      ServicesFailure(errors);
      throw errors;
    }
  }

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
    deleteService,
  };
}
