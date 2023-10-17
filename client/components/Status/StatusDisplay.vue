<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";

const { currentUsername } = storeToRefs(useUserStore());
const getStatus = async (username: string) => {
  try {
    await fetchy("/api/status", "GET", {
      body: username,
    });
  } catch (_) {
    return;
  }
};
</script>

<template>
  <div></div>
</template>
