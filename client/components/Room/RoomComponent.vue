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
      const occupantScore = await getFocusScore(occupant);
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
    <section class="occupants card">
      <h4><b>In room:</b></h4>
      <span class="occupant" v-for="occupant in occupants" :key="occupant">
        <div>
          <img class="userIcon" src="@/assets/images/user-svgrepo-com.svg" />
        </div>
        <label>{{ occupant }}</label>
      </span>
    </section>
    <button class="btn btn-danger btn-sm" @click="removeUser">Leave Room</button>
  </section>
</template>

<style scoped>
.occupant {
  /* background-color: var(--base-bg); */
  border-radius: 1em;
  display: flex;
  flex-direction: row;
}
.userIcon {
  width: 20px;
  height: 20px;
  background-color: var(--base-bg);
  margin: 2px;
  border-radius: 100%;
}

.room {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.occupants {
}
</style>
