<template>
  dialogAdd {{ dialogAdd }}
  <v-dialog v-model="dialogAdd" max-width="500">
    <v-card>
      <v-card-title>
        <span class="headline">Добавить новый элемент</span>
      </v-card-title>
      <v-card-text>
        <v-text-field
          label="Название"
          v-model="item.name"
          :rules="[validationRules.name]"
          required
          class="mb-4"
          dense
        ></v-text-field>
        <v-text-field
          label="URL"
          v-model="item.url"
          :rules="validationRules.url"
          required
          class="mb-4"
        ></v-text-field>
        <v-textarea
          label="Описание"
          v-model="item.description"
          dense
          auto-grow
        ></v-textarea>
        <v-text-field
          label="Логин"
          v-model="item.login"
          :rules="[validationRules.login]"
          dense
          required
          class="mb-4"
        ></v-text-field>
        <v-text-field
          label="Пароль"
          required
          v-model="item.password"
          :type="passwordVisible ? 'text' : 'password'"
          :rules="[validationRules.password]"
          dense
          class="mb-4"
        >
          <template v-slot:append-inner>
            <v-btn variant="text" icon @click="togglePasswordVisibility">
              <v-icon>
                {{ passwordVisible ? "mdi-eye-off" : "mdi-eye" }}
              </v-icon>
            </v-btn>
          </template>
        </v-text-field>

        <v-combobox
          label="Теги"
          v-model="item.tags"
          :items="uniqueTagsListModal"
        ></v-combobox>
        <v-select
          label="Виртуальная машина"
          v-model="item.virtual_machine"
          :items="virtualMachines"
          item-value="id"
          item-title="name"
          dense
          class="mb-4"
        ></v-select>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="$emit('add-item', item)">Добавить</v-btn>
        <v-btn text @click="dialogAdd = false">Закрыть</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from "vue";

const dialogAdd = defineModel("dialogAdd");
const disabled = defineModel("disabled");
// const item = defineModel("copySelectedItem");

const props = defineProps({
  dialog: Boolean,
  item: Object,
  title: String,
  virtualMachines: Object,
  uniqueTagsList: Array,
  validationRules: Object,
});

const emit = defineEmits([
  "update-selected-item",
  "add-item",
  "dialog-close",
  "validate-form",
]);

// Watch localItem for changes to emit updates

// Function to emit updated item
const handleSave = () => {
  emit("save-items");
};

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

const passwordVisible = ref(false);
</script>

<style scoped>
.my-2 {
  margin: 8px 0;
}
</style>
