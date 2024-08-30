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
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
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

    // Use `data.data` to get items from servicesStore
    const items = computed(() => servicesStore.data?.data || []);

    onMounted(async () => {
      await servicesStore.getServices();
      // Debugging: log items to check if they are populated
      console.log(items.value);
    });

    const uniqueTags = computed(() => {
      const tags = new Set();
      items.value.forEach((item) => {
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
      return items.value.filter((item) => item.tags === tag);
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
    };
  },
};
</script>

<style>
.my-2 {
  margin: 8px 0;
}
</style>
