<template>
  <!-- Main content -->

  <v-container>
    <h1>Сервисы</h1>

    <!-- Dynamically create expansion panels for each unique tag -->

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
  </v-container>
</template>

<style>
.my-2 {
  margin: 8px 0;
}
</style>

<script>
import { ref, computed, onMounted, toRefs } from "vue";
import { useRouter } from "vue-router";
import { useServicesStore } from "@/stores/services";

export default {
  setup() {
    const drawer = ref(false);
    const dialog = ref(false); // State for the dialog
    const selectedItem = ref(null); // Selected item for the dialog
    const activeTag = ref(null); // State for the active tag
    const isTagVisible = ref({}); // Object to manage visibility for each tag
    const panel = ref([]); // For controlling expansion panels
    const router = useRouter();

    const servicesStore = useServicesStore();
    const { data } = toRefs(servicesStore);

    // onMounted(async () => {
    //   await servicesStore.getServices();
    // });

    const menuItems = [
      { title: "Приложения", icon: "mdi-apps", route: "/applications" },
      { title: "Сервисы", icon: "mdi-server", route: "/services" },
      {
        title: "Виртуальные машины",
        icon: "mdi-virtual-reality",
        route: "/virtualmachines",
      },
    ];

    const items = [
      {
        id: 3,
        name: "Сервис мониторинга",
        url: "https://monitoring.example.com",
        description: "Сервис для мониторинга серверов и приложений.",
        login: "monitor_user",
        password: "monitor_pass123",
        tags: "мониторинг",
        image: "https://via.placeholder.com/200?text=Мониторинг", // Example image URL
        virtual_machine: null,
      },

      {
        id: 4,
        name: "1API для обработки платежей",
        url: "https://payments.example.com/api",
        description: "API для интеграции обработки платежей и транзакций.",
        login: "api_user",
        password: "api_secret_456",
        tags: "платежи",
        image: "https://via.placeholder.com/200?text=Платежи", // Example image URL
        virtual_machine: null,
      },
      {
        id: 6,
        name: "1Система управления пользователями",
        url: "https://users.example.com",
        description:
          "Система для управления учетными записями и правами пользователей.",
        login: "admin",
        password: "admin_pass789",
        tags: "администрирование",
        image: "https://via.placeholder.com/200?text=Администрирование", // Example image URL
        virtual_machine: null,
      },
      {
        id: 7,
        name: "2Система управления пользователями",
        url: "https://users.example.com",
        description:
          "Система для управления учетными записями и правами пользователей.",
        login: "admin",
        password: "admin_pass789",
        tags: "администрирование",
        image: "https://via.placeholder.com/200?text=Администрирование", // Example image URL
        virtual_machine: null,
      },
    ];

    const navigateTo = (route) => {
      router.push(route);
    };

    const uniqueTags = computed(() => {
      const tags = new Set();
      items.forEach((item) => {
        if (item.tags) {
          tags.add(item.tags);
        }
      });
      return Array.from(tags);
    });

    const filteredItems = (tag) => {
      if (!isTagVisible.value[tag]) return [];
      return items.filter((item) => item.tags === tag);
    };

    const toggleTagVisibility = (tag) => {
      if (activeTag.value === tag) {
        isTagVisible.value[tag] = !isTagVisible.value[tag];
      } else {
        activeTag.value = tag;
        isTagVisible.value = uniqueTags.value.reduce((acc, curr) => {
          acc[curr] = curr === tag;
          return acc;
        }, {});
      }
    };

    const openDialog = (item) => {
      selectedItem.value = item;
      dialog.value = true;
    };

    return {
      drawer,
      menuItems,
      uniqueTags,
      filteredItems,
      dialog,
      selectedItem,
      activeTag,
      isTagVisible,
      toggleTagVisibility,
      openDialog,
      panel,
    };
  },
};
</script>
