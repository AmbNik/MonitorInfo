import { ref } from "vue";
import virtualMachinesApi from "@/api/virtualmachines";

export function useVirtualMachines() {
  const isLoading = ref<boolean>(false);
  const data = ref<any | null>(null);
  const error = ref<null>(null);

  function getVirtualMachinesStart() {
    isLoading.value = true;
    data.value = null;
  }

  function getVirtualMachinesSuccess(items: any) {
    isLoading.value = false;
    data.value = items;
  }
  function getVirtualMachinesFailure(errors: any) {
    isLoading.value = false;
    error.value = errors;
  }

  async function getVirtualMachines(): Promise<any> {
    try {
      getVirtualMachinesStart();
      const services = await virtualMachinesApi.getVirtualMachines();
      getVirtualMachinesSuccess(services);
      return services;
    } catch (errors: any) {
      getVirtualMachinesFailure(errors);
      throw errors;
    }
  }

  function VirtualMachinesStart() {
    isLoading.value = true;
  }

  function VirtualMachinesSuccess() {
    isLoading.value = false;
  }
  function VirtualMachinesFailure(errors: any) {
    isLoading.value = false;
    error.value = errors;
  }

  async function addVirtualMachines(VirtualMachinesData: any): Promise<any> {
    try {
      VirtualMachinesStart();
      const response = await virtualMachinesApi.addVirtualMachines(
        VirtualMachinesData
      );
      VirtualMachinesSuccess();
      return response.data;
    } catch (errors: any) {
      VirtualMachinesFailure(errors);
      throw errors;
    }
  }

  async function updateVirtualMachines(
    id: any,
    VirtualMachinesData: any
  ): Promise<any> {
    try {
      VirtualMachinesStart();
      await virtualMachinesApi.updateVirtualMachines(id, VirtualMachinesData);
      VirtualMachinesSuccess();
    } catch (errors: any) {
      VirtualMachinesFailure(errors);
      throw errors;
    }
  }

  async function deleteVirtualMachines(id: any): Promise<any> {
    try {
      VirtualMachinesStart();
      await virtualMachinesApi.deleteVirtualMachines(id);
      VirtualMachinesSuccess();
    } catch (errors: any) {
      VirtualMachinesFailure(errors);
      throw errors;
    }
  }

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
}
