<template>
  <v-main style="margin-top: 100px">
    <v-container>
      <h1>Приложения</h1>
      <TagAccordion
        :items="applications"
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
import { useApplications } from "@/composables/UseApplications";
import { useVirtualMachines } from "@/composables/useVirtualMachines";
const router = useRouter();

const {
  data,
  isLoading,
  error,
  getApplications,
  addApplications: addApplicationsUse,
  updateApplications: updateApplicationsUse,
  deleteApplications: deleteApplicationsUse,
} = useApplications();

const { data: virtualMachinesData, getVirtualMachines } = useVirtualMachines();

const applications = computed(() => data.value?.data || []);

onMounted(async () => {
  try {
    await getVirtualMachines();
  } catch (e) {
    console.error("Ошибка при получения сервиса:", e);
    throw e;
  }
  // Debugging: log items to check if they are populated
  console.log(data.value);
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

const getVirtualMachineIdByName = (id) => {
  const vm = virtualMachinesData.value?.data.find((vm) => vm.id === id);
  return vm ? vm.id : null;
};

// Use `data.data` to get items from servicesStore

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
  selectedItem.value = item;
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

onMounted(async () => {
  try {
    await getApplications();
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

  try {
    const response = await addApplicationsUse(copyNewApplications);
    console.log("response", response);
    await getApplications();
    return response;
  } catch (e) {
    console.error("Ошибка при добавлении сервиса:", e);
    throw e;
  }
};

const updateApplications = async (selectedItem) => {
  try {
    await updateApplicationsUse(selectedItem.id, selectedItem);
    await getApplications();
  } catch (e) {
    console.error("Ошибка при редактирования сервиса:", e);
    throw e;
  }
};

const deleteApplications = async (id) => {
  try {
    await deleteApplicationsUse(id);
    await getApplications();
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
