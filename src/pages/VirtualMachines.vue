<template>
  <v-main style="margin-top: 100px">
    <v-container>
      <h1>Виртуальные машины</h1>
      <TagAccordion
        :items="virtualMachines"
        :isLoading="isLoading"
        :error="error"
        @update-selected-item="updateSelectedItem"
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
          <v-card-subtitle>{{ item.ip }}</v-card-subtitle>
          <v-card-text class="text-truncate" style="max-width: 350px">
            {{ item.description }}
          </v-card-text>
        </template>
      </TagAccordion>
      <Modal v-model:dialog="dialogEdit" title="Изменить элемент"
        ><template v-slot:body>
          <v-text-field
            label="Название"
            v-model="сopySelectedItem.value.name"
            :rules="[validationRules.name]"
            required
            class="mb-4"
            dense
          ></v-text-field>
          <v-text-field
            label="URL"
            v-model="сopySelectedItem.value.ip"
            :rules="validationRules.ip"
            required
            class="mb-4"
          ></v-text-field>
          <v-text-field
            label="Логин"
            v-model="сopySelectedItem.value.login"
            :rules="[validationRules.login]"
            dense
            required
            class="mb-4"
          ></v-text-field>
          <v-text-field
            label="Пароль"
            required
            v-model="сopySelectedItem.value.password"
            :type="passwordVisible ? 'text' : 'password'"
            :rules="[validationRules.password]"
            dense
            class="mb-4"
          >
            <template v-slot:append-inner>
              <v-btn variant="text" icon @click="togglePasswordVisibility">
                <v-icon>
                  {{ passwordVisible ? "mdi-eye-off" : "mdi-eye" }}
                </v-icon>
              </v-btn>
            </template>
          </v-text-field>

          <v-combobox
            label="Теги"
            v-model="сopySelectedItem.value.tags"
            :items="uniqueTagsListModal"
          ></v-combobox>
        </template>
        <template v-slot:actions>
          <v-btn
            text
            @click="handleSave(сopySelectedItem.value)"
            :disabled="!validateForm(сopySelectedItem.value)"
            >Сохранить</v-btn
          >
          <v-btn text @click="dialogEdit = false">Закрыть</v-btn>
        </template>
      </Modal>
      <DialogLoader :dialogLoader="dialogLoader" />

      <Modal v-model:dialog="dialogInfo" :title="selectedItem?.name">
        <v-card-subtitle>{{ selectedItem?.id }}</v-card-subtitle>
        <template v-slot:body>
          <p><strong>ip:</strong> {{ selectedItem?.ip }}</p>
          <p>
            <strong>Логин:</strong>
            {{ selectedItem.login }}
            <v-icon
              @click="copyToClipboard(selectedItem?.login)"
              class="ml-2 small-icon"
            >
              mdi-content-copy
            </v-icon>
          </p>
          <p>
            <strong>Пароль:</strong>
            {{ selectedItem?.password }}
            <v-icon
              @click="copyToClipboard(selectedItem?.password)"
              class="ml-2 small-icon"
            >
              mdi-content-copy
            </v-icon>
          </p>
          <p><strong>Теги:</strong> {{ selectedItem?.tags }}</p>
        </template>

        <template v-slot:actions>
          <v-btn text @click="dialogInfo = false">Закрыть</v-btn>
        </template>
      </Modal>

      <Modal v-model:dialog="dialogAdd" title="Добавить новый элемент">
        <template v-slot:body>
          <v-text-field
            label="Название"
            v-model="newItem.name"
            :rules="[validationRules.name]"
            required
            class="mb-4"
            dense
          ></v-text-field>
          <v-text-field
            label="ip"
            v-model="newItem.ip"
            :rules="validationRules.ip"
            required
            class="mb-4"
          ></v-text-field>
          <v-text-field
            label="Логин"
            v-model="newItem.login"
            :rules="[validationRules.login]"
            dense
            required
            class="mb-4"
          ></v-text-field>
          <v-text-field
            label="Пароль"
            required
            v-model="newItem.password"
            :type="passwordVisible ? 'text' : 'password'"
            :rules="[validationRules.password]"
            dense
            class="mb-4"
          >
            <template v-slot:append-inner>
              <v-btn variant="text" icon @click="togglePasswordVisibility">
                <v-icon>
                  {{ passwordVisible ? "mdi-eye-off" : "mdi-eye" }}
                </v-icon>
              </v-btn>
            </template>
          </v-text-field>

          <v-combobox
            label="Теги"
            v-model="newItem.tags"
            :items="uniqueTagsListModal"
          ></v-combobox>
        </template>

        <template v-slot:actions>
          <v-btn
            text
            @click="addSelectedItem()"
            :disabled="!validateForm(newItem)"
            >Добавить</v-btn
          >
          <v-btn text @click="dialogAdd = false">Закрыть</v-btn>
        </template>
      </Modal>

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

