<script setup lang="ts">
import LeaderboardItem from "@/components/Leaderboard/LeaderboardItem.vue";
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
const leaderboardItems = ref();
const loaded = ref(false);

onBeforeMount(async () => {
  //view passes in hostName, use to get the room, occupants list, etc
  let leaderboardResults;
  try {
    leaderboardResults = await fetchy(`/api/leaderboard`, "GET"); //get info of host's room
    loaded.value = true;
  } catch (_) {
    return;
  }
  leaderboardItems.value = [...leaderboardResults];
});
</script>

<template>
  <h4 v-if="!loaded">Loading...</h4>
  <ol>
    <li v-for="item in leaderboardItems" :key="item"><LeaderboardItem :username="item.user" :score="item.score" /></li>
  </ol>
</template>

<style>
ol {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
