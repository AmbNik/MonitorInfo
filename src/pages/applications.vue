<template>
  <div>
    <div class="d-flex">
      <v-checkbox v-model="disabled" label="Disabled"></v-checkbox>
    </div>

    <v-expansion-panels v-model="panel" :disabled="disabled" multiple>
      <v-expansion-panel>
        <v-expansion-panel-title>Panel 1</v-expansion-panel-title>
        <v-expansion-panel-text>
          <!-- Replace 'Some content' with a row of cards -->
          <v-row>
            <v-col cols="12" md="4" v-for="item in cards" :key="item.id">
              <v-card class="my-2" outlined>
                <v-card-title>{{ item.title }}</v-card-title>
                <v-card-subtitle>{{ item.subtitle }}</v-card-subtitle>
                <v-card-text>
                  {{ item.text }}
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-title>Panel 2</v-expansion-panel-title>
        <v-expansion-panel-text>
          <!-- Replace 'Some content' with a row of cards -->
          <v-row>
            <v-col cols="12" md="4" v-for="item in cards" :key="item.id">
              <v-card class="my-2" outlined>
                <v-card-title>{{ item.title }}</v-card-title>
                <v-card-subtitle>{{ item.subtitle }}</v-card-subtitle>
                <v-card-text>
                  {{ item.text }}
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-title>Panel 3</v-expansion-panel-title>
        <v-expansion-panel-text>
          <!-- Replace 'Some content' with a row of cards -->
          <v-row>
            <v-col cols="12" md="4" v-for="item in cards" :key="item.id">
              <v-card class="my-2" outlined>
                <v-card-title>{{ item.title }}</v-card-title>
                <v-card-subtitle>{{ item.subtitle }}</v-card-subtitle>
                <v-card-text>
                  {{ item.text }}
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const disabled = ref(false);
    const panel = ref([]);

    const cards = [
      { id: 1, title: "Card 1", subtitle: "Subtitle 1", text: "Content 1" },
      { id: 2, title: "Card 2", subtitle: "Subtitle 2", text: "Content 2" },
      { id: 3, title: "Card 3", subtitle: "Subtitle 3", text: "Content 3" },
      // Add more card objects as needed
    ];

    return { disabled, panel, cards };
  },
};
</script>

<style scoped>
.my-2 {
  margin: 8px 0;
}
</style>
