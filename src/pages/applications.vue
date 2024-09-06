<template>
  <v-main style="margin-top: 100px">
    <v-container>
      <h1>Приложения</h1>
      <TagAccordion
        :items="data"
        :isLoading="isLoading"
        :virtualMachines="virtualMachineNames"
        :addService="addApplications"
        :updateService="updateApplications"
        :deleteService="deleteApplications"
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
import { useApplicationsStore } from "@/stores/applications";
import { useVirtualMachinesStore } from "@/stores/virtualmachines";
const router = useRouter();

const applicationsStore = useApplicationsStore();

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
  () =>
    virtualMachinesStore.data?.data.map((vm) => ({
      id: vm.id,
      name: vm.name,
    })) || []
);

const getVirtualMachineIdByName = (id) => {
  const vm = virtualMachinesStore.data?.data.find((vm) => vm.id === id);
  return vm ? vm.id : null;
};

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
    await applicationsStore.getApplications();
  } catch (e) {
    console.error("Ошибка при получения сервиса:", e);
    throw e;
  }
  // Debugging: log items to check if they are populated
  console.log(data.value);
});

const addApplications = async (newApplications) => {
  const vmId = getVirtualMachineIdByName(newApplications.virtual_machine);

  // Создаем копию newService и обновляем её
  const copyNewApplications = {
    ...newApplications,
    virtual_machine: vmId,
  };
  console.log("newApplications", copyNewApplications);
  try {
    await applicationsStore.addApplications(copyNewApplications);
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

// Функция валидации формы
const validateForm = (item) => {
  return (
    item.name.trim() !== "" &&
    item.url.trim() !== "" &&
    /^https?:\/\/\S+\.\S+/g.test(item.url) &&
    !isNaN(item.virtual_machine)
  );
};

// Определите правила валидации
const validationRules = {
  name: (v) => !!v || "name обязательно",
  login: true,
  password: true,
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
