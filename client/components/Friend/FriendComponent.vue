<script setup lang="ts">
import { fetchy } from "../../utils/fetchy";

const emit = defineEmits(["refreshFriends"]);
const props = defineProps(["friend"]);

async function deleteFriend(friend: string) {
  try {
    await fetchy(`/api/friends/${friend}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshFriends");
}
</script>

<template>
  <div>{{ props.friend }} <button class="btn btn-outline-danger btn-sm" @click="deleteFriend(props.friend)">Delete</button></div>
</template>

<style></style>
