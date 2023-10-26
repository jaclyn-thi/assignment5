<script setup lang="ts">
import TimedResourceComponent from "@/components/TimedResource/TimedResourceComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import router from "../../router";
const { currentUsername } = storeToRefs(useUserStore());

// contains all occupants in the room
const props = defineProps(["hostName"]);
const occupants = ref<Array<string>>([]);

const loaded = ref(false);

//for user to remove themselves from a room

//write reward room function to be called when @rewardRoom event recieved

async function removeUser() {
  try {
    await fetchy(`/api/room/occupants/${props.hostName}`, "DELETE", {
      query: { username: currentUsername.value },
    });
    // take user back to home page
    void router.push({ name: "Home" });
  } catch (_) {
    return _;
  }
}

onBeforeMount(async () => {
  //view passes in hostName, use to get the room, occupants list, etc
  let roomResult;
  try {
    roomResult = await fetchy(`/api/rooms/${props.hostName}`, "GET"); //get info of host's room
    loaded.value = true;
    //set occupants of room
    //will this update properly??

    occupants.value = roomResult.occupants;
    console.log("occupants", occupants);

    // occupantResult = roomResult.occupants;
    // for (const occupantId in occupantResult) {
    //   const occupantName = await fetchy(`/users/username/:_id`, "GET");
    // }
  } catch (_) {
    return;
  }
});
</script>

<template>
  <section class="room">
    <h1>{{ props.hostName }}'s Focus Room</h1>
    <TimedResourceComponent />
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
