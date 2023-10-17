<script setup lang="ts">
import { fetchy } from "../../utils/fetchy";
//import { ref } from "vue";

const emit = defineEmits(["statusChange"]);
// const selectedStatus = ref("");

const updateStatus = async (status: string) => {
  console.log("in function");
  console.log("status:", status);
  try {
    await fetchy("/api/status/:user", "PUT", {
      body: status,
    });
  } catch (e) {
    console.log(e);
    console.log("error found");
    return;
  }
  emit("statusChange", status);
  console.log(status);
};
</script>

<template>
  <!-- Known issue with this portion calling the updateStatus function properly -->
  <select name="statusDropdown" id="statusDropdown" onchange="updateStatus(this.value)">
    <option value="Online" @click="updateStatus('Online')">Online</option>
    <option value="Offline" @click="updateStatus('Offline')">Offline</option>
    <option value="Away" @click="updateStatus('Away')">Away</option>
    <option value="Focus" @click="updateStatus('Focus')">Focus</option>
  </select>
</template>
