<script setup lang="ts">
import { ref, onMounted } from "vue";
import { GoogleMaps } from "./modules/GoogleMaps";

let maps: GoogleMaps | null = null;
const mapRef = ref<HTMLDivElement | null>(null);

const searchText = ref("");

/**
 * 場所検索
 */
const onSearchPlace = async () => {
  if (!maps || !searchText.value) { return; }
  
  const results = await maps.findPlaceFromQuery(searchText.value);
  console.log(results);

  searchText.value = "";
}

onMounted(async() => {
  maps = new GoogleMaps(mapRef.value!);
  await maps.init();
});

defineExpose({
  searchText,
  onSearchPlace,
});
</script>

<template lang="pug">
.root
  .map(ref="mapRef")
  form(@submit.prevent="onSearchPlace")
    input(type="text" v-model="searchText" placeholder="検索したいキーワード")
    input(type="submit" value="検索")
</template>

<style lang="sass" scoped>
.root
  .map
    width: 512px
    height: 512px
    border: 1px solid #000000
</style>
