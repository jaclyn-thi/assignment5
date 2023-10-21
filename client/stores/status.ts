import { fetchy } from "@/utils/fetchy";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useStatusStore = defineStore(
  "status",
  () => {
    const currentStatus = ref("");
    const hasStatus = computed(() => currentStatus.value !== "");

    const createStatus = async () => {
      await fetchy("/api/status", "POST");
      await updateStatus("Online");
    };

    const updateStatus = async (newStatus: string) => {
      await fetchy("/api/status", "POST", {
        body: { newStatus },
      });
    };

    return {
      currentStatus,
      hasStatus,
      createStatus,
      updateStatus,
    };
  },
  { persist: true },
);
