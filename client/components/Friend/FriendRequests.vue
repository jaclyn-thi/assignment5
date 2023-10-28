<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const { currentUsername } = storeToRefs(useUserStore());

let requests = ref<Array<Record<string, string>>>([]);

const loaded = ref(false);
const { isLoggedIn } = storeToRefs(useUserStore());
const emit = defineEmits(["refreshFriends"]);

async function reject(friend: string) {
  try {
    await fetchy(`/api/friend/reject/${friend}`, "PUT");
  } catch {
    return;
  }
  await getRequests();
}

async function accept(friend: string) {
  try {
    await fetchy(`/api/friend/accept/${friend}`, "PUT");
  } catch {
    return;
  }
  emit("refreshFriends");
  await getRequests();
}

async function getRequests() {
  let currentRequests;
  try {
    currentRequests = await fetchy(`/api/friend/requests`, "GET");
  } catch {
    return;
  }
  requests.value = currentRequests;
}

onBeforeMount(async () => {
  await getRequests();
  loaded.value = true;
});
</script>

<template>
  <section v-if="isLoggedIn">
    <section class="requests" v-if="loaded && requests.length !== 0">
      <h3>Friend Requests</h3>
      <div v-for="request in requests" :key="request._id">
        <section class="card" v-if="request.status === 'pending' && request.from !== currentUsername">
          <h4>{{ request.from }}</h4>
          <button class="btn btn-outline-primary" @click="accept(request.from)">Accept</button>
          <button class="btn btn-outline-danger" @click="reject(request.from)">Reject</button>
        </section>
        <div v-else class="nothing"></div>
      </div>
    </section>
    <p v-else-if="loaded">No friends found</p>
    <p v-else>Loading...</p>
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

.nothing {
  padding: 0;
  margin: 0;
}
</style>
