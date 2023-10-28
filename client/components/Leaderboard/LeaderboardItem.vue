<script setup lang="ts">
import JoinRoom from "@/components/Room/JoinRoom.vue";
const props = defineProps(["username", "score"]);
</script>

<template>
  <div class="card">
    <div>
      <h5 class="card-title">Username: {{ props.username }}</h5>
    </div>
    <div><b>Score: </b>{{ props.score }}</div>
    <JoinRoom :hostName="props.username" />
  </div>
</template>

<style>
.card {
  width: 30em;
  padding: 1em;
  margin: 1em;
}
</style>
