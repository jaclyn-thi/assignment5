<script setup lang="ts">
//button to join a user's room will go here
//use props to get hostname
//button should route to the room's url (push)
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import router from "../../router";

const props = defineProps({ hostName: { type: String, default: "" } });
const { currentUsername } = storeToRefs(useUserStore());

//add user function here
//void router.push({ name: "Home" });
//can adjust to be addtofocusroom later
async function addUser() {
  try {
    await fetchy(`/api/room/occupants/${props.hostName}`, "PUT", {
      body: { username: currentUsername.value },
    });
    // take user to host's room
  } catch (_) {
    return _;
  }
  void router.push({ path: `/rooms/${props.hostName}` });
}
</script>

<template>
  <button @click="addUser">Join Focus Room</button>
</template>
