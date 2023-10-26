<script setup lang="ts">
import RoomComponent from "@/components/Room/RoomComponent.vue";
const props = defineProps(["hostName"]);
</script>

<template>
  <!-- getting the hostname from the route correctly? -->
  <RoomComponent :hostName="props.hostName" />
</template>
