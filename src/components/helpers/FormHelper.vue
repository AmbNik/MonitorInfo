<script setup>
import { ref, unref } from "vue";

const formState = ref();
const metaData = ref();
const isOpened = ref(false);

const emits = defineEmits({
  confirm: null,
});

function open(initialState = {}, initialMetaData = {}) {
  formState.value = JSON.parse(JSON.stringify(unref(initialState)));
  metaData.value = initialMetaData;
  isOpened.value = true;
  console.log("isOpened.value", isOpened.value);
  console.log("formState.value", formState.value);
}

function close() {
  cleanUpState();
}

function cleanUpState() {
  isOpened.value = false;
  formState.value = {};
  metaData.value = {};
  console.log("isOpened.value", isOpened.value);
}

function handleConfirm() {
  emits("confirm", unref(formState));
  cleanUpState();
}

defineExpose({
  open,
  close,
});
</script>

<template>
  <slot
    v-if="isOpened"
    :formState="formState"
    :metaData="metaData"
    :close="close"
    :handleConfirm="handleConfirm"
  ></slot>
</template>
