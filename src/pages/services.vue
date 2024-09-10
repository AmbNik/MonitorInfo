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
      />
    </v-container>
  </v-main>
</template>
<script setup>
import { ref, computed, onMounted, toRefs } from "vue";
import { useRouter } from "vue-router";
// import { useServicesStore } from "@/stores/services";
import { useVirtualMachines } from "@/composables/useVirtualMachines";
import { useServices } from "@/composables/useServices";

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

// Функция валидации формы
const validateForm = (item) => {
  return (
    item.name.trim() !== "" &&
    item.url.trim() !== "" &&
    /^https?:\/\/\S+\.\S+/g.test(item.url) &&
    item.login.trim() !== "" &&
    item.password.trim() !== "" &&
    !isNaN(item.virtual_machine)
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
