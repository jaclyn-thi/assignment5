<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const displayedScore = ref(Number);
const props = defineProps({ username: { type: String, default: "" }, points: { type: Number, default: 0 } });

async function updateScore(points: number) {
  try {
    await fetchy("/api/FocusScore", "POST", {
      body: { username: props.username, points: points },
    });
  } catch (_) {
    return;
  }
}

onBeforeMount(async () => {
  let scoreResult;
  try {
    scoreResult = await fetchy("/api/FocusScore", "GET", {
      query: { username: props.username },
    });
  } catch (_) {
    scoreResult = { score: 0 };
    return;
  }
  displayedScore.value = scoreResult.score;
});

defineExpose({
  updateScore,
});
</script>

<template>
  <label>FocusScore: </label>
  {{ displayedScore }}
</template>
