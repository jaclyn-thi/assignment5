<script setup lang="ts">
import FriendComponent from "@/components/Friend/FriendComponent.vue";
import FriendListComponent from "@/components/Friend/FriendListComponent.vue";
import FriendRequestForm from "@/components/Friend/FriendRequestForm.vue";
import FriendRequests from "@/components/Friend/FriendRequests.vue";
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
      <FriendComponent />
      <FriendRequestForm />
      <FriendRequests />
      <FriendListComponent />
    </section>
  </main>
</template>
