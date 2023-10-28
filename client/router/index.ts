import { storeToRefs } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import FriendView from "../views/FriendView.vue";
import HomeView from "../views/HomeView.vue";
import LeaderboardView from "../views/LeaderboardView.vue";
import LoginView from "../views/LoginView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import RoomView from "../views/RoomView.vue";
import SettingView from "../views/SettingView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/setting",
      name: "Settings",
      component: SettingView,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
      meta: { requiresAuth: false },
      beforeEnter: (to, from) => {
        const { isLoggedIn } = storeToRefs(useUserStore());
        if (isLoggedIn.value) {
          return { name: "Settings" };
        }
      },
    },
    {
      path: "/friends",
      name: "Friends",
      component: FriendView,
      meta: { requiresAuth: true },
    },
    {
      path: "/rooms/:hostName",
      name: "Room",
      component: RoomView,
      meta: { requiresAuth: true },
      props: true,
    },
    {
      path: "/leaderboard",
      name: "Leaderboard",
      component: LeaderboardView,
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: NotFoundView,
    },
  ],
});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach(async (to, from) => {
  // if in a room URL and going to a room that is not that room URL, extract the room ID from the room URL and use it to remove the session user
  // from the room
  const { isLoggedIn, currentUsername } = storeToRefs(useUserStore());

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { name: "Login" };
  }

  //if navigating out of a room, remove user from that room
  if (from.name === "Room" && to.name !== "Room") {
    console.log("Leaving room!");
    const hostName = from.params.hostName;
    await fetchy(`/api/room/occupants/${hostName}`, "DELETE", {
      query: { username: currentUsername.value },
    });
  }
});

// router.beforeEach(async (to, from) => {
//   // if in a room URL and going to a room that is not that room URL, extract the room ID from the room URL and use it to remove the session user
//   // from the room
//   const { isLoggedIn } = storeToRefs(useUserStore());

//   if (to.meta.requiresAuth && !isLoggedIn.value) {
//     return { name: "Login" };
//   }

//   //if navigating out of a room, remove user from that room
//   if (from.name === "Room" && from.path !== to.path) {
//     const hostName = from.params.hostName;
//     await fetchy(`/api/room/occupants/${hostName}`, "DELETE", {
//       query: { username: currentUsername.value },
//     });
//   }
// });

export default router;
