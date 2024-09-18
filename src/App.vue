<template>
  <v-app>
    <Navbar />
    <Snackbar ref="snackbarRef" />
  </v-app>
</template>

<script setup lang="ts">
import { provide, ref } from "vue";
import { SnackbarColor } from "@/types/enum/snackbarColor";

const snackbarRef = ref(null);

const showSnackbar = (message: string, color: SnackbarColor): void => {
  snackbarRef.value.showSnackbar(message, color);
};

provide("showSnackbar", showSnackbar);
</script>
