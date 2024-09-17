<template>
  <BasePopup
    @closePopup="$emit('close')"
    class="edit-user-modal"
    :title="title"
  >
    <template v-slot:body>
      <v-text-field
        label="Название"
        v-model="name"
        :rules="[validationRules.name]"
        required
        class="mb-4"
        dense
      ></v-text-field>
      <v-text-field
        label="URL"
        v-model="ip"
        :rules="validationRules.ip"
        required
        class="mb-4"
      ></v-text-field>
      <v-text-field
        label="Логин"
        v-model="login"
        :rules="[validationRules.login]"
        dense
        required
        class="mb-4"
      ></v-text-field>
      <v-text-field
        label="Пароль"
        required
        v-model="password"
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
        v-model="tags"
        :items="uniqueTagsListModal"
      ></v-combobox>
    </template>
    <template v-slot:actions>
      <v-btn @click="$emit('confirm')" :disabled="!validateForm()"
        >Сохранить</v-btn
      >
      <v-btn @click="$emit('close')">Закрыть</v-btn>
    </template>
  </BasePopup>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import BasePopup from "@/components/UI/BasePopup.vue";

const name = defineModel("name");
const ip = defineModel("ip");
const login = defineModel("login");
const password = defineModel("password");
const tags = defineModel("tags");

const props = defineProps({
  validationRules: Object,
  virtualMachines: Object,
});

// const emits = defineEmits([
//   "close",
//   "update:name",
//   "update:surname",
//   "update:tag",
// ]);

const ipv4Regex =
  /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
const ipv6Regex =
  /^((?:[0-9a-fA-F]{1,4}:){7}(?:[0-9a-fA-F]{1,4}|:)|(?:[0-9a-fA-F]{1,4}:){1,7}:|(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,5}(?::[0-9a-fA-F]{1,4}){1,2}|(?:[0-9a-fA-F]{1,4}:){1,4}(?::[0-9a-fA-F]{1,4}){1,3}|(?:[0-9a-fA-F]{1,4}:){1,3}(?::[0-9a-fA-F]{1,4}){1,4}|(?:[0-9a-fA-F]{1,4}:){1,2}(?::[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:(?::[0-9a-fA-F]{1,4}){1,6}|:(?::[0-9a-fA-F]{1,4}){1,7}|::)$/i;

// Функция для проверки IPv4
const isValidIPv4 = (ip) => {
  return ipv4Regex.test(ip);
};

const isValidIPv6 = (ip) => {
  return ipv6Regex.test(ip);
};

// Функция валидации формы
const validateForm = () => {
  return (
    name.value.trim() !== "" &&
    ip.value.trim() !== "" &&
    (ipv4Regex.test(ip.value) || ipv6Regex.test(ip.value)) &&
    login.value.trim() !== "" &&
    password.value.trim() !== ""
  );
};
</script>

<style scoped></style>
