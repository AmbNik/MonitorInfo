<template>
  <v-main style="margin-top: 100px">
    <v-container>
      <h1>Сервисы</h1>
      <TagAccordion
        :items="data"
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
      />
    </v-container>
  </v-main>
</template>
<script setup>
import { ref, computed, onMounted, toRefs } from "vue";
import { useRouter } from "vue-router";
import { useServicesStore } from "@/stores/services";
import { useVirtualMachinesStore } from "@/stores/virtualmachines";

const router = useRouter();

const servicesStore = useServicesStore();
const virtualMachinesStore = useVirtualMachinesStore();
onMounted(async () => {
  try {
    await virtualMachinesStore.getVirtualMachines();
  } catch (e) {
    console.error("Ошибка при получения сервиса:", e);
    throw e;
  }
  // Debugging: log items to check if they are populated
  console.log(data.value);
});
const virtualMachines = computed(() => virtualMachinesStore.data?.data || []);
// Вычисляемое свойство для списка виртуальных машин
const virtualMachineNames = computed(
  () => virtualMachinesStore.data?.data.map((vm) => vm.name) || []
);

const { isLoading, error } = toRefs(servicesStore);
// Use `data.data` to get items from servicesStore
const data = computed(() => servicesStore.data?.data || []);

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

const newItem = ref({
  name: "",
  url: "",
  description: "",
  login: "",
  password: "",
  tags: "",
  virtual_machine: "",
});

const updateSelectedItem = (item) => {
  selectedItem.value = item;
};

const resetNewItem = () => {
  newItem.value = {
    name: "",
    url: "",
    description: "",
    login: "",
    password: "",
    tags: "",
    virtual_machine: "",
  };
};

onMounted(async () => {
  try {
    await servicesStore.getServices();
  } catch (e) {
    console.error("Ошибка при получения сервиса:", e);
    throw e;
  }
  // Debugging: log items to check if they are populated
  console.log(data.value);
});

const addService = async (newService) => {
  console.log("newService", newService);
  try {
    await servicesStore.addServices(newService);
    await servicesStore.getServices();
  } catch (e) {
    console.error("Ошибка при добавлении сервиса:", e);
    throw e;
  }
};

const updateService = async (selectedItem) => {
  console.log("33selectedItem", selectedItem);
  try {
    await servicesStore.updateService(selectedItem.id, selectedItem);
    await servicesStore.getServices();
  } catch (e) {
    console.error("Ошибка при редактирования сервиса:", e);
    throw e;
  }
};

const deleteService = async (id) => {
  try {
    await servicesStore.deleteService(id);
    await servicesStore.getServices();
  } catch (e) {
    console.error("Ошибка при удалении сервиса:", e);
    throw e;
  }
};

// Функция валидации формы
const validateForm = (item) => {
  const virtual_machine = item.virtual_machine || "";
  return (
    item.name.trim() !== "" &&
    item.url.trim() !== "" &&
    /^https?:\/\/\S+\.\S+/g.test(item.url) &&
    item.login.trim() !== "" &&
    item.password.trim() !== "" &&
    virtual_machine.trim() !== ""
  );
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
</script>

<style>
.my-2 {
  margin: 8px 0;
}
</style>
