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
          <v-icon @click="copyToClipboard(item?.login)" class="ml-2 small-icon">
            mdi-content-copy
          </v-icon>
        </p>
        <p>
          <strong>Пароль:</strong>
          {{ item?.password }}
          <v-icon
            @click="copyToClipboard(item?.password)"
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
import { useClipboard } from "@vueuse/core";

const copyText = defineModel("copyText");
const copyInfo = defineModel("copyInfo");

const { copy } = useClipboard();

const copyToClipboard = (text) => {
  if (text) {
    copy(text);
    copyText.value = text;
    copyInfo.value = true;
  }
};

const dialogInfo = defineModel("dialogInfo");
const props = defineProps({
  item: Object,
});
</script>
