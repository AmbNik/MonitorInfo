<template>
  <v-sheet class="d-flex flex-column">
    <v-snackbar
      v-model="success"
      :color="props.color"
      class="align-start pt-10"
    >
      <p class="text-h5">
        <slot name="message">{{ props.message }} </slot>
      </p>
    </v-snackbar>
  </v-sheet>
</template>

<script setup lang="ts">
import { defineProps, defineModel } from "vue";
const success = defineModel<boolean>("success");
type SnackbarColor =
  | "blue-darken-3"
  | "green-darken-1"
  | "red-darken-1"
  | "yellow-darken-1";

const props = defineProps<{
  color: SnackbarColor;
  message: string;
}>();
</script>
