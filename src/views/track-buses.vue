<template>
  <div>
    <GMapMap
      :center="center"
      :zoom="11"
      style="height: 100%; position: absolute"
      :options="{
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false
      }"
    >
      <GMapMarker :position="viewPath" />
    </GMapMap>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { location } from '@/firebase/init.js';

export default {
  data() {
    return {
      markers: [],
      places: [],
      currentPlace: null,
      viewPath: { lat: 31.9351052, lng: 35.7755961 },
      center: { lat: 31.9351052, lng: 35.7755961 }
    }
  },
  created() {
    const reactiveLocation = ref(location); // Make the location variable reactive

    watch(reactiveLocation, (newLocation) => {
      console.log("value changed");
      this.viewPath = {
        lat: newLocation.latitude,
        lng: newLocation.longitude
      };
      this.center = {
        lat: newLocation.latitude,
        lng: newLocation.longitude
      };
    });
  }
}
</script>
