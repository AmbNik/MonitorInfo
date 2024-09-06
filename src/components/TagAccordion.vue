<template>
  <v-col
    v-if="!isLoading && !props.items.length && !props.error"
    md="5"
    lg="4"
    xl="2"
    class="align-center justify-center"
    @click="openAddDialog(tag)"
  >
    <v-hover>
      <template v-slot:default="{ isHovering, props }">
        <v-card
          height="120px"
          v-bind="props"
          :color="
            isHovering ? 'green-lighten-2 border-opacity-0 ' : 'transparent'
          "
          border="dashed thin"
          class="d-flex align-center justify-center border-lg border-opacity-10"
        >
          <v-icon size="x-large" style="font-size: 50px">mdi-plus</v-icon>
        </v-card>
      </template>
    </v-hover>
  </v-col>
  <v-alert
    v-if="props.error"
    title="Ошибка сервера"
    type="error"
    variant="outlined"
    >{{ props.error.message }}</v-alert
  >
  <v-sheet class="d-flex flex-column">
    <v-snackbar
      v-model="successEdit"
      color="green-darken-1"
      class="align-start pt-10"
    >
      <p class="text-h5">
        Запись <strong>{{ copySelectedItem?.name }}</strong> успешно изменена
      </p>
    </v-snackbar>
  </v-sheet>

  <v-sheet class="d-flex flex-column">
    <v-snackbar
      v-model="successDelete"
      color="green-darken-1"
      class="align-start pt-10"
    >
      <p class="text-h5">
        Запись <strong>{{ copySelectedItem?.name }}</strong> успешно удалена
      </p>
    </v-snackbar>
  </v-sheet>

  <v-sheet class="d-flex flex-column">
    <v-snackbar
      v-model="copyInfo"
      color="blue-darken-3"
      class="align-start pt-10"
    >
      <p class="text-h5">
        Скопирован <strong>{{ copyText }}</strong> в буфер обмена
      </p>
    </v-snackbar>
  </v-sheet>
  <v-sheet class="d-flex flex-column">
    <v-snackbar
      v-model="successAdd"
      color="green-darken-1"
      class="align-start pt-10"
    >
      <p class="text-h5">
        Запись <strong>{{ newItem?.name }}</strong> успешно добавлена
      </p>
    </v-snackbar>
  </v-sheet>

  <v-skeleton-loader v-if="isLoading" type="article"></v-skeleton-loader>
  <v-skeleton-loader v-if="isLoading" type="article"></v-skeleton-loader>
  <v-skeleton-loader v-if="isLoading" type="article"></v-skeleton-loader>
  <v-expansion-panels v-else-if="!props.error" v-model="panel" multiple>
    <v-expansion-panel v-for="tag in uniqueTags" :key="tag">
      <v-expansion-panel-title>
        <h2>{{ tag }}</h2></v-expansion-panel-title
      >
      <v-expansion-panel-text>
        <v-row>
          <!-- Отображать карточку с иконкой "плюс" после последней карточки -->
          <v-col
            md="5"
            lg="4"
            xl="2"
            class="align-center justify-center"
            @click="openAddDialog(tag)"
          >
            <v-hover>
              <template v-slot:default="{ isHovering, props }">
                <v-card
                  height="120px"
                  v-bind="props"
                  :color="
                    isHovering
                      ? 'green-lighten-2 border-opacity-0 '
                      : 'transparent'
                  "
                  border="dashed thin"
                  class="d-flex align-center justify-center border-lg border-opacity-10"
                >
                  <v-icon size="x-large" style="font-size: 50px"
                    >mdi-plus</v-icon
                  >
                </v-card>
              </template>
            </v-hover>
          </v-col>
          <v-col
            v-for="(item, index) in filteredItems(tag)"
            :key="item.id"
            cols="12"
            md="5"
            lg="4"
            xl="2"
          >
            <v-hover>
              <template v-slot:default="{ isHovering, props }">
                <v-card
                  v-bind="props"
                  height="120px"
                  :color="isHovering ? 'grey-lighten-2' : 'grey-darken-3'"
                  :class="{
                    'green-my': isAddingItem && item.id === isAddingItemName,
                  }"
                  @click="openDialogInfo(item)"
                >
                  <v-card-title>
                    <v-row
                      class="align-center justify-space-between justify-end"
                    >
                      <v-col class="text-truncate" style="max-width: 350px">
                        {{ item.name }}
                      </v-col>
                      <v-col class="d-flex justify-end"> </v-col>
                      <v-icon
                        @click.stop="openLink(item.url)"
                        class="ml-2"
                        small
                        style="cursor: pointer"
                      >
                        mdi-open-in-new
                      </v-icon>

                      <template v-slot:append>
                        <v-btn icon="mdi-heart"></v-btn>

                        <v-btn icon="mdi-magnify"></v-btn>

                        <v-btn icon="mdi-dots-vertical"></v-btn>
                      </template>
                      <v-menu>
                        <template v-slot:activator="{ props }">
                          <v-btn
                            icon="mdi-dots-vertical"
                            variant="text"
                            v-bind="props"
                          ></v-btn>
                        </template>

                        <v-list>
                          <v-list-item @click="openEditDialog(item)">
                            <v-list-item-title>Редактировать</v-list-item-title>
                          </v-list-item>
                          <v-list-item @click="openDeleteDialog(item)">
                            <v-list-item-title>Удалить</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </v-row>
                  </v-card-title>

                  <v-card-subtitle>{{ item.url }}</v-card-subtitle>
                  <v-card-text class="text-truncate" style="max-width: 350px">
                    {{ item.description }}
                  </v-card-text>
                </v-card>
              </template>
            </v-hover>
          </v-col>
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>

  <v-dialog v-model="dialogInfo" max-width="500">
    <v-card>
      <v-card-title>
        <span class="headline">{{ copySelectedItem?.name }}</span>
      </v-card-title>
      <v-card-subtitle>{{ copySelectedItem?.url }}</v-card-subtitle>
      <v-card-text>
        <p><strong>Описание:</strong> {{ copySelectedItem?.description }}</p>
        <p>
          <strong>Логин:</strong>
          {{ copySelectedItem?.login }}
          <v-icon
            @click="copyToClipboard(copySelectedItem?.login)"
            class="ml-2 small-icon"
          >
            mdi-content-copy
          </v-icon>
        </p>
        <p>
          <strong>Пароль:</strong>
          {{ copySelectedItem?.password }}
          <v-icon
            @click="copyToClipboard(copySelectedItem?.password)"
            class="ml-2 small-icon"
          >
            mdi-content-copy
          </v-icon>
        </p>
        <p><strong>Теги:</strong> {{ copySelectedItem?.tags }}</p>
        <p>
          <strong>Виртуальная машина:</strong>
          {{ selectedVirtualMachineName }}
        </p>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="dialogInfo = false">Закрыть</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Диалоговое окно подтверждения удаления -->
  <v-dialog v-model="dialogDelete" max-width="400">
    <v-card>
      <v-card-title class="headline">Удалить элемент?</v-card-title>
      <v-card-text>
        Вы уверены, что хотите удалить
        <strong>{{ copySelectedItem?.name }}</strong
        >? Это действие нельзя отменить.
      </v-card-text>
      <v-card-actions>
        <v-btn color="red" text @click="deleteItemConfirmed">Удалить</v-btn>
        <v-btn text @click="dialogDelete = false">Отмена</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogEdit" max-width="500">
    <v-card>
      <v-card-title>
        <span class="headline">Добавить новый элемент</span>
      </v-card-title>
      <v-card-text>
        <v-text-field
          label="Название"
          v-model="copySelectedItem.name"
          :rules="[validationRules.name]"
          required
          class="mb-4"
          dense
        ></v-text-field>
        <v-text-field
          label="URL"
          v-model="copySelectedItem.url"
          :rules="validationRules.url"
          required
          class="mb-4"
        ></v-text-field>
        <v-textarea
          label="Описание"
          v-model="copySelectedItem.description"
          dense
          auto-grow
        ></v-textarea>
        <v-text-field
          label="Логин"
          v-model="copySelectedItem.login"
          :rules="[validationRules.login]"
          dense
          required
          class="mb-4"
        ></v-text-field>
        <v-text-field
          label="Пароль"
          required
          v-model="copySelectedItem.password"
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
          v-model="copySelectedItem.tags"
          :items="uniqueTagsListModal"
        ></v-combobox>
        <v-select
          label="Виртуальная машина"
          v-model="copySelectedItem.virtual_machine"
          :items="virtualMachines"
          item-value="id"
          item-title="name"
          dense
          class="mb-4"
        ></v-select>
      </v-card-text>
      <v-card-actions>
        <v-btn
          text
          @click="editItem()"
          :disabled="!validateForm(copySelectedItem)"
          >Сохранить</v-btn
        >
        <v-btn text @click="dialogEdit = false">Закрыть</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Модальное окно для добавления нового элемента -->
  <v-dialog v-model="dialogAdd" max-width="500">
    <v-card>
      <v-card-title>
        <span class="headline">Добавить новый элемент</span>
      </v-card-title>
      <v-card-text>
        <v-text-field
          label="Название"
          v-model="newItem.name"
          :rules="[validationRules.name]"
          required
          class="mb-4"
          dense
        ></v-text-field>
        <v-text-field
          label="URL"
          v-model="newItem.url"
          :rules="validationRules.url"
          required
          class="mb-4"
        ></v-text-field>
        <v-textarea
          label="Описание"
          v-model="newItem.description"
          dense
          auto-grow
        ></v-textarea>
        <v-text-field
          label="Логин"
          v-model="newItem.login"
          :rules="[validationRules.login]"
          dense
          required
          class="mb-4"
        ></v-text-field>
        <v-text-field
          label="Пароль"
          required
          v-model="newItem.password"
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
          v-model="newItem.tags"
          :items="uniqueTagsListModal"
        ></v-combobox>
        <v-select
          label="Виртуальная машина"
          v-model="newItem.virtual_machine"
          :items="virtualMachines"
          item-value="id"
          item-title="name"
          dense
          class="mb-4"
        ></v-select>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="addItem" :disabled="!validateForm(newItem)"
          >Добавить</v-btn
        >
        <v-btn text @click="dialogAdd = false">Закрыть</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogLoader" max-width="320" persistent>
    <v-list class="py-2" color="primary" elevation="12" rounded="lg">
      <v-list-item title="Выполнение операции">
        <template v-slot:append>
          <v-progress-circular
            color="primary"
            indeterminate="disable-shrink"
            size="16"
            width="2"
          ></v-progress-circular>
        </template>
      </v-list-item>
    </v-list>
  </v-dialog>
