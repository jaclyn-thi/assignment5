<script setup lang="ts">
import { useStatusStore } from "@/stores/status";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
const { currentUsername } = storeToRefs(useUserStore());
const { currentStatus } = storeToRefs(useStatusStore());
const { updateStatus, getStatus } = useStatusStore();

const emit = defineEmits(["statusChange"]);
const selectedStatus = ref("");

const updateUserStatus = async (status: string) => {
  try {
    await updateStatus(status);
  } catch (e) {
    return;
  }
  emit("statusChange", status);
};

onBeforeMount(async () => {
  let statusResult;
  try {
    statusResult = await getStatus(currentUsername.value);
  } catch (_) {
    return;
  }
  selectedStatus.value = statusResult.status.statusType;
});
</script>

<template>
  <!-- Known issue with this portion calling the updateStatus function properly -->
  <select name="statusDropdown" id="statusDropdown" v-model="selectedStatus" @change="() => updateUserStatus(selectedStatus)">
    <option value="Online">🟢 Online</option>
    <option value="Offline">🔴 Offline</option>
    <option value="Away">🟡 Away</option>
    <option value="Focus">🟣 Focus</option>
  </select>
  <!-- <label>{{ selectedStatus }}</label> -->
</template>
