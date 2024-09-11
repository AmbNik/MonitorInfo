// src/composables/useItemOperations.js
import { ref, nextTick } from "vue";
import { useServicesApi } from "./useServicesApi";

export function useItemOperations() {
  const { data, addServices, updateServiceUse, deleteServiceUse, getServices } =
    useServicesApi();

  getServices();

  const services = computed(() => data.value?.data || []);

  const dialogLoader = ref(false);
  const success = ref(false);
  const snackbarMessage = ref("");
  const snackbarColor = ref("");

  const dialogEdit = ref(false);
  const dialogInfo = ref(false);
  const dialogAdd = ref(false);
  const dialogDelete = ref(false);

  let scrollPosition = 0;

  const addService = async (newService: any) => {
    try {
      const response = await addServices(newService);
      newService.id = response.id;
      services.value.push(newService);
      //   console.log("copyNewService", copyNewService);
      return newService;
    } catch (e) {
      console.error("Ошибка при добавлении сервиса:", e);
      throw e;
    }
  };

  const updateService = async (selectedItem: any) => {
    console.log("33selectedItem", selectedItem);
    try {
      await updateServiceUse(selectedItem.id, selectedItem);
      const index = services.value.findIndex(
        (service: any) => service.id === selectedItem.id
      );
      if (index !== -1) {
        services.value[index] = selectedItem;
      }
    } catch (e) {
      console.error("Ошибка при редактирования сервиса:", e);
      throw e;
    }
  };

  const deleteService = async (id: any) => {
    try {
      await deleteServiceUse(id);
      const index = services.value.findIndex(
        (service: any) => service.id === id
      );
      if (index !== -1) {
        services.value.splice(index, 1);
      }
    } catch (e) {
      console.error("Ошибка при удалении сервиса:", e);
      throw e;
    }
  };

  const addItem = async (newItem: any) => {
    dialogLoader.value = true;
    success.value = false;
    try {
      console.log("newItem", newItem);
      const response = await addService(newItem);
      snackbarMessage.value = `Запись ${newItem.name} успешно добавлена`;
      snackbarColor.value = "green-darken-1";
      await nextTick();
      window.scrollTo(0, scrollPosition);
      setTimeout(() => {
        success.value = false;
      }, 5000);
      success.value = true;
      dialogAdd.value = false;
      return response;
    } catch (error) {
      snackbarMessage.value = "Ошибка при добавлении записи";
      snackbarColor.value = "red-darken-1";
      console.error("Ошибка при добавлении записи:", error);
    } finally {
      dialogLoader.value = false;
    }
  };

  const editItem = async (selectedItem: any) => {
    dialogLoader.value = true;
    success.value = false;

    try {
      await updateService(selectedItem);
      snackbarMessage.value = `Запись ${selectedItem.name} успешно изменена`;
      snackbarColor.value = "green-darken-1";
      await nextTick();
      window.scrollTo(0, scrollPosition);
      setTimeout(() => {
        success.value = false;
      }, 5000);
      success.value = true;
      dialogEdit.value = false;
    } catch (error) {
      snackbarMessage.value = "Ошибка при редактировании записи";
      snackbarColor.value = "red-darken-1";
      console.error("Ошибка при редактировании записи:", error);
    } finally {
      dialogLoader.value = false;
    }
  };

  const deleteItemConfirmed = async (selectedItem: any) => {
    dialogLoader.value = true;
    success.value = false;
    try {
      await deleteService(selectedItem.id);
      snackbarMessage.value =
        "Запись " + selectedItem.name + " успешно удалена";
      snackbarColor.value = "green-darken-1";
      await nextTick();
      window.scrollTo(0, scrollPosition);
      setTimeout(() => {
        success.value = false;
      }, 5000);
      success.value = true;
      dialogDelete.value = false;
    } catch (error) {
      snackbarMessage.value = "Ошибка при удалении записи";
      snackbarColor.value = "red-darken-1";
      console.error("Ошибка при удалении записи:", error);
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
    setScrollPosition: (position: any) => {
      scrollPosition = position;
    },
    dialogEdit,
    dialogInfo,
    dialogAdd,
    dialogDelete,
    services,
  };
}
