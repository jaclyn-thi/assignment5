<script setup lang="ts">
import PostListComponent from "@/components/Post/PostListComponent.vue";
import StatusDisplay from "@/components/Status/StatusDisplay.vue";
import StatusDropdown from "@/components/Status/StatusDropdown.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1>Home Page</h1>
    <section>
      <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
      <h1 v-else>Please login!</h1>
    </section>
    <PostListComponent />
    <StatusDropdown />
    <StatusDisplay />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
