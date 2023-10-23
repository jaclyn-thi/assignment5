import { fetchy } from "@/utils/fetchy";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useStatusStore = defineStore(
  "status",
  () => {
    const currentStatus = ref("");

    const getStatus = async (username: string) => {
      let statusResult;
      try {
        statusResult = await fetchy("/api/status", "GET", {
          query: { username: username },
        });
      } catch (_) {
        return "Online";
      }
      return statusResult.status.statusType;
    };

    const createStatus = async () => {
      await fetchy("/api/status", "POST");
      currentStatus.value = "Online";
    };

    //copied straight over from statusDropdown
    const updateStatus = async (status: string) => {
      try {
        await fetchy("/api/status", "PUT", {
          body: { newStatus: status },
        });
        currentStatus.value = status;
      } catch (e) {
        return;
      }
      //emit("statusChange", status); can emit after calling
    };

    return {
      currentStatus,
      createStatus,
      updateStatus,
      getStatus,
    };
  },
  { persist: true },
);
