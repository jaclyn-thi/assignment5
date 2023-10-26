<script setup lang="ts">
import FocusScoreComponent from "@/components/FocusScore/FocusScoreComponent.vue";
import JoinRoom from "@/components/Room/JoinRoom.vue";
import StatusContainer from "@/components/Status/StatusContainer.vue";
import { useFocusScoreStore } from "@/stores/focusscore";
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";

const { updateFocusScore } = useFocusScoreStore();
const { currentUsername } = storeToRefs(useUserStore());

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());

// Make sure to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  try {
    await userStore.updateSession();
  } catch {
    // User is not logged in
  }
});
</script>

<template>
  <header>
    <nav>
      <div class="title">
        <img src="@/assets/images/logo.svg" />
        <RouterLink :to="{ name: 'Home' }">
          <h1>Productive.io</h1>
        </RouterLink>
      </div>
      <ul>
        <li>
          <RouterLink :to="{ name: 'Home' }" :class="{ underline: currentRouteName == 'Home' }"> Home </RouterLink>
        </li>
        <li>
          <p>My FocusRoom:</p>
          <JoinRoom :hostName="currentUsername" />
        </li>
        <li>
          <StatusContainer v-if="isLoggedIn" />
        </li>
        <li>
          <FocusScoreComponent v-if="isLoggedIn" :username="currentUsername" />
        </li>
        <li v-if="isLoggedIn">
          <RouterLink :to="{ name: 'Friends' }" :class="{ underline: currentRouteName == 'Friends' }"> Friends </RouterLink>
          <RouterLink :to="{ name: 'Settings' }" :class="{ underline: currentRouteName == 'Settings' }"> Settings </RouterLink>
        </li>
        <li v-else>
          <RouterLink :to="{ name: 'Login' }" :class="{ underline: currentRouteName == 'Login' }"> Login </RouterLink>
        </li>
      </ul>
    </nav>
    <article v-if="toast !== null" class="toast" :class="toast.style">
      <p>{{ toast.message }}</p>
    </article>
  </header>
  <RouterView />
</template>

<style scoped>
@import "./assets/toast.css";

nav {
  padding: 1em 2em;
  background-color: lightgray;
  display: flex;
  align-items: center;
}

h1 {
  font-size: 2em;
  margin: 0;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

img {
  height: 2em;
}

a {
  font-size: large;
  color: black;
  text-decoration: none;
}

ul {
  list-style-type: none;
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 1em;
}

.underline {
  text-decoration: underline;
}
</style>
