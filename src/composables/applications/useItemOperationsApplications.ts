import { ref, computed, inject } from "vue";
import { useApplicationsApi } from "./useApplicationsApi";

export function useItemOperationsApplications() {
  const {
    data,
    addApplications,
    updateApplicationsUse,
    deleteApplicationsUse,
    getApplications,
  } = useApplicationsApi();

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
      await getApplications();
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

  const applications = computed(() => data.value?.data || []);

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
      const response = await addApplications(newItem);
      newItem.id = response.id;
      applications.value.push(newItem);
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
      await updateApplicationsUse(selectedItem.id, selectedItem);
      const index = applications.value.findIndex(
        (service: any) => service.id === selectedItem.id
      );
      if (index !== -1) {
        applications.value[index] = selectedItem;
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
      await deleteApplicationsUse(selectedItem.id);
      const index = applications.value.findIndex(
        (service: any) => service.id === selectedItem.id
      );
      if (index !== -1) {
        applications.value.splice(index, 1);
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
    applications,
  };
}
