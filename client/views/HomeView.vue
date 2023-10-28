<script setup lang="ts">
import LeaderboardComponent from "@/components/Leaderboard/LeaderboardComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <section>
      <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
      <h1 v-else>Please login!</h1>
      <h4 v-if="isLoggedIn">Join a FocusRoom to increase your FocusScore!</h4>
      <!-- <p>Testing display status:</p>
      <StatusDisplay username="bee1" />
      <TimedResourceComponent />
      <p>Testing focusscore for user coffee:</p>
      <FocusScoreComponent username="coffee" />
      <p>Testing room component (user: crabby)</p>
      <RoomComponent hostName="crabby" />
      <JoinRoom hostName="crabby" /> -->
      <section class="HomepageSquares container-fluid">
        <div class="row">
          <section class="col-sm">
            <LeaderboardComponent />
          </section>
        </div>
      </section>
    </section>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
/* .HomepageSquares {
  display: flex;
  flex-direction: row;
  margin: 1em;
  justify-content: space-between;
  justify-self: center;
} */
</style>
