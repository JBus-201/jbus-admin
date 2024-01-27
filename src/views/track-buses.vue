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
import { location } from '@/firebase/init.js'
export default {
  data() {
    return {
      markers: [],
      places: [],
      currentPlace: null,
      viewPath: null
    }
  },
  created() {
    console.log("location from track-buses", location)
    this.viewPath = { lat: 31.9351052, lng: 35.7755961 }
    this.center = { lat: 31.9351052, lng: 35.7755961 }
  }
}
</script>
