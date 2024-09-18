<template>
  <v-sheet class="d-flex flex-column">
    <v-snackbar
      v-model="snackbarVisible"
      :color="props.color"
      class="align-start pt-10"
      :timeout="5000"
    >
      <p class="text-h5">
        <slot name="message">{{ props.message }} </slot>
      </p>
    </v-snackbar>
  </v-sheet>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

type SnackbarColor =
  | "blue-darken-3"
  | "green-darken-1"
  | "red-darken-1"
  | "yellow-darken-1";

const props = defineProps<{
  color: SnackbarColor;
  message: string;
  success: Boolean;
}>();

const snackbarVisible = ref(false);

watch(
  () => props.success,
  (newValue: any) => {
    console.log("New value of success:", newValue);

    if (newValue) {
      snackbarVisible.value = false;
      console.log("sdsd", props.success);
      snackbarVisible.value = true;
    } else {
      snackbarVisible.value = false;
    }
  },
  { immediate: true }
);
</script>

<style>
.v-snackbar {
  z-index: 2000 !important;
}
</style>
