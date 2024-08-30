<template>
  <TagAccordion :items="data" />
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useServicesStore } from "@/stores/services";

export default {
  setup() {
    const router = useRouter();

    const servicesStore = useServicesStore();

    // Use `data.data` to get items from servicesStore
    const data = computed(() => servicesStore.data?.data || []);

    onMounted(async () => {
      await servicesStore.getServices();
      // Debugging: log items to check if they are populated
      console.log(data.value);
    });

    return {
      servicesStore,
      data,
    };
  },
};
</script>

<style>
.my-2 {
  margin: 8px 0;
}
</style>
