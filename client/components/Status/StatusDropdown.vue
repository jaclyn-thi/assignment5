<script setup lang="ts">
import { useStatusStore } from "@/stores/status";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
const { currentUsername } = storeToRefs(useUserStore());
const { currentStatus } = storeToRefs(useStatusStore());
const { updateStatus } = useStatusStore();

const emit = defineEmits(["statusChange"]);
const selectedStatus = ref("");

//might just chop status

// const updateStatus = async (status: string) => {
//   try {
//     await fetchy("/api/status", "PUT", {
//       body: { newStatus: status },
//     });
//   } catch (e) {
//     return;
//   }
//   emit("statusChange", status);
// };

onBeforeMount(async () => {
  let statusResult;
  try {
    statusResult = await fetchy("/api/status", "GET", {
      query: { username: currentUsername.value },
    });
    await updateStatus(statusResult.status.statusType);
  } catch (_) {
    return;
  }
  selectedStatus.value = statusResult.status.statusType;
});
</script>

<template>
  <!-- Known issue with this portion calling the updateStatus function properly -->
  <select name="statusDropdown" id="statusDropdown" v-model="selectedStatus" @change="() => updateStatus(selectedStatus)">
    <option value="Online">🟢 Online</option>
    <option value="Offline">🔴 Offline</option>
    <option value="Away">🟡 Away</option>
    <option value="Focus">🟣 Focus</option>
  </select>
  <!-- <label>{{ selectedStatus }}</label> -->
</template>
