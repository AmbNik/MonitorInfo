<template>
  <v-app>
    snackbarState.success {{ snackbarState.success }}
    <Navbar />

    <Snackbar
      v-if="snackbarState.success"
      :success="snackbarState.success"
      :color="snackbarState.snackbarColor"
      :message="snackbarState.snackbarMessage"
    />
  </v-app>
</template>

<script setup lang="ts">
import { provide, ref } from "vue";

type ShowSnackbar = (
  message: string,
  color: SnackbarColor,
  success: boolean
) => void;
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

const showSnackbar = (
  message: string = "Успех",
  color: SnackbarColor = "green-darken-1",
  success: boolean
): void => {
  snackbarState.value.success = false;
  // Задержка, чтобы скрыть Snackbar со старыми данными и показать с новыми
  setTimeout(() => {
    snackbarState.value.snackbarMessage = message;
    snackbarState.value.snackbarColor = color;
    snackbarState.value.success = true;
  }, 50);
};

provide("showSnackbar", showSnackbar as ShowSnackbar);

provide("snackbarState", snackbarState);
</script>
