<template>
  <BasePopup
    @closePopup="$emit('close')"
    class="edit-user-modal"
    :title="title"
    :isOpened="isOpened"
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
        v-model="url"
        :rules="validationRules.url"
        required
        class="mb-4"
      ></v-text-field>
      <v-textarea
        label="Описание"
        v-model="description"
        dense
        auto-grow
      ></v-textarea>
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
        :items="uniqueTagsList"
      ></v-combobox>
      <v-select
        label="Виртуальная машина"
        v-model="virtual_machine"
        :items="virtualMachines"
        item-value="id"
        item-title="name"
        dense
        class="mb-4"
      ></v-select>
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
const url = defineModel("url");
const description = defineModel("description");
const login = defineModel("login");
const password = defineModel("password");
const tags = defineModel("tags");
const virtual_machine = defineModel("virtual_machine");

const props = defineProps({
  validationRules: Object,
  virtualMachines: Object,
  isOpened: Boolean,
});

const validateForm = () => {
  return (
    name.value.trim() !== "" &&
    url.value.trim() !== "" &&
    /^https?:\/\/\S+\.\S+/g.test(url.value) &&
    login.value.trim() !== "" &&
    password.value.trim() !== "" &&
    !isNaN(virtual_machine.value)
  );
};
</script>

<style scoped></style>
