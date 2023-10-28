import { fetchy } from "@/utils/fetchy";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useFocusScoreStore = defineStore(
  "focusscore",
  () => {
    const currentScore = ref(0);

    const getFocusScore = async (username: string) => {
      const scoreResult = await fetchy("/api/FocusScore", "GET", {
        query: { username: username },
      });
      console.log("scoreResult.score", scoreResult.score);
      return scoreResult.score;
    };

    const createFocusScore = async () => {
      await fetchy("/api/FocusScores", "POST");
      currentScore.value = 0;
    };

    const updateFocusScore = async (username: string, points: number) => {
      try {
        const scoreResult = await fetchy("/api/FocusScore/update", "PUT", {
          body: { username: username, points: points },
        });
        currentScore.value = scoreResult.score.score;
        console.log("currentScore.value", currentScore.value);
      } catch (e) {
        return;
      }
    };

    return {
      currentScore,
      createFocusScore,
      updateFocusScore,
      getFocusScore,
    };
  },
  { persist: true },
);
