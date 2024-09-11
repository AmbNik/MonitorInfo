import { ref } from "vue";

export function useEditItem() {
  const editItem = async (
    selectedItem: any,
    dialogEdit: any,
    dialogLoader: any,
    success: any
  ) => {
    console.log("111selectedItem", selectedItem.value);
    dialogEdit.value = false;
    dialogLoader.value = true;
    success.value = false;
    console.log("selectedItem.value", selectedItem.value);

    try {
      const response = await updateService(selectedItem.value);
      success.value = true;
      dialogLoader.value = false;
      console.log("successEdit", success.value);
      clearTimeout(editItemTimeout);
      await nextTick();
      window.scrollTo(0, scrollPosition);
      console.log("2scrollPosition", scrollPosition);
      editItemTimeout = setTimeout(() => {
        success.value = false;
        console.log("successEdit", success.value);
      }, 5000);
      snackbarMessage.value =
        "Запись " + selectedItem.value.name + " успешно изменена";
      snackbarColor.value = "green-darken-1";
    } catch (error) {
      console.error("Ошибка при редактировании записи:", error);
      success.value = false;
      dialogLoader.value = false;
    }
  };
  return {
    editItem,
  };
}
