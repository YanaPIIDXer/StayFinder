<script lang="ts" setup>
import { ref} from "vue";

const emits = defineEmits<{
  (e: "search", value: string): void
}>();

const searchText = ref("");

/**
 * 検索した
 */
const onSearch = () => {
  if (!searchText.value) { return; }

  emits("search", searchText.value);
  searchText.value = "";
}

defineExpose({
  searchText,
});
</script>

<template lang="pug">
form(@submit.prevent="onSearch")
    input(type="text" v-model="searchText" placeholder="検索したいキーワード")
    input(type="submit" value="検索")
</template>

<style lang="sass" scoped>
</style>
