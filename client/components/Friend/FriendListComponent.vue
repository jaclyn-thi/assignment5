<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import FriendComponent from "@/components/Friend/FriendComponent.vue";
import FriendRequests from "@/components/Friend/FriendRequests.vue";
import FriendRequestForm from "@/components/Friend/FriendRequestForm.vue";

const loaded = ref(false);
const friends = ref<Array<string>>([]);

async function getFriends() {
  let allFriends;
  try {
    allFriends = await fetchy("/api/friends", "GET");
  } catch (_) {
    return;
  }
  friends.value = allFriends;
}

onBeforeMount(async () => {
  await getFriends();
  loaded.value = true;
});
</script>

<template>
  <h1>Friends</h1>
  <section class="friends" v-if="loaded">
    <p v-for="friend in friends" :key="friend">
      <FriendComponent :friend="friend" @refreshFriends="getFriends" />
    </p>
  </section>
  <section class="FriendRequestForm">
    <FriendRequestForm />
  </section>
  <section class="friendRequests">
    <FriendRequests @refreshFriends="getFriends" />
  </section>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.requests {
  padding: 1em;
}

h1 {
  text-align: center;
}
</style>
