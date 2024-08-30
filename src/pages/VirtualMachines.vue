<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app temporary width="300">
      <v-list dense>
        <v-list-item
          v-for="(item, index) in menuItems"
          :key="index"
          link
          @click="navigateTo(item.route)"
        >
          <v-list-item
            :prepend-icon="item.icon"
            :title="item.title"
          ></v-list-item>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- App bar -->
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>Мое приложение</v-toolbar-title>
    </v-app-bar>

    <v-main>
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
    </v-main>

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
  </v-app>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useServicesStore } from "@/stores/services";

export default {
  setup() {
    const panel = ref([]);
    const drawer = ref(false);
    const dialog = ref(false);
    const selectedItem = ref(null);
    const router = useRouter();

    const servicesStore = useServicesStore();
    const { data } = toRefs(servicesStore);

    onMounted(async () => {
      await servicesStore.getServices();
    });
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
      {
        id: 8,
        name: "2API для обработки платежей",
        url: "https://payments.example.com/api",
        description: "API для интеграции обработки платежей и транзакций.",
        login: "api_user",
        password: "api_secret_456",
        tags: "платежи",
        image: "https://via.placeholder.com/200?text=Платежи", // Example image URL
        virtual_machine: null,
      },
      {
        id: 9,
        name: "2Сервис мониторинга",
        url: "https://monitoring.example.com",
        description: "Сервис для мониторинга серверов и приложений.",
        login: "monitor_user",
        password: "monitor_pass123",
        tags: "мониторинг",
        image: "https://via.placeholder.com/200?text=Мониторинг", // Example image URL
        virtual_machine: null,
      },
      {
        id: 10,
        name: "3Система управления пользователями",
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
        id: 11,
        name: "3API для обработки платежей",
        url: "https://payments.example.com/api",
        description: "API для интеграции обработки платежей и транзакций.",
        login: "api_user",
        password: "api_secret_456",
        tags: "платежи",
        image: "https://via.placeholder.com/200?text=Платежи", // Example image URL
        virtual_machine: null,
      },
      {
        id: 12,
        name: "3Сервис мониторинга",
        url: "https://monitoring.example.com",
        description: "Сервис для мониторинга серверов и приложений.",
        login: "monitor_user",
        password: "monitor_pass123",
        tags: "мониторинг",
        image: "https://via.placeholder.com/200?text=Мониторинг", // Example image URL
        virtual_machine: null,
      },
      {
        id: 13,
        name: "4Система управления пользователями",
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
        id: 14,
        name: "4API для обработки платежей",
        url: "https://payments.example.com/api",
        description: "API для интеграции обработки платежей и транзакций.",
        login: "api_user",
        password: "api_secret_456",
        tags: "платежи",
        image: "https://via.placeholder.com/200?text=Платежи", // Example image URL
        virtual_machine: null,
      },
      {
        id: 15,
        name: "4Сервис мониторинга",
        url: "https://monitoring.example.com",
        description: "Сервис для мониторинга серверов и приложений.",
        login: "monitor_user",
        password: "monitor_pass123",
        tags: "мониторинг",
        image: "https://via.placeholder.com/200?text=Мониторинг", // Example image URL
        virtual_machine: null,
      },
    ];

    const uniqueTags = computed(() => {
      const tags = new Set();
      items.forEach((item) => {
        if (item.tags) {
          tags.add(item.tags);
        }
      });
      return Array.from(tags);
    });

    const menuItems = [
      { title: "Приложения", icon: "mdi-apps", route: "/applications" },
      { title: "Сервисы", icon: "mdi-server", route: "/services" },
      {
        title: "Виртуальные машины",
        icon: "mdi-virtual-reality",
        route: "/virtualmachines",
      },
    ];

    const filteredItems = (tag) => {
      return items.filter((item) => item.tags === tag);
    };

    const openDialog = (item) => {
      selectedItem.value = item;
      dialog.value = true;
    };
    const navigateTo = (route) => {
      router.push(route);
    };
    return {
      drawer,
      panel,
      uniqueTags,
      filteredItems,
      dialog,
      selectedItem,
      openDialog,
      menuItems,
      data,
    };
  },
};
</script>

<style>
.my-2 {
  margin: 8px 0;
}
</style>
