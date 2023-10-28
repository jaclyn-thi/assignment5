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
  emit("timerStart", duration.value);
}

function onCountdownEnd() {
  counting.value = false;

  //signal to parent room
  emit("rewardRoom", duration.value);
}
</script>

<!-- Adapt for final use -->
<template>
  <div class="countdown">
    <VueCountdown v-if="counting" :time="duration * 60 * 1000" v-slot="{ hours, minutes, seconds }" @end="onCountdownEnd">
      <h3>Time Remaining：{{ hours }} hours, {{ minutes }} minutes, {{ seconds }} seconds</h3>
    </VueCountdown>
    <h3 v-else>Enter focus duration (in minutes):</h3>
    <input class="form-control" v-model="duration" type="text" />
    <div><button class="btn btn-primary" @click="startCountdown">Start</button> <button class="btn btn-primary" @click="abortCountdown">Abort Timer</button></div>
  </div>
</template>

<style>
.countdown {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.form-control {
  max-width: 10em;
  text-align: center;
  font-size: 30px;
  margin: 0.5em;
}
</style>
