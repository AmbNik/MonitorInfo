import { ref } from "vue";
import { defineStore } from "pinia";
import virtualMachinesApi from "@/api/virtualmachines";

export const useVirtualmachinesStore = defineStore("virtualmachines", () => {
  const isLoading = ref<boolean>(false);
  const data = ref<any | null>(null);
  const error = ref<null>(null);

  const getVirtualmachinesStart = () => {
    isLoading.value = true;
    data.value = null;
  };

  const getVirtualmachinesSuccess = (items: any) => {
    isLoading.value = false;
    data.value = items;
  };
  const getVirtualmachinesFailure = () => {
    isLoading.value = false;
  };

  const getVirtualmachines = async (): Promise<any> => {
    try {
      getVirtualmachinesStart();
      const services = await virtualMachinesApi.getVirtualmachines();
      getVirtualmachinesSuccess(services);
      return services;
    } catch (errors: any) {
      getVirtualmachinesFailure();
      throw errors;
    }
  };

  const VirtualmachinesStart = () => {
    isLoading.value = true;
  };

  const VirtualmachinesSuccess = () => {
    isLoading.value = false;
  };
  const VirtualmachinesFailure = () => {
    isLoading.value = false;
  };

  const addVirtualmachines = async (VirtualmachinesData: any): Promise<any> => {
    try {
      VirtualmachinesStart();
      await virtualMachinesApi.addVirtualmachines(VirtualmachinesData);
      VirtualmachinesSuccess();
    } catch (errors: any) {
      VirtualmachinesFailure();
      throw errors;
    }
  };

  const updateVirtualmachines = async (
    id: any,
    VirtualmachinesData: any
  ): Promise<any> => {
    try {
      VirtualmachinesStart();
      await virtualMachinesApi.updateVirtualmachines(id, VirtualmachinesData);
      VirtualmachinesSuccess();
    } catch (errors: any) {
      VirtualmachinesFailure();
      throw errors;
    }
  };

  const deleteVirtualmachines = async (id: any): Promise<any> => {
    try {
      VirtualmachinesStart();
      await virtualMachinesApi.deleteVirtualmachines(id);
      VirtualmachinesSuccess();
    } catch (errors: any) {
      VirtualmachinesFailure();
      throw errors;
    }
  };

  return {
    data,
    getVirtualmachines,
    isLoading,
    error,
    getVirtualmachinesStart,
    getVirtualmachinesSuccess,
    getVirtualmachinesFailure,
    addVirtualmachines,
    VirtualmachinesStart,
    VirtualmachinesSuccess,
    VirtualmachinesFailure,
    updateVirtualmachines,
    deleteVirtualmachines,
  };
});
