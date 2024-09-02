<template>
  <v-main style="margin-top: 100px">
    <v-container>
      <h1>Сервисы</h1>
      <TagAccordion
        :items="data"
        :isLoading="isLoading"
        :addService="addService"
        :updateService="updateService"
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

onMounted(async () => {
  await servicesStore.getServices();
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
    await servicesStore.getServices(); // Перезагрузите список сервисов
  } catch (e) {
    console.error("Ошибка при добавлении сервиса:", e);
  }
};

const updateService = async (selectedItem) => {
  try {
    await servicesStore.updateService(selectedItem.id, selectedItem);
    await servicesStore.getServices(); // Перезагрузите список сервисов
  } catch (e) {
    console.error("Ошибка при редактирования сервиса:", e);
  }
};
</script>

<style>
.my-2 {
  margin: 8px 0;
}
</style>
