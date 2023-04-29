<script setup lang="ts">
import { ref, onMounted } from "vue";
import { GoogleMaps } from "./modules/GoogleMaps";
import type { StayPlace } from "./interfaces/StayPlace";
// ↓setup構文だからexportもクソもないのに「exportしろよ」と出るので
//  defineExposeが悪さしてるとか・・・？
// @ts-ignore
import SearchForm from "./components/SearchForm.vue";

let maps: GoogleMaps | null = null;
const mapRef = ref<HTMLDivElement | null>(null);

/**
 * 場所検索
 */
const onSearchPlace = async (place: string) => {
  if (!maps) { return; }
  
  const results = (await maps.findPlaceFromQuery(place, ["name"])).map<StayPlace>(r => {
    return {
      name: r.name!,
      lat: r.geometry?.location?.lat()!,
      lng: r.geometry?.location?.lng()!,
    }
  });
  if (results.length) {
    const { lat, lng } = results[0];
    const marker = maps.addMarker(lat, lng);
    marker.setTitle(results[0].name);
  }
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
