<template>
  <v-app>
    <Navbar />
    <Snackbar
      v-model:success="snackbarState.success"
      :color="snackbarState.snackbarColor"
      :message="snackbarState.snackbarMessage"
    />
  </v-app>
</template>

<script setup lang="ts">
import { provide, ref } from "vue";

type ShowSnackbar = (message: string, color: SnackbarColor) => void;
type SnackbarColor =
  | "blue-darken-3"
  | "green-darken-1"
  | "red-darken-1"
  | "yellow-darken-1";

const snackbarState = ref({
  success: false,
  snackbarColor: "" as SnackbarColor,
  snackbarMessage: "",
});

const showSnackbar = (message: string, color: SnackbarColor): void => {
  snackbarState.value.snackbarMessage = message;
  snackbarState.value.snackbarColor = color;
  snackbarState.value.success = true;
};

provide("showSnackbar", showSnackbar as ShowSnackbar);
</script>
