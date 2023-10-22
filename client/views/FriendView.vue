<script setup lang="ts">
import FriendListComponent from "@/components/Friend/FriendListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <section>
      <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
      <h1 v-else>Please login to see friends!</h1>
      <p>Testing friend display:</p>
      <FriendListComponent />
    </section>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
