<template>
  <v-alert
    v-if="props.error"
    title="Ошибка сервера"
    type="error"
    variant="outlined"
    >{{ props.error.message }}</v-alert
  >
  <v-alert v-if="successDelete" type="success" variant="outlined" class="mb-4">
    <h3>
      Запись <strong>{{ selectedItem?.name }}</strong> успешно удалена
    </h3>
  </v-alert>
  <v-alert v-if="successEdit" type="success" variant="outlined" class="mb-4">
    <h3>
      Запись <strong>{{ selectedItem?.name }}</strong> успешно изменена
    </h3>
  </v-alert>

  <v-alert
    v-if="successAdd"
    type="success"
    variant="outlined"
    class="mb-4"
    transition="scroll-x-transition"
    ы
  >
    <h3>
      Запись <strong>{{ newItem?.name }}</strong> успешно добавлена
    </h3>
  </v-alert>
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
                  @click="openDialogInfo(item)"
                >
                  <v-card-title>
                    <v-row class="align-center justify-space-between">
                      <v-col class="text-truncate" style="max-width: 350px">
                        {{ item.name }}
                      </v-col>

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
        <strong>{{ selectedItem?.name }}</strong
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
          v-model="selectedItem.name"
          :rules="[(v) => !!v || 'Название обязательно']"
          required
          class="mb-4"
          dense
        ></v-text-field>
        <v-text-field
          label="URL"
          v-model="selectedItem.url"
          :rules="[
            (v) => !!v || 'URL обязателен',
            (v) =>
              /https?:\/\/\S+\.\S+/g.test(v) ||
              'Некорректный формат URL. Например, https://example.com',
          ]"
          required
          class="mb-4"
        ></v-text-field>
        <v-textarea
          label="Описание"
          v-model="selectedItem.description"
          dense
          auto-grow
        ></v-textarea>
        <v-text-field
          label="Логин"
          v-model="selectedItem.login"
          :rules="[(v) => !!v || 'Логин обязательно']"
          dense
          required
          class="mb-4"
        ></v-text-field>
        <v-text-field
          label="Пароль"
          required
          v-model="selectedItem.password"
          :type="passwordVisible ? 'text' : 'password'"
          :rules="[(v) => !!v || 'Пароль обязательно']"
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
        <v-text-field
          label="Теги"
          v-model="selectedItem.tags"
          dense
        ></v-text-field>
        <v-select
          label="Виртуальная машина"
          v-model="selectedItem.virtual_machine"
          :items="virtualMachineOptions"
          item-value="value"
          item-title="text"
          dense
          class="mb-4"
        ></v-select>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="editItem()" :disabled="!validateFormEdit()"
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
          :rules="[(v) => !!v || 'Название обязательно']"
          required
          class="mb-4"
          dense
        ></v-text-field>
        <v-text-field
          label="URL"
          v-model="newItem.url"
          :rules="[
            (v) => !!v || 'URL обязателен',
            (v) =>
              /https?:\/\/\S+\.\S+/g.test(v) ||
              'Некорректный формат URL. Например, https://example.com',
          ]"
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
          :rules="[(v) => !!v || 'Логин обязательно']"
          dense
          required
          class="mb-4"
        ></v-text-field>
        <v-text-field
          label="Пароль"
          required
          v-model="newItem.password"
          :type="passwordVisible ? 'text' : 'password'"
          :rules="[(v) => !!v || 'Пароль обязательно']"
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
        <v-text-field label="Теги" v-model="newItem.tags" dense></v-text-field>
        <v-select
          label="Виртуальная машина"
          v-model="newItem.virtual_machine"
          :items="virtualMachineOptions"
          item-value="value"
          item-title="text"
          dense
          class="mb-4"
        ></v-select>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="addItem" :disabled="!validateForm()"
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
import { ref, computed } from "vue";

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
});

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

const selectedItem = ref({
  id: "",
  name: "",
  url: "",
  description: "",
  login: "",
  password: "",
  tags: "",
  virtual_machine: null,
});

const virtualMachineOptions = ref([
  { text: "-----", value: 1 },
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

const testMessage = computed(() => {
  return test();
});

const newItem = ref({
  name: "",
  url: "",
  description: "",
  login: "",
  password: "",
  tags: "",
  virtual_machine: null,
});
const saveChanges = () => {
  // Код для сохранения изменений (например, отправка данных на сервер)
  dialog.value = false;
};

console.log("newItem", newItem.value);
const passwordVisible = ref(false);

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

const uniqueTags = computed(() => {
  const tags = new Set();
  props.items.forEach((item) => {
    if (item.tags) {
      tags.add(item.tags);
    }
  });
  // Преобразуем Set в массив и сортируем по алфавиту
  return Array.from(tags).sort((a, b) => a.localeCompare(b));
});

const filteredItems = (tag) => {
  return props.items.filter((item) => item.tags === tag);
};

const openDialogInfo = (item) => {
  selectedItem.value = item;
  dialogInfo.value = true;
};

const openEditDialog = (item) => {
  resetSuccessFlags();
  successEdit.value = false;
  selectedItem.value = { ...item };
  dialogEdit.value = true;
};

const resetSuccessFlags = () => {
  successDelete.value = false;
  successEdit.value = false;
  successAdd.value = false;
};

const openDeleteDialog = (item) => {
  resetSuccessFlags();
  selectedItem.value = { ...item };
  dialogDelete.value = true;
};

const resetNewItem = () => {
  newItem.value = {
    name: "",
    url: "",
    description: "",
    login: "",
    password: "",
    tags: "",
    virtual_machine: null,
  };
};

const openAddDialog = (tag) => {
  resetSuccessFlags();
  resetNewItem();
  newItem.value.tags = tag;
  console.log("newItem.tags", newItem.tags);
  dialogAdd.value = true;
};

const addItem = async () => {
  dialogAdd.value = false;
  dialogLoader.value = true;
  successAdd.value = false;
  try {
    await props.addService(newItem.value);
    successAdd.value = true;
    dialogLoader.value = false;
    setTimeout(() => {
      successAdd.value = false;
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
  dialogEdit.value = false;
  dialogLoader.value = true;
  successEdit.value = false;

  try {
    await props.updateService(selectedItem.value);
    successEdit.value = true;
    dialogLoader.value = false;

    // Очистка предыдущего таймера (если есть)
    clearTimeout(editItemTimeout);

    editItemTimeout = setTimeout(() => {
      successEdit.value = false;
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
    await props.deleteService(selectedItem.value.id);
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

const validateForm = () => {
  // Проверяем все поля формы и возвращаем true, если они валидны
  return (
    newItem.value.name &&
    newItem.value.url &&
    /https?:\/\/\S+\.\S+/g.test(newItem.value.url) &&
    newItem.value.login &&
    newItem.value.password
  );
};

const validateFormEdit = () => {
  // Проверяем все поля формы и возвращаем true, если они валидны
  return (
    selectedItem.value.name &&
    selectedItem.value.url &&
    /https?:\/\/\S+\.\S+/g.test(selectedItem.value.url) &&
    selectedItem.value.login &&
    selectedItem.value.password
  );
};
</script>

<style>
.my-2 {
  margin: 8px 0;
}
</style>
