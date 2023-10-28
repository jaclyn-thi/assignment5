<script setup lang="ts">
import { useFocusScoreStore } from "@/stores/focusscore";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount } from "vue";

//const displayedScore = ref(0);
const props = defineProps({ username: { type: String, default: "" }, points: { type: Number, default: 0 } });
const { currentScore } = storeToRefs(useFocusScoreStore());
const { createFocusScore, updateFocusScore, getFocusScore } = useFocusScoreStore();

//for testing only
async function setScore(points: number) {
  try {
    await fetchy(`/api/FocusScore/set`, "PUT", {
      body: { points: points },
    });
  } catch (_) {
    return;
  }
}

async function updateScore(points: number) {
  try {
    await updateFocusScore(props.username, points);
  } catch (_) {
    return;
  }
}

onBeforeMount(async () => {
  let scoreResult;
  try {
    scoreResult = await getFocusScore(props.username);
    console.log(scoreResult);
  } catch (_) {
    console.log("Error");
    return;
  }
  currentScore.value = scoreResult;
});
</script>

<template>
  <label class="score"><b>FocusScore:</b> {{ currentScore }}</label>
  <!-- for testing -->
  <button @click="updateScore(100)">Add 100</button>
  <button @click="setScore(500)">Set to 500</button>
</template>

<style scoped>
.score {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
  margin: 1em;
}
</style>
