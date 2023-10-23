<script setup lang="ts">
import { useFocusScoreStore } from "@/stores/focusscore";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const displayedScore = ref(0);
const props = defineProps({ username: { type: String, default: "" }, points: { type: Number, default: 0 } });
const { currentScore } = storeToRefs(useFocusScoreStore());
const { createFocusScore, updateFocusScore, getFocusScore } = useFocusScoreStore();

async function updateScore(points: number) {
  try {
    // await fetchy("/api/FocusScore", "POST", {
    //   body: { username: props.username, points: points },
    // });
    await updateFocusScore(props.username, points);
    displayedScore.value = currentScore.value;
  } catch (_) {
    return;
  }
}

onBeforeMount(async () => {
  let scoreResult;
  try {
    // scoreResult = await fetchy("/api/FocusScore", "GET", {
    //   query: { username: props.username },
    // });
    scoreResult = await getFocusScore(props.username);
    console.log(scoreResult);
  } catch (_) {
    console.log("Error");
    return;
  }
  displayedScore.value = scoreResult;
});
</script>

<template>
  <label><b>FocusScore:</b> {{ displayedScore }}</label>
  <!-- for testing purposes: -->
  <button @click="updateScore(100)">Add 100</button>
</template>
