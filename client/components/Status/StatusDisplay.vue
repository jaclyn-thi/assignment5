<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps({ username: { type: String, default: "" } });

const displayedStatus = ref("");

// const updateStatus = async () => {
//   try {
//     let status = await fetchy("/api/status", "GET");
//     console.log("status", status);
//     displayedStatus.value = status;
//   } catch (e) {
//     console.log(e);
//     console.log("error found");
//     return;
//   }
//   console.log(status);
// };

onBeforeMount(async () => {
  let statusResult;
  try {
    statusResult = await fetchy("/api/status", "GET", {
      query: { username: props.username },
    });
  } catch (_) {
    statusResult = "Online";
  }
  displayedStatus.value = statusResult.status.statusType;
});
</script>

<template>
  <div>{{ displayedStatus }}</div>
</template>

<style scoped>
div {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}
</style>
