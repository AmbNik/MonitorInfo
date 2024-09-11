<template>
  <v-main style="margin-top: 100px">
    <v-container>
      <h1>Сервисы</h1>

      <TagAccordion
        :items="services"
        :isLoading="isLoading"
        :error="error"
        @update-selected-item="updateSelectedItem"
        @update-new-item="resetNewItem"
        v-model:dialogEdit="dialogEdit"
        @scroll-position-update="scrollPositionUpdate"
        v-model:dialogInfo="dialogInfo"
        @open-dialog-info="openDialogInfo"
        @add-item="AddItemOpenDialog"
        @open-dialog-delete="dialogDeleteSelectedItem"
      />
      <ModalEdit
        v-model:dialog="dialogEdit"
        :item="selectedItem"
        :title="'Изменить элемент'"
        :virtualMachines="virtualMachineNames"
        :uniqueTagsList="uniqueTagsList"
        :validationRules="validationRules"
        @save-items="editSelectedItem"
        @update-selected-item="updateSelectedItem"
        @dialog-close="dialogClose"
        @validate-form="validateForm"
        v-model:disabled="disabledSave"
      />
      <DialogLoader :dialogLoader="dialogLoader" />

      <ModalInfo
        v-model:dialogInfo="dialogInfo"
        :item="selectedItem"
        @copy-to-clipboard="copyToClipboard"
      />

      <ModalAdd
        v-model:dialogAdd="dialogAdd"
        :item="newItem"
        :title="'Добавить новый элемент'"
        :virtualMachines="virtualMachineNames"
        :uniqueTagsList="uniqueTagsList"
        :validationRules="validationRules"
        @add-item="addSelectedItem"
        @dialog-close="dialogClose"
        @validate-form="validateForm"
        v-model:disabled="disabledSave"
      />

      <ModalDelete
        v-model:dialogDelete="dialogDelete"
        :itemName="selectedItem.name"
        @delete-item="deleteSelectedItem"
      />

      <Snackbar
        v-model:success="success"
        :color="snackbarColor"
        :message="snackbarMessage"
      />
    </v-container>
  </v-main>
</template>
<script setup>
import { ref, computed, onMounted, nextTick, toRefs } from "vue";
import { useRouter } from "vue-router";

import ModalEdit from "@/components/ModalEdit.vue";
import DialogLoader from "@/components/DialogLoader.vue";
import ModalInfo from "@/components/ModalInfo.vue";
import ModalAdd from "@/components/ModalAdd.vue";
import Snackbar from "@/components/Snackbar.vue";
import { useClipboard } from "@vueuse/core";

import { useServicesApi } from "@/composables/useServicesApi";
import { useItemOperations } from "@/composables/useItemOperations";

const copyText = ref("");

const router = useRouter();

const {
  data,
  isLoading,
  error,
  getServices,
  addServices,
  updateServiceUse,
  deleteServiceUse,
  virtualMachinesData,
  getVirtualMachines,
} = useServicesApi();

const {
  services,
  dialogLoader,
  dialogEdit,
  success,
  snackbarMessage,
  snackbarColor,
  editItem,
  setScrollPosition,
  addItem,
  dialogAdd,
  dialogDelete,
  dialogInfo,
  deleteItemConfirmed,
} = useItemOperations();

onMounted(async () => {
  try {
    await Promise.all([getServices(), getVirtualMachines()]);
  } catch (e) {
    console.error("Ошибка при загрузке данных:", e);
    throw e;
  }
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

const openDialogInfo = (item) => {
  console.log("openDialogInfo", item);
  selectedItem.value = item;
  dialogInfo.value = true;
};

const AddItemOpenDialog = (tag) => {
  resetNewItem();
  if (tag == "Без тега") tag = null;
  newItem.value.tags = tag;
  dialogAdd.value = true;
};
const updateSelectedItem = (item) => {
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

const { copy } = useClipboard();

const copyToClipboard = (text) => {
  if (text) {
    console.log("copyToClipboard", text);
    copy(text);
    snackbarMessage.value = "Скопирован " + text + " в буфер обмена";
    snackbarColor.value = "blue-darken-3";
    success.value = true;
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

// const dialogLoader = ref(false);

let scrollPosition = 0;
const editSelectedItem = async () => {
  setScrollPosition(window.scrollY);
  await editItem(selectedItem.value);
};

const addSelectedItem = async () => {
  setScrollPosition(window.scrollY);
  await addItem(newItem.value);
};

const dialogDeleteSelectedItem = (item) => {
  selectedItem.value = item;
  dialogDelete.value = true;
};

const deleteSelectedItem = async () => {
  setScrollPosition(window.scrollY);
  console.log("selectedItem.value", selectedItem.value);
  await deleteItemConfirmed(selectedItem.value);
};

const dialogClose = () => {
  dialogEdit.value = false;
};

const uniqueTagsList = computed(() => {
  const tags = new Set();

  services.value.forEach((service) => {
    if (service.tags !== null) tags.add(service.tags);
  });

  const sortedTags = Array.from(tags).sort((a, b) => a.localeCompare(b));
  return sortedTags;
});
</script>

<style>
.my-2 {
  margin: 8px 0;
}
</style>
