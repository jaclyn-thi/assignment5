<script setup lang="ts">
import FriendListComponent from "@/components/Friend/FriendListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <section>
      <h1 v-if="!isLoggedIn">Please login to see friends!</h1>
      <div v-else>
        <FriendListComponent />
      </div>
    </section>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