</template>

<script setup>
import { ref, computed, nextTick, defineEmits } from "vue";
import { useClipboard } from "@vueuse/core";

const emit = defineEmits(["update-selected-item", "update-new-item"]);

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    required: true,
  },
  addService: {
    type: Function,
    required: true,
  },
  updateService: {
    type: Function,
    required: true,
  },
  deleteService: {
    type: Function,
    required: true,
  },
  error: {
    type: [String, Object], // Указываем, что это может быть строка или объект
    default: "", // Устанавливаем значение по умолчанию для не обязательного пропса
  },
  selectedItem: { type: Object, required: true },
  newItem: { type: Object, required: true },
  virtualMachines: { type: Object, required: true },
  validateForm: { type: Function, required: true },
  validationRules: {
    type: Object,
    required: true,
  },
});

const newItem = ref(props.newItem);

// console.log("props.error", props.error);
const panel = ref([]);
const dialogInfo = ref(false);
const dialogEdit = ref(false);
const dialogAdd = ref(false);
const dialogDelete = ref(false);
const successDelete = ref(false);
const successEdit = ref(false);
const successAdd = ref(false);
const dialogLoader = ref(false);
const dialog = ref(true);

const copyInfo = ref(false);
const copyText = ref("");

const isAddingItem = ref(false);
const isAddingItemName = ref(false);

