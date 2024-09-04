import { ref } from "vue";
import { defineStore } from "pinia";
import virtualMachinesApi from "@/api/virtualmachines";

export const useVirtualMachinesStore = defineStore("virtualmachines", () => {
  const isLoading = ref<boolean>(false);
  const data = ref<any | null>(null);
  const error = ref<null>(null);

  const getVirtualMachinesStart = () => {
    isLoading.value = true;
    data.value = null;
  };

  const getVirtualMachinesSuccess = (items: any) => {
    isLoading.value = false;
    data.value = items;
  };
  const getVirtualMachinesFailure = () => {
    isLoading.value = false;
  };

  const getVirtualMachines = async (): Promise<any> => {
    try {
      getVirtualMachinesStart();
      const services = await virtualMachinesApi.getVirtualMachines();
      getVirtualMachinesSuccess(services);
      return services;
    } catch (errors: any) {
      getVirtualMachinesFailure();
      throw errors;
    }
  };

  const VirtualMachinesStart = () => {
    isLoading.value = true;
  };

  const VirtualMachinesSuccess = () => {
    isLoading.value = false;
  };
  const VirtualMachinesFailure = () => {
    isLoading.value = false;
  };

  const addVirtualMachines = async (VirtualMachinesData: any): Promise<any> => {
    try {
      VirtualMachinesStart();
      await virtualMachinesApi.addVirtualMachines(VirtualMachinesData);
      VirtualMachinesSuccess();
    } catch (errors: any) {
      VirtualMachinesFailure();
      throw errors;
    }
  };

  const updateVirtualMachines = async (
    id: any,
    VirtualMachinesData: any
  ): Promise<any> => {
    try {
      VirtualMachinesStart();
      await virtualMachinesApi.updateVirtualMachines(id, VirtualMachinesData);
      VirtualMachinesSuccess();
    } catch (errors: any) {
      VirtualMachinesFailure();
      throw errors;
    }
  };

  const deleteVirtualMachines = async (id: any): Promise<any> => {
    try {
      VirtualMachinesStart();
      await virtualMachinesApi.deleteVirtualMachines(id);
      VirtualMachinesSuccess();
    } catch (errors: any) {
      VirtualMachinesFailure();
      throw errors;
    }
  };

  return {
    data,
    getVirtualMachines,
    isLoading,
    error,
    getVirtualMachinesStart,
    getVirtualMachinesSuccess,
    getVirtualMachinesFailure,
    addVirtualMachines,
    VirtualMachinesStart,
    VirtualMachinesSuccess,
    VirtualMachinesFailure,
    updateVirtualMachines,
    deleteVirtualMachines,
  };
});
