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
const markers: google.maps.Marker[] = [];

/**
 * マーカー除去
 */
const clearMarkers = () => {
  markers.forEach(m => {
    m.setMap(null);
  })
  markers.splice(0);
};

/**
 * 場所検索
 */
const onSearchPlace = async (place: string) => {
  if (!maps) { return; }

  // 一旦マーカーを除去
  clearMarkers();
  
  // 目的地を検索
  const results = (await maps.findPlaceFromQuery(place, ["name"])).map<StayPlace>(r => {
    return {
      name: r.name!,
      lat: r.geometry?.location?.lat()!,
      lng: r.geometry?.location?.lng()!,
    }
  });
  if (!results.length) { return; }

  // 目的地にマーカーを付ける
  const { lat, lng } = results[0];
  markers.push(maps.addMarker(lat, lng, {
    label: {
      text: results[0].name,
      color: "#FF0000",
      fontSize: "12px",
    }
  }));

  // 宿泊施設を列挙
  const lodgings = (await maps.findNearBy(results[0].lat, results[0].lng, 500, "lodging")).map(l => {
    return {
      name: l.name!,
      lat: l.geometry?.location?.lat()!,
      lng: l.geometry?.location?.lng()!,
    }
  });
  lodgings.forEach(l => {
    if (!maps) { return; }
    markers.push(maps.addMarker(l.lat, l.lng, {
      label: {
        text: l.name,
        color: "#00FFFF",
        fontSize: "6px",
      }
    }));

  })
};

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
