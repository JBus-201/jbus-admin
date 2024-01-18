<template>
  <div>
    <GMapMap
      :center="{ lat: 31.9351052, lng: 35.7755961 }"
      :zoom="10"
      style="width: 100%; height: 100%; position: absolute"
    />
  </div>
</template>
  
  <script>
export default {
  data() {
    return {
      center: { lat: 32.0, lng: 32.0 },
      markers: [],
      places: [],
      currentPlace: null
    }
  }
}
</script>