const { copy } = useClipboard();

const copyToClipboard = (text) => {
  if (text) {
    copy(text);
    copyText.value = text;
    copyInfo.value = true;
  }
};

const openLink = (url) => {
  if (url) {
    window.open(url, "_blank"); // Открывает ссылку в новой вкладке
  }
};

const virtualMachineOptions = ref([
  { text: "abakushka", value: 2 },
  { text: "Dinner", value: 3 },
  { text: "abakushka-front", value: 4 },
  { text: "space", value: 5 },
  { text: "SUO", value: 6 },
  { text: "Portainer", value: 7 },
  { text: "Sentry", value: 8 },
  { text: "AISKGN", value: 9 },
  { text: "SUO_V3", value: 10 },
  { text: "ZetTech", value: 11 },

  // Добавьте другие виртуальные машины по необходимости
]);

const saveChanges = () => {
  // Код для сохранения изменений (например, отправка данных на сервер)
  dialog.value = false;
};

console.log("newItem", props.newItem);
const passwordVisible = ref(false);

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

const uniqueTagsListModal = computed(() => {
  const tags = new Set();

  props.items.forEach((item) => {
    if (item.tags !== null) tags.add(item.tags);
  });

  const sortedTags = Array.from(tags).sort((a, b) => a.localeCompare(b));
  return sortedTags;
});

