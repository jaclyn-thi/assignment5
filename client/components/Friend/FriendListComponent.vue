<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import FriendComponent from "@/components/Friend/FriendComponent.vue";
import FriendRequests from "@/components/Friend/FriendRequests.vue";

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
  <section class="addFriend">
    <AddFriend />
  </section>
  <section class="friendRequests">
    <FriendRequests @refreshFriends="getFriends" />
  </section>
</template>
