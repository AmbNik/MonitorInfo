<template>
  <v-skeleton-loader v-if="isLoading" type="article"></v-skeleton-loader>
  <v-skeleton-loader v-if="isLoading" type="article"></v-skeleton-loader>
  <v-expansion-panels v-else v-model="panel" multiple>
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
                          <v-list-item>
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
        <v-text-field
          label="Название"
          v-model="selectedItem.name"
          dense
        ></v-text-field>
      </v-card-title>
      <v-card-subtitle>
        <v-text-field
          label="URL"
          v-model="selectedItem.url"
          dense
        ></v-text-field>
      </v-card-subtitle>
      <v-card-text>
        <v-textarea
          label="Описание"
          v-model="selectedItem.description"
          dense
          auto-grow
        ></v-textarea>
        <v-text-field
          label="Логин"
          v-model="selectedItem.login"
          dense
        ></v-text-field>
        <v-text-field
          label="Пароль"
          v-model="selectedItem.password"
          :type="passwordVisible ? 'text' : 'password'"
          dense
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
        <v-text-field
          label="Виртуальная машина"
          v-model="selectedItem.virtual_machine"
          dense
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="saveChanges">Сохранить</v-btn>
        <v-btn text @click="dialog = false">Закрыть</v-btn>
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
});

const panel = ref([]);
const dialogInfo = ref(false);
const dialogEdit = ref(false);
const dialogAdd = ref(false);
const dialogDelete = ref(false);

const selectedItem = ref({
  name: "",
  url: "",
  description: "",
  login: "",
  password: "",
  tags: "",
  virtual_machine: "",
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
  return Array.from(tags);
});

const filteredItems = (tag) => {
  return props.items.filter((item) => item.tags === tag);
};

const openDialogInfo = (item) => {
  selectedItem.value = item;
  dialogInfo.value = true;
};

const openEditDialog = (item) => {
  selectedItem.value = { ...item }; // создаем копию объекта, чтобы избежать прямого изменения данных
  dialogEdit.value = true;
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
  resetNewItem();
  newItem.value.tags = tag;
  console.log("newItem.tags", newItem.tags);
  dialogAdd.value = true;
};

const addItem = () => {
  props.addService(newItem.value);
  dialogAdd.value = false;
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
</script>

<style>
.my-2 {
  margin: 8px 0;
}
</style>