import DialogLoader from "@/components/DialogLoader.vue";
import Modal from "@/components/Modal.vue";
import Snackbar from "@/components/Snackbar.vue";
import { useClipboard } from "@vueuse/core";

// import { useServicesApi } from "@/composables/useServicesApi";
import { useItemOperationsVirtualMachine } from "@/composables/useItemOperationsVirtualMachine";

const virtualMachines = computed(() => virtualMachinesData.value || []);
const uniqueTagsList = computed(() => {
  const tags = new Set();

  virtualMachines.value.forEach((service) => {
    if (service.tags !== null) tags.add(service.tags);
  });

  const sortedTags = Array.from(tags).sort((a, b) => a.localeCompare(b));
  return sortedTags;
});

const copyText = ref("");
const passwordVisible = ref(false);

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};
const router = useRouter();

const {
  error,
  isLoading,
  virtualMachines: virtualMachinesData,
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
} = useItemOperationsVirtualMachine();

const selectedItem = ref({
  id: "",
  name: "",
  ip: "",
  login: "",
  password: "",
  tags: "",
});

const newItem = ref({
  id: "",
  name: "",
  ip: "",
  login: "",
  password: "",
  tags: "",
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

const сopySelectedItem = ref({});
const updateSelectedItem = (item) => {
  console.log("я здесь", item);
  selectedItem.value = item;
  сopySelectedItem.value = ref({ ...item });
  dialogEdit.value = true;
};

const resetNewItem = () => {
  newItem.value = {
    id: "",
    name: "",
    ip: "",
    login: "",
    password: "",
    tags: "",
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
const handleSave = (item) => {
  updateSelectedItem(item);
  editSelectedItem();
};
// Функция для проверки IPv4
const isValidIPv4 = (ip) => {
  const ipv4Regex =
    /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
  return ipv4Regex.test(ip);
};

const isValidIPv6 = (ip) => {
  const ipv6Regex =
    /^((?:[0-9a-fA-F]{1,4}:){7}(?:[0-9a-fA-F]{1,4}|:)|(?:[0-9a-fA-F]{1,4}:){1,7}:|(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,5}(?::[0-9a-fA-F]{1,4}){1,2}|(?:[0-9a-fA-F]{1,4}:){1,4}(?::[0-9a-fA-F]{1,4}){1,3}|(?:[0-9a-fA-F]{1,4}:){1,3}(?::[0-9a-fA-F]{1,4}){1,4}|(?:[0-9a-fA-F]{1,4}:){1,2}(?::[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:(?::[0-9a-fA-F]{1,4}){1,6}|:(?::[0-9a-fA-F]{1,4}){1,7}|::)$/i;
  return ipv6Regex.test(ip);
};

let disabledSave = ref(false);
// Функция валидации формы
const validateForm = (item) => {
  const ipRegex =
    /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
  const ipRegexV6 =
    /^((?:[0-9a-fA-F]{1,4}:){7}(?:[0-9a-fA-F]{1,4}|:)|(?:[0-9a-fA-F]{1,4}:){1,7}:|(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,5}(?::[0-9a-fA-F]{1,4}){1,2}|(?:[0-9a-fA-F]{1,4}:){1,4}(?::[0-9a-fA-F]{1,4}){1,3}|(?:[0-9a-fA-F]{1,4}:){1,3}(?::[0-9a-fA-F]{1,4}){1,4}|(?:[0-9a-fA-F]{1,4}:){1,2}(?::[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:(?::[0-9a-fA-F]{1,4}){1,6}|:(?::[0-9a-fA-F]{1,4}){1,7}|::)$/i;

  disabledSave.value =
    item.name.trim() !== "" &&
    item.ip.trim() !== "" &&
    (ipRegex.test(item.ip) || ipRegexV6.test(item.ip)) &&
    item.login.trim() !== "" &&
    item.password.trim() !== "";
  return disabledSave.value;
};

// Определите правила валидации
const validationRules = {
  name: (v) => !!v || "name обязательно",
  ip: [
    (v) => !!v || "IP-адрес обязателен",
    (v) =>
      isValidIPv4(v) ||
      isValidIPv6(v) ||
      "Некорректный IP-адрес. Например, 192.168.200.57 или 2001:db8::ff00:42:8329",
  ],
  login: (v) => !!v || "login обязательно",
  password: (v) => !!v || "password обязательно",
};

const editSelectedItem = async () => {
  await editItem(selectedItem.value);
};

const addSelectedItem = async () => {
  await addItem(newItem.value);
};

const dialogDeleteSelectedItem = (item) => {
  selectedItem.value = item;
  dialogDelete.value = true;
};

const deleteSelectedItem = async () => {
  console.log("selectedItem.value", selectedItem.value);
  await deleteItemConfirmed(selectedItem.value);
};

const dialogClose = () => {
  dialogEdit.value = false;
};
</script>

<style></style>
