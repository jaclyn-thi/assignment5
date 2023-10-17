<script setup lang="ts">
import { fetchy } from "../../utils/fetchy";
const emit = defineEmits(["statusChange"]);

const updateStatus = async (status: string) => {
  try {
    await fetchy("/api/status/:user", "PUT", {
      body: status,
    });
  } catch (_) {
    return;
  }
  emit("statusChange", status);
};
</script>

<template>
  <select name="statusDropdown" id="statusDropdown">
    <option value="Online" @click="updateStatus('Online')">Online</option>
    <option value="Offline" @click="updateStatus('Offline')">Offline</option>
    <option value="Away" @click="updateStatus('Away')">Away</option>
    <option value="Focus" @click="updateStatus('Focus')">Focus</option>
  </select>
</template>
