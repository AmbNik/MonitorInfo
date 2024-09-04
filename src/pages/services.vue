<template>
  <v-main style="margin-top: 100px">
    <v-container>
      <h1>Сервисы</h1>
      <TagAccordion
        :items="data"
        :isLoading="isLoading"
        :addService="addService"
        :updateService="updateService"
        :deleteService="deleteService"
        :error="error"
        :selectedItem="selectedItem"
        :newItem="newItem"
        :isFormValid="isFormValid"
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

const router = useRouter();

const servicesStore = useServicesStore();

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
  virtual_machine: null,
});

const newItem = ref({
  name: "",
  url: "",
  description: "",
  login: "",
  password: "",
  tags: "",
  virtual_machine: null,
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
    virtual_machine: null,
  };
};

// Функция для проверки валидности формы
const validateForm = () => {
  return (
    newItem.value.name &&
    newItem.value.url &&
    /https?:\/\/\S+\.\S+/g.test(newItem.value.url) &&
    newItem.value.login &&
    newItem.value.password
  );
};

// Вычисляемое свойство для проверки валидности формы
const isFormValid = computed(() => {
  validateForm();
  console.log(newItem.value);
});

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

const test = () => {
  console.log("test");
};

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
</script>

<style>
.my-2 {
  margin: 8px 0;
}
</style>
