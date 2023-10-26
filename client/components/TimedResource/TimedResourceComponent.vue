<script setup lang="ts">
import VueCountdown from "@chenfengyuan/vue-countdown";
import { ref } from "vue";
const counting = ref(false);
const duration = ref(0);
const emit = defineEmits(["rewardRoom", "timerStart"]);

function abortCountdown() {
  counting.value = false;
}

function startCountdown() {
  counting.value = true;
  emit("timerStart");
}

function onCountdownEnd() {
  counting.value = false;

  //signal to parent room
  emit("rewardRoom");
}
</script>

<!-- Adapt for final use -->
<template>
  <VueCountdown v-if="counting" :time="duration * 60 * 1000" v-slot="{ hours, minutes, seconds }" @end="onCountdownEnd">
    <h3>Time Remaining：{{ hours }} hours, {{ minutes }} minutes, {{ seconds }} seconds</h3>
  </VueCountdown>
  <h3 v-else>Enter focus duration (in minutes): <input v-model="duration" type="text" /></h3>
  <button @click="startCountdown">Start</button>
  <button @click="abortCountdown">Abort Timer</button>
</template>
