<template>
  <v-sheet class="d-flex flex-column">
    <v-snackbar
      v-model="success"
      :color="color"
      class="align-start pt-10"
      :timeout="5000"
    >
      <p class="text-h5">
        <slot name="message">{{ message }} </slot>
      </p>
    </v-snackbar>
  </v-sheet>
</template>

<script setup lang="ts">
import { defineExpose } from "vue";
// const success = defineModel("success");
import { SnackbarColor } from "@/types/enum/snackbarColor";

const color = ref<SnackbarColor>(SnackbarColor.SuccessColor);
const message = ref("");
const success = ref(false);
function showSnackbar(mess: string, col: SnackbarColor) {
  success.value = false;
  color.value = col;
  message.value = mess;
  setTimeout(() => (success.value = true), 50);
}

defineExpose({ showSnackbar });
</script>

<style>
.v-snackbar {
  z-index: 2000 !important;
}
</style>
