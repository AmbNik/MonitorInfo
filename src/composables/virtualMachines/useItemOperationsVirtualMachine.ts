// src/composables/useItemOperations.js
import { ref, computed, inject } from "vue";
// import { useServicesApi } from "./useServicesApi";
import { useVirtualMachines } from "@/composables/virtualMachines/useVirtualMachines";

export function useItemOperationsVirtualMachine() {
  const {
    data,
    isLoading,
    error,
    getVirtualMachines,
    updateVirtualMachines,
    deleteVirtualMachines,
    addVirtualMachines,
  } = useVirtualMachines();

  type ShowSnackbar = (message: string, color: SnackbarColor) => void;
  type SnackbarColor =
    | "blue-darken-3"
    | "green-darken-1"
    | "red-darken-1"
    | "yellow-darken-1";

  const showSnackbar = inject("showSnackbar") as ShowSnackbar;

  onMounted(async () => {
    try {
      await getVirtualMachines();
    } catch (e) {
      console.error("Ошибка при загрузке виртуальных машин:", e);
    }
  });

  const handleSuccess = (message: string) => {
    snackbarMessage.value = message;
    snackbarColor.value = "green-darken-1";
    showSnackbar(snackbarMessage.value, snackbarColor.value);
    setTimeout(() => (success.value = false), 5000);
  };

  const handleError = (message: string) => {
    snackbarMessage.value = message;
    snackbarColor.value = "red-darken-1";
    showSnackbar(snackbarMessage.value, snackbarColor.value);
  };

  const virtualMachines = computed(() => data.value?.data || []);

  const dialogLoader = ref(false);
  const success = ref(false);
  const snackbarMessage = ref("");
  const snackbarColor = ref<SnackbarColor>();

  const dialogEdit = ref(false);
  const dialogInfo = ref(false);
  const dialogAdd = ref(false);
  const dialogDelete = ref(false);

  const addItem = async (newItem: any) => {
    dialogLoader.value = true;
    success.value = false;
    try {
      const response = await addVirtualMachines(newItem);
      newItem.id = response.id;
      virtualMachines.value.push(newItem);
      handleSuccess(`Запись ${newItem.name} успешно добавлена`);
      dialogAdd.value = false;
      return response;
    } catch (error) {
      handleError("Ошибка при добавлении сервиса");
    } finally {
      dialogLoader.value = false;
    }
  };

  const editItem = async (selectedItem: any) => {
    dialogLoader.value = true;
    success.value = false;

    try {
      await updateVirtualMachines(selectedItem.id, selectedItem);
      const index = virtualMachines.value.findIndex(
        (service: any) => service.id === selectedItem.id
      );
      if (index !== -1) {
        virtualMachines.value[index] = selectedItem;
      }
      handleSuccess(`Запись ${selectedItem.name} успешно изменена`);
      dialogEdit.value = false;
    } catch (error) {
      handleError("Ошибка при редактировании сервиса");
    } finally {
      dialogLoader.value = false;
    }
  };

  const deleteItemConfirmed = async (selectedItem: any) => {
    dialogLoader.value = true;
    success.value = false;
    try {
      dialogDelete.value = false;
      await deleteVirtualMachines(selectedItem.id);
      const index = virtualMachines.value.findIndex(
        (service: any) => service.id === selectedItem.id
      );
      if (index !== -1) {
        virtualMachines.value.splice(index, 1);
      }
      handleSuccess(`Запись ${selectedItem.name} успешно удалена`);
    } catch (error) {
      handleError("Ошибка при удалении сервиса");
    } finally {
      dialogLoader.value = false;
    }
  };

  return {
    dialogLoader,
    isLoading,
    success,
    error,
    snackbarMessage,
    snackbarColor,
    addItem,
    editItem,
    deleteItemConfirmed,
    dialogEdit,
    dialogInfo,
    dialogAdd,
    dialogDelete,
    virtualMachines,
  };
}
