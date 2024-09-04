<template>
  <v-main style="margin-top: 100px">
    <v-container>
      <h1>Приложения</h1>
      <TagAccordion
        :items="data"
        :isLoading="isLoading"
        :addService="addApplications"
        :updateService="updateApplications"
        :deleteService="deleteApplications"
        :error="error"
        :selectedItem="selectedItem"
        :newItem="newItem"
        @update-selected-item="updateSelectedItem"
        @update-new-item="resetNewItem"
      />
    </v-container>
  </v-main>
</template>
<script setup>
import { ref, computed, onMounted, toRefs } from "vue";
import { useRouter } from "vue-router";
import { useApplicationsStore } from "@/stores/applications";

const router = useRouter();

const applicationsStore = useApplicationsStore();

const { isLoading, error } = toRefs(applicationsStore);
// Use `data.data` to get items from servicesStore
const data = computed(() => applicationsStore.data?.data || []);

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

onMounted(async () => {
  try {
    await applicationsStore.getApplications();
  } catch (e) {
    console.error("Ошибка при получения сервиса:", e);
    throw e;
  }
  // Debugging: log items to check if they are populated
  console.log(data.value);
});

const addApplications = async (newApplications) => {
  console.log("newApplications", newApplications);
  try {
    await applicationsStore.addApplications(newApplications);
    await applicationsStore.getApplications();
  } catch (e) {
    console.error("Ошибка при добавлении сервиса:", e);
    throw e;
  }
};

const updateApplications = async (selectedItem) => {
  try {
    await applicationsStore.updateApplications(selectedItem.id, selectedItem);
    await applicationsStore.getApplications();
  } catch (e) {
    console.error("Ошибка при редактирования сервиса:", e);
    throw e;
  }
};

const deleteApplications = async (id) => {
  try {
    await applicationsStore.deleteApplications(id);
    await applicationsStore.getApplications();
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
