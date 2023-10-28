<script setup lang="ts">
import TimedResourceComponent from "@/components/TimedResource/TimedResourceComponent.vue";
import { useFocusScoreStore } from "@/stores/focusscore";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import router from "../../router";
const { updateFocusScore, getFocusScore } = useFocusScoreStore();
const { currentUsername } = storeToRefs(useUserStore());

// contains all occupants in the room
const props = defineProps(["hostName"]);
const occupants = ref<Array<string>>([]);
const emit = defineEmits(["refreshScore"]);
const possiblePoints = ref(0);
const countingDown = ref(false);

const loaded = ref(false);

async function showPoints(duration: number) {
  possiblePoints.value = duration * (1 + occupants.value.length / 10);
  countingDown.value = true;
}

//write reward room function to be called when @rewardRoom event recieved
async function rewardUsers(duration: number) {
  try {
    for (const occupant of occupants.value) {
      console.log("occupant", occupant);
      const occupantScore = await getFocusScore(occupant);
      console.log("duration:", duration);
      console.log("occupantScore.score", occupantScore);
      console.log("(1 + occupants.value.length / 10)", 1 + occupants.value.length / 10);
      console.log("output score:", duration * (1 + occupants.value.length / 10));
      await updateFocusScore(occupant, duration * (1 + occupants.value.length / 10));

      countingDown.value = false;
    }
  } catch (_) {
    emit("refreshScore");
    return _;
  }
}

//user removes themselves from a room
async function removeUser() {
  try {
    // take user back to home page
    console.log("Calling removeUser");
    void router.push({ name: "Home" });
  } catch (_) {
    return _;
  }
}

onBeforeMount(async () => {
  //view passes in hostName, use to get the room, occupants list, etc
  let roomResult;
  let occupantResult;
  try {
    roomResult = await fetchy(`/api/rooms/${props.hostName}`, "GET"); //get info of host's room
    loaded.value = true;
    //set occupants of room

    occupantResult = await fetchy(`/api/room/occupants/${props.hostName}`, "GET");
    console.log(occupantResult);
    occupants.value = [...occupantResult.occupants];
    console.log("occupants", occupants.value);
  } catch (_) {
    return;
  }
});
</script>

<template>
  <section class="room">
    <h1>{{ props.hostName }}'s Focus Room</h1>
    <p v-if="countingDown">Possible FocusPoints gained: {{ possiblePoints }}</p>
    <TimedResourceComponent @rewardRoom="rewardUsers" @timerStart="showPoints" />
    <section class="occupants">
      <p><b>In room:</b></p>
      <span class="occupant" v-for="occupant in occupants" :key="occupant">
        <img class="userIcon" src="@/assets/images/user-svgrepo-com.svg" />
        <label>{{ occupant }}</label>
      </span>
    </section>
    <button @click="removeUser">Leave Room</button>
  </section>
</template>

<style scoped>
.occupant {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: row;
  gap: 0.5em;
  padding: 1em;
  max-width: 50px;
  max-height: 100px;
}
.userIcon {
  width: 48px;
  height: 48px;
}

.room {
  align-items: center;
  border-color: rgb(176, 176, 176);
  border-style: solid;
}
</style>
