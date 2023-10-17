<script setup lang="ts">
import { ref } from "vue";

const props = defineProps(["selectedStatus"]);
const displayedStatus = ref(props.selectedStatus);

const updateDisplay = async (status: string) => {
  displayedStatus.value = status;
  return;
};
</script>

<template>
  <div @statusChange="updateDisplay">{{ displayedStatus }}</div>
</template>
