<script setup lang="ts">
import RoomComponent from "@/components/Room/RoomComponent.vue";
const props = defineProps(["hostName"]);
const emit = defineEmits(["refreshScore1"]);
</script>

<template>
  <!-- getting the hostname from the route correctly? -->
  <RoomComponent :hostName="props.hostName" @refreshScore="$emit('refreshScore1')" />
</template>
