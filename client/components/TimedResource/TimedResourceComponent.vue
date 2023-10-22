<script setup lang="ts">
import VueCountdown from "@chenfengyuan/vue-countdown";
</script>

<!-- Adapt for final use -->
<template>
  <VueCountdown :time="2 * 24 * 60 * 60 * 1000" v-slot="{ days, hours, minutes, seconds }">
    Time Remaining：{{ days }} days, {{ hours }} hours, {{ minutes }} minutes, {{ seconds }} seconds.
  </VueCountdown>
</template>
