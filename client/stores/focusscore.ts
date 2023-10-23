import { fetchy } from "@/utils/fetchy";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useFocusScoreStore = defineStore(
  "focusscore",
  () => {
    const currentScore = ref(0);

    const createFocusScore = async () => {
      await fetchy("/api/FocusScores", "POST");
      currentScore.value = 0;
    };

    const updateFocusScore = async (points: number) => {
      try {
        const scoreResult = await fetchy("/api/FocusScore/update", "PUT", {
          body: { points: points },
        });
        currentScore.value = scoreResult.score.score;
      } catch (e) {
        return;
      }
      //emit("statusChange", status); can emit after calling
    };

    return {
      currentScore,
      createFocusScore,
      updateFocusScore,
    };
  },
  { persist: true },
);
