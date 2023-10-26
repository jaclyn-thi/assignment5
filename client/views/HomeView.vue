<script setup lang="ts">
import FocusScoreComponent from "@/components/FocusScore/FocusScoreComponent.vue";
import JoinRoom from "@/components/Room/JoinRoom.vue";
import RoomComponent from "@/components/Room/RoomComponent.vue";
import StatusDisplay from "@/components/Status/StatusDisplay.vue";
import TimedResourceComponent from "@/components/TimedResource/TimedResourceComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <section>
      <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
      <h1 v-else>Please login!</h1>
      <p>Testing display status:</p>
      <StatusDisplay username="bee1" />
      <TimedResourceComponent />
      <p>Testing focusscore for user coffee:</p>
      <FocusScoreComponent username="coffee" />
      <p>Testing room component (user: crabby)</p>
      <RoomComponent hostName="crabby" />
      <JoinRoom hostName="crabby" />
    </section>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
