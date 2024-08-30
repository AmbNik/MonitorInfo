<template>
  <v-main style="margin-top: 100px">
    <v-container>
      <v-expansion-panels v-model="panel" multiple>
        <v-expansion-panel v-for="tag in uniqueTags" :key="tag">
          <v-expansion-panel-title>{{ tag }}</v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-row>
              <v-col
                v-for="item in filteredItems(tag)"
                :key="item.id"
                cols="12"
                md="4"
              >
                <v-card class="my-2" outlined @click="openDialog(item)">
                  <v-card-title>{{ item.name }}</v-card-title>
                  <v-card-subtitle>{{ item.url }}</v-card-subtitle>
                  <v-card-text>
                    {{ item.description }}
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-container>

    <!-- Dialog for displaying detailed information -->
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title>
          <span class="headline">{{ selectedItem?.name }}</span>
        </v-card-title>
        <v-card-subtitle>{{ selectedItem?.url }}</v-card-subtitle>
        <v-card-text>
          <p><strong>Описание:</strong> {{ selectedItem?.description }}</p>
          <p><strong>Логин:</strong> {{ selectedItem?.login }}</p>
          <p><strong>Пароль:</strong> {{ selectedItem?.password }}</p>
          <p><strong>Теги:</strong> {{ selectedItem?.tags }}</p>
          <p>
            <strong>Виртуальная машина:</strong>
            {{ selectedItem?.virtual_machine || "Не указана" }}
          </p>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="dialog = false">Закрыть</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-main>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});

const panel = ref([]);
const dialog = ref(false);
const selectedItem = ref(null);

const uniqueTags = computed(() => {
  const tags = new Set();
  props.items.forEach((item) => {
    if (item.tags) {
      tags.add(item.tags);
    }
  });
  return Array.from(tags);
});

const filteredItems = (tag) => {
  return props.items.filter((item) => item.tags === tag);
};

const openDialog = (item) => {
  selectedItem.value = item;
  dialog.value = true;
};
</script>

<style>
.my-2 {
  margin: 8px 0;
}
</style>
