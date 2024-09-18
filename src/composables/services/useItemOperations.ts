// src/composables/useItemOperations.js
import { ref, computed, inject } from "vue";
import { useServicesApi } from "./useServicesApi";
import type { Service } from "@/types/interfaces/services";

export function useItemOperations() {
  const { data, addServices, updateServiceUse, deleteServiceUse, getServices } =
    useServicesApi();

  type ShowSnackbar = (
    message: string,
    color: SnackbarColor,
    success: boolean
  ) => void;
  type SnackbarColor =
    | "blue-darken-3"
    | "green-darken-1"
    | "red-darken-1"
    | "yellow-darken-1";

  const showSnackbar = inject("showSnackbar") as ShowSnackbar;

  onMounted(async () => {
    try {
      await getServices();
    } catch (e) {
      console.error("Ошибка при загрузке сервисов:", e);
    }
  });

  const handleSnackbar = (message: string, color: SnackbarColor) => {
    snackbarMessage.value = message;
    snackbarColor.value = color;
    success.value = true;
    showSnackbar(snackbarMessage.value, snackbarColor.value, success.value);
  };

  const handleSuccess = (message: string) => {
    handleSnackbar(message, "green-darken-1");
  };

  const handleError = (message: string) => {
    handleSnackbar(message, "red-darken-1");
    console.error(message);
  };
  const services = computed(() => data.value || []);

  const dialogLoader = ref<boolean>(false);
  const success = ref<boolean>(false);
  const snackbarMessage = ref<string>("");
  const snackbarColor = ref<SnackbarColor>();

  const dialogEdit = ref<boolean>(false);
  const dialogInfo = ref<boolean>(false);
  const dialogAdd = ref<boolean>(false);
  const dialogDelete = ref<boolean>(false);

  const addItem = async (newItem: Service) => {
    dialogLoader.value = true;
    success.value = false;
    try {
      const response = await addServices(newItem);
      newItem.id = response.id;
      services.value.push(newItem);
      handleSuccess(`Запись ${newItem.name} успешно добавлена`);
      dialogAdd.value = false;
      return response;
    } catch (error) {
      handleError("Ошибка при добавлении сервиса");
    } finally {
      dialogLoader.value = false;
    }
  };

  const editItem = async (selectedItem: Service) => {
    dialogLoader.value = true;
    success.value = false;

    try {
      await updateServiceUse(Number(selectedItem.id), selectedItem);
      const index = services.value.findIndex(
        (service: Service) => service.id === selectedItem.id
      );
      if (index !== -1) {
        services.value[index] = selectedItem;
      }

      handleSuccess(`Запись ${selectedItem.name} успешно изменена`);
      dialogEdit.value = false;
    } catch (error) {
      handleError("Ошибка при редактировании сервиса");
    } finally {
      dialogLoader.value = false;
    }
  };

  const deleteItemConfirmed = async (selectedItem: Service) => {
    dialogLoader.value = true;
    success.value = false;
    try {
      dialogDelete.value = false;
      await deleteServiceUse(Number(selectedItem.id));
      const index = services.value.findIndex(
        (service: Service) => service.id === selectedItem.id
      );
      if (index !== -1) {
        services.value.splice(index, 1);
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
    success,
    snackbarMessage,
    snackbarColor,
    addItem,
    editItem,
    deleteItemConfirmed,
    dialogEdit,
    dialogInfo,
    dialogAdd,
    dialogDelete,
    services,
  };
}
