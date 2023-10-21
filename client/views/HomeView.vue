<script setup lang="ts">
import StatusDisplay from "@/components/Status/StatusDisplay.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <section>
      <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
      <h1 v-else>Please login!</h1>
      <p>Testing display status:</p>
      <StatusDisplay username="bee1" />
    </section>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