const uniqueTags = computed(() => {
  const tags = new Set();
  let hasNoTag = false;

  props.items.forEach((item) => {
    if (item.tags) {
      if (item.tags === null || item.tags === undefined) {
        hasNoTag = true;
      } else {
        tags.add(item.tags);
      }
    } else {
      hasNoTag = true;
    }
  });

  // Преобразуем Set в массив и сортируем по алфавиту
  const sortedTags = Array.from(tags).sort((a, b) => a.localeCompare(b));
  if (hasNoTag) {
    sortedTags.push("Без тега");
  }

  return sortedTags;
});

const filteredItems = (tag) => {
  console.log("i222tem", props.items);
  if (tag == "Без тега") tag = null;
  return props.items.filter((item) => item.tags === tag);
};

const resetSuccessFlags = async () => {
  successDelete.value = false;
  successEdit.value = false;
  successAdd.value = false;
};
const openDialogInfo = (item) => {
  resetSuccessFlags();

  emit("update-selected-item", item);
  console.log("Selected Item:", copySelectedItem.name);

  dialogInfo.value = true;
};

const copySelectedItem = ref({ ...props.selectedItem });
// Обновление copySelectedItem при изменении props.selectedItem
watch(
  () => props.selectedItem,
  (newValue) => {
    copySelectedItem.value = { ...newValue };
  }
);

const openEditDialog = (item) => {
  resetSuccessFlags();
  console.log("item", item);
  console.log("copySelectedItem", copySelectedItem);
  // emit("update-selected-item", item);
  copySelectedItem.value = { ...item };
  dialogEdit.value = true;
};

const openDeleteDialog = (item) => {
  resetSuccessFlags();
  emit("update-selected-item", item);
  dialogDelete.value = true;
};

const resetNewItem = () => {
  newItem.value = { ...props.newItem };
};

const openAddDialog = (tag = null) => {
  resetSuccessFlags();
  resetNewItem();
  if (tag == "Без тега") tag = null;
  newItem.value.tags = tag;

  dialogAdd.value = true;
};

const addItem = async () => {
  console.log("222newItem", newItem.value);
  dialogAdd.value = false;
  dialogLoader.value = true;
  successAdd.value = false;
  isAddingItem.value = true;
  try {
    const response = await props.addService(newItem.value);

    // Проверьте структуру ответа
    console.log("Response from addService:", response);
    successAdd.value = true;
    dialogLoader.value = false;

    console.log("newItem.value", newItem.value);
    isAddingItemName.value = response.id;
    setTimeout(() => {
      successAdd.value = false;
      isAddingItem.value = false;
    }, 5000);
  } catch (error) {
    console.error("Ошибка при добавлении записи:", error);
    successAdd.value = false;
    dialogLoader.value = false;
  }
};
// Переменная для хранения идентификатора таймера
let editItemTimeout;

const editItem = async () => {
  console.log("111props.selectedItem", props.selectedItem);
  dialogEdit.value = false;
  dialogLoader.value = true;
  successEdit.value = false;
  isAddingItem.value = true;
  try {
    await props.updateService(copySelectedItem.value);
    const response = await props.updateService(copySelectedItem.value);
    successEdit.value = true;
    dialogLoader.value = false;

    // Очистка предыдущего таймера (если есть)
    clearTimeout(editItemTimeout);
    isAddingItemName.value = copySelectedItem.value.id;
    editItemTimeout = setTimeout(() => {
      successEdit.value = false;
      isAddingItem.value = false;
    }, 5000);
  } catch (error) {
    console.error("Ошибка при редактировании записи:", error);
    successEdit.value = false;
    dialogLoader.value = false;
  }
};

// Переменная для хранения идентификатора таймера
let editDeleteTimeout;

const deleteItemConfirmed = async () => {
  dialogDelete.value = false;
  dialogLoader.value = true;
  successDelete.value = false;
  try {
    await props.deleteService(copySelectedItem.value.id);
    successDelete.value = true;
    dialogLoader.value = false;

    // Очистка предыдущего таймера (если есть)
    clearTimeout(editDeleteTimeout);
    editDeleteTimeout = setTimeout(() => {
      successDelete.value = false;
    }, 5000);
  } catch (error) {
    console.error("Ошибка при удалении записи:", error);
    successDelete.value = false;
    dialogLoader.value = false;
  }
};

const selectedVirtualMachineName = computed(() => {
  const vm = props.virtualMachines.find(
    (vm) => vm.id === copySelectedItem.value.virtual_machine
  );
  return vm ? vm.name : "Не указана";
});
</script>

<style>
.small-icon {
  font-size: 20px; /* Уменьшите значение по вашему усмотрению */
}
.my-2 {
  margin: 8px 0;
}
.green-my {
  background-color: #388e3c !important; /* Цвет для состояния добавления записи */
}
</style>
