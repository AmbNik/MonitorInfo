<template>
  <v-main style="margin-top: 100px">
    <v-container>
      <h1>Приложения</h1>

      <TagAccordion
        :items="applications"
        :isLoading="isLoading"
        :error="error"
        @update-selected-item="openDialogEdit"
        @update-new-item="resetNewItem"
        v-model:dialogEdit="dialogEdit"
        v-model:dialogInfo="dialogInfo"
        @open-dialog-info="openDialogInfo"
        @add-item="AddItemOpenDialog"
        @open-dialog-delete="dialogDeleteSelectedItem"
      >
        <template v-slot:name="{ item }">
          <v-col class="text-truncate" style="max-width: 350px">
            {{ item.name }}
          </v-col>
        </template>

        <template v-slot:description="{ item }">
          <v-card-subtitle>{{ item.url }}</v-card-subtitle>
          <v-card-text class="text-truncate" style="max-width: 350px">
            {{ item.description }}
          </v-card-text>
        </template>
      </TagAccordion>
      <FormHelper
        ref="formHelperRef"
        @confirm="handleSave"
        #default="{ close, handleConfirm, formState }"
      >
        <EditModal
          v-model:name="formState.name"
          v-model:url="formState.url"
          v-model:description="formState.description"
          v-model:login="formState.login"
          v-model:password="formState.password"
          v-model:tags="formState.tags"
          v-model:virtual_machine="formState.virtual_machine"
          :virtualMachines="virtualMachineNames"
          :validationRules="validationRules"
          :title="'Изменить элемент'"
          @close="close"
          @confirm="handleConfirm"
        />
      </FormHelper>
      <DialogLoader :dialogLoader="dialogLoader" />
      <!-- dialogInfo -->
      <ModalInfo
        v-model:dialogInfo="dialogInfo"
        :item="selectedItem"
        :virtualMachines="virtualMachines"
        @copy-to-clipboard="copyToClipboard"
      />
      <!-- dialogAdd -->
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
        :disabledSave="disabledSave"
      />

      <ModalDelete
        v-model:dialogDelete="dialogDelete"
        :itemName="selectedItem.name"
        @delete-item="deleteSelectedItem"
      />
    </v-container>
  </v-main>
</template>
<script setup>
import { ref, computed, onMounted, nextTick, toRefs, inject } from "vue";
import { useRouter } from "vue-router";
import DialogLoader from "@/components/modals/DialogLoader.vue";
import Snackbar from "@/components/UI/Snackbar.vue";
import Modal from "@/components/modals/Modal.vue";
import { useClipboard } from "@vueuse/core";
import { useApplicationsApi } from "@/composables/applications/useApplicationsApi";
import { useItemOperationsApplications } from "@/composables/applications/useItemOperationsApplications";
///1111
import FormHelper from "@/components/helpers/FormHelper.vue";

const showSnackbar = inject("showSnackbar");
///1111
const formHelperRef = ref(null);

function openDialogEdit(item) {
  formHelperRef.value.open(item);
}
const virtualMachines = computed({
  get: () => virtualMachinesData.value?.data || [],
});

const virtualMachineNames = computed(
  () =>
    virtualMachinesData.value?.data.map((vm) => ({
      id: vm.id,
      name: vm.name,
    })) || []
);

const uniqueTagsList = computed(() => {
  const tags = new Set();

  applications.value.forEach((service) => {
    if (service.tags !== null) tags.add(service.tags);
  });

  const sortedTags = Array.from(tags).sort((a, b) => a.localeCompare(b));
  return sortedTags;
});

const copyText = ref("");

const passwordVisible = ref(false);

function togglePasswordVisibility() {
  passwordVisible.value = !passwordVisible.value;
}

const router = useRouter();

const {
  data,
  isLoading,
  error,
  getApplications,
  addApplications,
  updateApplicationsUse,
  deleteApplicationsUse,
  virtualMachinesData,
  getVirtualMachines,
} = useApplicationsApi();

const {
  applications,
  dialogLoader,
  dialogEdit,
  success,
  snackbarMessage,
  snackbarColor,
  editItem,
  addItem,
  dialogAdd,
  dialogDelete,
  dialogInfo,
  deleteItemConfirmed,
} = useItemOperationsApplications();

onMounted(async () => {
  try {
    await Promise.all([getApplications(), getVirtualMachines()]);
  } catch (e) {
    console.error("Ошибка при загрузке данных:", e);
    throw e;
  }
});

console.log("virtualMachineNames", virtualMachineNames);

function getVirtualMachineIdByName(id) {
  console.log("id", id);
  const vm = virtualMachinesData.value?.data.find((vm) => vm.id === id);
  return vm ? vm.name : "не указано";
}

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

function openDialogInfo(item) {
  console.log("openDialogInfo", item);
  selectedItem.value = item;
  success.value = false;
  dialogInfo.value = true;
}

function AddItemOpenDialog(tag) {
  resetNewItem();
  if (tag == "Без тега") tag = null;
  newItem.value.tags = tag;
  dialogAdd.value = true;
}
const сopySelectedItem = ref({});
function updateSelectedItem(item) {
  selectedItem.value = item;
  сopySelectedItem.value = ref({ ...item });
  // dialogEdit.value = true;
}

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

async function copyToClipboard(text) {
  if (text) {
    await navigator.clipboard.writeText(text);
    snackbarMessage.value = "Скопирован " + text + " в буфер обмена";
    snackbarColor.value = "blue-darken-3";
    showSnackbar(snackbarMessage.value, snackbarColor.value);
  }
}
function handleSave(item) {
  updateSelectedItem(item);
  editSelectedItem();
  //1111
  formHelperRef.value.close();
}

let disabledSave = ref(false);
function validateForm(item) {
  console.log("item", item);
  disabledSave.value =
    item.name.trim() !== "" &&
    item.url.trim() !== "" &&
    /^https?:\/\/\S+\.\S+/g.test(item.url) &&
    item.login.trim() !== "" &&
    item.password.trim() !== "" &&
    !isNaN(item.virtual_machine);
}

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

async function editSelectedItem() {
  await editItem(selectedItem.value);
}

async function addSelectedItem() {
  await addItem(newItem.value);
}

function dialogDeleteSelectedItem(item) {
  selectedItem.value = item;
  dialogDelete.value = true;
}

async function deleteSelectedItem() {
  console.log("selectedItem.value", selectedItem.value);
  await deleteItemConfirmed(selectedItem.value);
}

function dialogClose() {
  dialogEdit.value = false;
}
</script>

<style></style>
