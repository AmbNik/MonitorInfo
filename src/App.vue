<template>
  <v-app>
    <Navbar />
    <Snackbar ref="snackbarRef" />
  </v-app>
</template>

<script setup lang="ts">
import { provide, ref } from "vue";
import { SnackbarColor } from "@/types/enum/snackbarColor";
import Snackbar from "@/components/UI/Snackbar.vue";

const snackbarRef = ref<InstanceType<typeof Snackbar> | null>(null);

function showSnackbar(message: string, color: SnackbarColor): void {
  if (snackbarRef.value) {
    snackbarRef.value.showSnackbar(message, color);
  } else {
    console.warn("Snackbar reference is not available.");
  }
}

provide("showSnackbar", showSnackbar);
</script>
