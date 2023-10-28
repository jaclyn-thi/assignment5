<script setup lang="ts">
import { useStatusStore } from "@/stores/status";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
const { currentStatus } = storeToRefs(useStatusStore());
const { getStatus } = useStatusStore();

const props = defineProps({ username: { type: String, default: "" } });

const displayedStatus = ref("");

onBeforeMount(async () => {
  let statusResult;
  try {
    statusResult = await getStatus(props.username);
  } catch (_) {
    return;
  }
  displayedStatus.value = statusResult;
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
