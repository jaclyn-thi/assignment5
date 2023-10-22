<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const displayedScore = ref(Number);
const props = defineProps({ username: { type: String, default: "" } });

onBeforeMount(async () => {
  let scoreResult;
  try {
    scoreResult = await fetchy("/api/FocusScore", "GET", {
      query: { username: props.username },
    });
  } catch (_) {
    scoreResult = await fetchy("/api/FocusScore", "POST");
    return;
  }
  displayedScore.value = scoreResult.score;
});
</script>
