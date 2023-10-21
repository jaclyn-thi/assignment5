<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const user = ref("");
let searchUser = ref("");

async function sendFriendRequest(user: string) {
  try {
    await fetchy(`/api/friend/requests/${user}`, "POST");
  } catch {
    return { msg: "Friend request sent!" };
  }
}

async function search(user: string) {
  try {
    searchUser.value = (await fetchy(`/api/users/${user}`, "GET")).username;
  } catch {
    return { msg: "User not found!" };
  }
}
</script>

<template>
  <section class="search">
    <h1>Add Friend</h1>
    <input type="text" v-model="user" placeholder="Username" required />
    <button type="submit" @click="search(user)">Search</button>
  </section>
  <section class="addFriend" v-if="searchUser">
    <p>{{ searchUser }} <button type="submit" @click="sendFriendRequest(searchUser)">Request</button></p>
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
  max-width: 30em;
  padding: 1em;
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
</style>
