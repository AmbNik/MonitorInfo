<template>
  <v-dialog v-model="dialogInfo" max-width="500">
    <v-card>
      <v-card-title>
        <span class="headline">{{ item?.name }}</span>
      </v-card-title>
      <v-card-subtitle>{{ item?.url }}</v-card-subtitle>
      <v-card-text>
        <p><strong>Описание:</strong> {{ item?.description }}</p>
        <p>
          <strong>Логин:</strong>
          {{ item?.login }}
          <v-icon
            @click="$emit('copy-to-clipboard', item?.login)"
            class="ml-2 small-icon"
          >
            mdi-content-copy
          </v-icon>
        </p>
        <p>
          <strong>Пароль:</strong>
          {{ item?.password }}
          <v-icon
            @click="$emit('copy-to-clipboard', item?.password)"
            class="ml-2 small-icon"
          >
            mdi-content-copy
          </v-icon>
        </p>
        <p><strong>Теги:</strong> {{ item?.tags }}</p>
        <p>
          <strong>Виртуальная машина:</strong>
          {{ item?.virtual_machine }}
        </p>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="dialogInfo = false">Закрыть</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
const dialogInfo = defineModel("dialogInfo");
const emit = defineEmits("copy-to-clipboard");
const props = defineProps({
  item: Object,
});
</script>
