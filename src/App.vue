<script setup lang="ts">
import { ref, onMounted } from "vue";
import { GoogleMaps } from "./modules/GoogleMaps";
import SearchForm from "./components/SearchForm.vue";

let maps: GoogleMaps | null = null;
const mapRef = ref<HTMLDivElement | null>(null);

/**
 * 場所検索
 */
const onSearchPlace = async (place: string) => {
  if (!maps) { return; }
  
  const results = await maps.findPlaceFromQuery(place);
  console.log(results);
}

onMounted(async() => {
  maps = new GoogleMaps(mapRef.value!);
  await maps.init();
});

defineExpose({
  onSearchPlace,
  SearchForm,
});
</script>

<template lang="pug">
.root
  .map(ref="mapRef")
  SearchForm(@search="onSearchPlace")
</template>

<style lang="sass" scoped>
.root
  .map
    width: 512px
    height: 512px
    border: 1px solid #000000
</style>
