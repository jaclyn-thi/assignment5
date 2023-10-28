<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const user = ref("");
let searchUser = ref("");
const error = ref(false);

async function sendFriendRequest(user: string) {
  try {
    await fetchy(`/api/friend/requests/${user}`, "POST");
  } catch {
    error.value = true;
  }
  return { msg: "Friend request sent!" };
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
    <h4 v-if="error" style="color: darkred">Already friends with user.</h4>
    <h1>Add Friend</h1>
    <input class="form-control-sm" type="text" v-model="user" placeholder="Username" required />
    <button type="submit" class="btn btn-outline-primary" @click="search(user)">Search</button>
  </section>
  <section class="addFriend" v-if="searchUser">
    <p>{{ searchUser }} <button class="btn btn-outline-primary" type="submit" @click="sendFriendRequest(searchUser)">Request</button></p>
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
