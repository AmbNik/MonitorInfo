<template>
  <v-dialog v-model="dialog" max-width="500">
    disabled.value {{ disabled }}
    <v-card>
      <v-card-title>
        <span class="headline">{{ title }}</span>
      </v-card-title>
      <v-card-text>
        <v-text-field
          label="Название"
          v-model="localItem.name"
          :rules="[validationRules.name]"
          required
          class="mb-4"
          dense
        ></v-text-field>
        <v-text-field
          label="URL"
          v-model="localItem.url"
          :rules="validationRules.url"
          required
          class="mb-4"
        ></v-text-field>
        <v-textarea
          label="Описание"
          v-model="localItem.description"
          dense
          auto-grow
        ></v-textarea>
        <v-text-field
          label="Логин"
          v-model="localItem.login"
          :rules="[validationRules.login]"
          dense
          required
          class="mb-4"
        ></v-text-field>
        <v-text-field
          label="Пароль"
          required
          v-model="localItem.password"
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
          v-model="localItem.tags"
          :items="uniqueTagsList"
        ></v-combobox>
        <v-select
          label="Виртуальная машина"
          v-model="localItem.virtual_machine"
          :items="props.virtualMachines"
          item-value="id"
          item-title="name"
          dense
          class="mb-4"
        ></v-select>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="handleSave" :disabled="!CheckFalidate(localItem)"
          >Сохранить</v-btn
        >
        <v-btn text @click="$emit('dialog-close')">Закрыть</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from "vue";

const dialog = defineModel("dialog");
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
  "save-items",
  "dialog-close",
  "validate-form",
]);

const localItem = ref({});

watch(
  () => props.item,
  (newItem) => {
    localItem.value = { ...newItem };
  },
  { deep: true }
);

// Watch localItem for changes to emit updates

// Function to emit updated item
const handleSave = () => {
  //   if (validateForm(localItem.value)) {
  //     emit("update-selected-item", localItem.value);
  //   }

  emit("update-selected-item", localItem.value);
  emit("save-items");
};

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

const passwordVisible = ref(false);

// const validateForm = (item) => {
//   return (
//     item.name.trim() !== "" &&
//     item.url.trim() !== "" &&
//     /^https?:\/\/\S+\.\S+/g.test(item.url) &&
//     item.login.trim() !== "" &&
//     item.password.trim() !== "" &&
//     item.virtual_machine
//   );
// };

const CheckFalidate = (localItem) => {
  emit("validate-form", localItem);
  return disabled.value;
};
let editItemTimeout;
</script>

<style scoped>
.my-2 {
  margin: 8px 0;
}
</style>
