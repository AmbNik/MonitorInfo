<template>
  successCopyInfo {{ successCopyInfo }}
  <v-sheet class="d-flex flex-column">
    <v-snackbar
      v-model="successCopyInfo"
      color="blue-darken-3"
      class="align-start pt-10"
    >
      <p class="text-h5">
        Скопирован <strong>{{ props.copyText }}</strong> в буфер обмена
      </p>
    </v-snackbar>
  </v-sheet>
</template>

<script setup>
const successCopyInfo = defineModel("successCopyInfo");
const props = defineProps({
  // successCopyInfo: {
  //   type: Boolean,
  // },
  copyText: {
    type: String,
  },
});
</script>
