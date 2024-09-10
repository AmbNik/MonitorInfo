<template>
  <v-main style="margin-top: 100px">
    <v-container>
      <h1>Сервисы</h1>
      <!-- services {{ services }} -->
      <TagAccordion
        :items="services"
        :isLoading="isLoading"
        :virtualMachines="virtualMachineNames"
        :addService="addService"
        :updateService="updateService"
        :deleteService="deleteService"
        :error="error"
        :selectedItem="selectedItem"
        :newItem="newItem"
        :validateForm="validateForm"
        :validationRules="validationRules"
        @update-selected-item="updateSelectedItem"
        @update-new-item="resetNewItem"
        v-model:dialogEdit="dialogEdit"
        @scroll-position-update="scrollPositionUpdate"
      />
      <ModalEdit
        v-model:dialog="dialogEdit"
        :item="selectedItem"
        :title="'Добавить новый элемент'"
        :virtualMachines="virtualMachineNames"
        :uniqueTagsList="uniqueTagsList"
        :validationRules="validationRules"
        @save-items="editItem"
        @update-selected-item="updateSelectedItem"
        @dialog-close="dialogClose"
        @validate-form="validateForm"
        v-model:disabled="disabledSave"
      />
      <DialogLoader :dialogLoader="dialogLoader" />
      <SnackbarEdit
        :successEdit="successEdit"
        :SelectedItemName="selectedItem.name"
      />
    </v-container>
  </v-main>
</template>
<script setup>
import { ref, computed, onMounted, nextTick, toRefs } from "vue";
import { useRouter } from "vue-router";
// import { useServicesStore } from "@/stores/services";
import { useVirtualMachines } from "@/composables/useVirtualMachines";
import { useServices } from "@/composables/useServices";
import ModalEdit from "@/components/ModalEdit.vue";
import DialogLoader from "@/components/DialogLoader.vue";
import SnackbarEdit from "@/components/SnackbarEdit.vue";

const dialogEdit = ref(false);

const router = useRouter();
const {
  data,
  isLoading,
  error,
  getServices,
  addServices,
  updateService: updateServiceUse,
  deleteService: deleteServiceUse,
} = useServices();

onMounted(async () => {
  try {
    console.error("Ошdd");
    await getServices();
  } catch (e) {
    console.error("Ошибка при получения сервиса:", e);
    throw e;
  }
  // Debugging: log items to check if they are populated
  console.log(data.value);
});

const services = computed(() => data.value?.data || []);

const { data: virtualMachinesData, getVirtualMachines } = useVirtualMachines();

onMounted(async () => {
  try {
    await getVirtualMachines();
  } catch (e) {
    console.error("Ошибка при получения сервиса:", e);
    throw e;
  }
  // Debugging: log items to check if they are populated
  console.log(services.value);
});
const virtualMachines = computed(() => virtualMachinesData.value?.data || []);

// Вычисляемое свойство для списка виртуальных машин
const virtualMachineNames = computed(
  () =>
    virtualMachinesData.value?.data.map((vm) => ({
      id: vm.id,
      name: vm.name,
    })) || []
);

console.log("virtualMachineNames", virtualMachineNames);

const getVirtualMachineIdByName = (id) => {
  const vm = virtualMachinesData.value?.data.find((vm) => vm.id === id);
  return vm ? vm.id : null;
};

const selectedItem = ref({
  id: "",
  name: "",
  url: "",
  description: "",
  login: "",
  password: "",
  tags: "",
  virtual_machine: "",
});

console.log("selectedItem", selectedItem);

const newItem = ref({
  id: "",
  name: "",
  url: "",
  description: "",
  login: "",
  password: "",
  tags: "",
  virtual_machine: "",
});

const updateSelectedItem = (item) => {
  // scrollPosition = window.scrollY;
  // console.log("1scrollPosition", scrollPosition);
  console.log("я здесь", item);
  selectedItem.value = item;
  dialogEdit.value = true;
};

const scrollPositionUpdate = (Position) => {
  scrollPosition = Position;
};
const resetNewItem = () => {
  newItem.value = {
    id: "",
    name: "",
    url: "",
    description: "",
    login: "",
    password: "",
    tags: "",
    virtual_machine: "",
  };
};

const addService = async (newService) => {
  const vmId = getVirtualMachineIdByName(newService.virtual_machine);

  // Создаем копию newService и обновляем её
  const copyNewService = {
    ...newService,
    virtual_machine: vmId,
  };

  console.log("newService", copyNewService);
  try {
    const response = await addServices(copyNewService);
    await getServices();
    return response;
  } catch (e) {
    console.error("Ошибка при добавлении сервиса:", e);
    throw e;
  }
};

const updateService = async (selectedItem) => {
  console.log("33selectedItem", selectedItem);
  try {
    await updateServiceUse(selectedItem.id, selectedItem);
    await getServices();
  } catch (e) {
    console.error("Ошибка при редактирования сервиса:", e);
    throw e;
  }
};

const deleteService = async (id) => {
  try {
    await deleteServiceUse(id);
    await getServices();
  } catch (e) {
    console.error("Ошибка при удалении сервиса:", e);
    throw e;
  }
};

let disabledSave = ref(false);
// Функция валидации формы
const validateForm = (item) => {
  console.log("item", item);
  disabledSave.value =
    item.name.trim() !== "" &&
    item.url.trim() !== "" &&
    /^https?:\/\/\S+\.\S+/g.test(item.url) &&
    item.login.trim() !== "" &&
    item.password.trim() !== "" &&
    !isNaN(item.virtual_machine);

  console.log("disabledSave", disabledSave.value);
};

// Определите правила валидации
const validationRules = {
  name: (v) => !!v || "name обязательно",
  login: (v) => !!v || "login обязательно",
  password: (v) => !!v || "password обязательно",
  url: [
    (v) => !!v || "URL обязателен",
    (v) =>
      /^https?:\/\/\S+\.\S+/g.test(v) ||
      "Некорректный формат URL. Например, https://example.com",
  ],
};

let editItemTimeout;

const resetSuccessFlags = async () => {
  // successDelete.value = false;
  successEdit.value = false;
  // successAdd.value = false;
};
const dialogLoader = ref(false);
const successEdit = ref(false);
// Обычная переменная для хранения позиции прокрутки
let scrollPosition = 0;
const editItem = async () => {
  console.log("111selectedItem", selectedItem.value);
  dialogEdit.value = false;
  dialogLoader.value = true;
  successEdit.value = false;
  // isAddingItem.value = true;

  try {
    // await updateServiceUse(selectedItem);
    const response = await updateService(selectedItem.value);
    successEdit.value = true;
    dialogLoader.value = false;
    console.log("successEdit", successEdit.value);
    // Очистка предыдущего таймера (если есть)
    clearTimeout(editItemTimeout);
    // isAddingItemName.value = selectedItem.value.id;
    // Используем nextTick, чтобы дождаться обновления DOM
    await nextTick();
    window.scrollTo(0, scrollPosition);
    console.log("2scrollPosition", scrollPosition);
    editItemTimeout = setTimeout(() => {
      successEdit.value = false;
      console.log("successEdit", successEdit.value);
      // isAddingItem.value = false;
    }, 5000);
  } catch (error) {
    console.error("Ошибка при редактировании записи:", error);
    successEdit.value = false;
    dialogLoader.value = false;
  }
};

const dialogClose = () => {
  dialogEdit.value = false;
};
</script>

<style>
.my-2 {
  margin: 8px 0;
}
</style>
