<script setup lang="ts">
const props = defineProps(["username", "score"]);
</script>

<template>
  <div>
    <b>{{ props.username }}</b>
  </div>
  <div><b>Score: </b>{{ props.score }}</div>
</template>
