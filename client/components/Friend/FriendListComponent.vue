<script setup lang="ts">
import FriendComponent from "@/components/Friend/FriendComponent.vue";
import FriendRequestForm from "@/components/Friend/FriendRequestForm.vue";
import FriendRequests from "@/components/Friend/FriendRequests.vue";
import JoinRoom from "@/components/Room/JoinRoom.vue";
import StatusDisplay from "@/components/Status/StatusDisplay.vue";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const loaded = ref(false);
const friends = ref<Array<string>>([]);

async function getFriends() {
  let allFriends;
  try {
    allFriends = await fetchy("/api/friends", "GET");
    console.log("allFriends", allFriends);
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
    <p class="card" v-for="friend in friends" :key="friend">
      <FriendComponent :friend="friend" @refreshFriends="getFriends" />
      <!-- <FocusScoreComponent :username="friend" /> -->
      <StatusDisplay :username="friend" />
      <JoinRoom :hostName="friend" />
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
  width: 30em;
}

section,
p {
  margin: 0 auto;
  max-width: 100em;
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

/* .friendItem {
  padding: 1em;
  border-radius: 1em;
} */
</style>
