// servicesApi.js
import { useServices } from "@/composables/useServices";
import { useVirtualMachines } from "@/composables/useVirtualMachines";

export function useServicesApi() {
  const {
    data,
    isLoading,
    error,
    getServices,
    addServices,
    updateService: updateServiceUse,
    deleteService: deleteServiceUse,
  } = useServices();

  console.log("data", data.value);

  const { data: virtualMachinesData, getVirtualMachines } =
    useVirtualMachines();

  return {
    data,
    virtualMachinesData,
    isLoading,
    error,
    getServices,
    addServices,
    updateServiceUse,
    deleteServiceUse,
    getVirtualMachines,
  };
}
