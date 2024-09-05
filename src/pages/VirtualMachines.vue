<template>
  <v-main style="margin-top: 100px">
    <v-container>
      <h1>Виртуальные машины</h1>
      <TagAccordionVirtualMachines
        :items="data"
        :isLoading="isLoading"
        :addService="addVirtualMachines"
        :updateService="updateVirtualMachines"
        :deleteService="deleteVirtualMachines"
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
import { useVirtualMachinesStore } from "@/stores/virtualmachines";

const router = useRouter();

const virtualMachinesStore = useVirtualMachinesStore();

const { isLoading, error } = toRefs(virtualMachinesStore);
// Use `data.data` to get items from servicesStore
const data = computed(() => virtualMachinesStore.data?.data || []);

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

const updateSelectedItem = (item) => {
  selectedItem.value = item;
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

const addVirtualMachines = async (newVirtualMachines) => {
  console.log("newVirtualMachines", newVirtualMachines);
  try {
    await virtualMachinesStore.addVirtualMachines(newVirtualMachines);
    await virtualMachinesStore.getVirtualMachines();
  } catch (e) {
    console.error("Ошибка при добавлении сервиса:", e);
    throw e;
  }
};

const updateVirtualMachines = async (selectedItem) => {
  try {
    await virtualMachinesStore.updateVirtualMachines(
      selectedItem.id,
      selectedItem
    );
    await virtualMachinesStore.getVirtualMachines();
  } catch (e) {
    console.error("Ошибка при редактирования сервиса:", e);
    throw e;
  }
};

const deleteVirtualMachines = async (id) => {
  try {
    await virtualMachinesStore.deleteVirtualMachines(id);
    await virtualMachinesStore.getVirtualMachines();
  } catch (e) {
    console.error("Ошибка при удалении сервиса:", e);
    throw e;
  }
};

// Функция для проверки IPv4
const isValidIPv4 = (ip) => {
  const ipv4Regex =
    /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
  return ipv4Regex.test(ip);
};

const validateForm = (item) => {
  const ipRegex =
    /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;

  // Проверка всех полей
  return (
    item.name.trim() !== "" &&
    item.ip.trim() !== "" &&
    ipRegex.test(item.ip) &&
    item.login.trim() !== "" &&
    item.password.trim() !== ""
  );
};

const validationRules = {
  name: (v) => !!v || "name обязательно",
  ip: [
    (v) => !!v || "IP-адрес обязателен",
    (v) =>
      isValidIPv4(v) || "Некорректный IP-адрес IPv4. Например, 192.168.200.57",
  ],
  login: (v) => !!v || "login обязательно",
  password: (v) => !!v || "password обязательно",
};
</script>

<style>
.my-2 {
  margin: 8px 0;
}
</style>
