<template>
  {{ props.successEdit }}
  <v-sheet class="d-flex flex-column">
    <v-snackbar
      v-model="props.successEdit"
      color="green-darken-1"
      class="align-start pt-10"
    >
      <p class="text-h5">
        Запись <strong>{{ SelectedItemName }}</strong> успешно изменена
      </p>
    </v-snackbar>
  </v-sheet>
</template>

<script setup>
const props = defineProps({
  successEdit: { Boolean },
  SelectedItemName: { String },
});
</script>
