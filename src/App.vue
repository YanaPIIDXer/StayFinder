<script setup lang="ts">
import { ref, onMounted } from "vue";
import { loadGoogleMaps } from "./modules/GoogleMaps";

onMounted(async() => {
  const googleMaps = await loadGoogleMaps();
});
</script>

<template lang="pug">
.root
</template>

<style lang="sass" scoped>
</style>
