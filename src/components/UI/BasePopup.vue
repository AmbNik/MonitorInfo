<template>
  <v-dialog v-model="isOpened" max-width="500">
    <v-card>
      <v-card-title>
        <span class="headline">{{ props.title }}</span>
      </v-card-title>
      <v-card-text>
        <slot name="body"></slot>
      </v-card-text>
      <v-card-actions>
        <slot name="actions"></slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { defineProps } from "vue";

const isOpened = true;
const props = defineProps({
  title: String,
});
</script>

<style scoped></style>
