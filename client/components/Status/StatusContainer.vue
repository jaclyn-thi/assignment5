<script setup lang="ts">
import { useStatusStore } from "@/stores/status";
import { storeToRefs } from "pinia";
const { currentStatus } = storeToRefs(useStatusStore());

import StatusDropdown from "./StatusDropdown.vue";
</script>

<template>
  <div class="container">
    <label class="userStatus"><b>Status:</b>{{ currentStatus }}</label>
    <StatusDropdown />
  </div>
</template>

<style scoped>
.userStatus {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}
/* .container {
  display: flex;
  flex-direction: row;
} */
</style>
