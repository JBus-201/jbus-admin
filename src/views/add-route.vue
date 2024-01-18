<template>
  <div style="display: flex; width: 100%; height: 100%">
    <v-form style="width: 34%; padding: 20px">
      <v-container>
        <v-row>
          <v-text-field label="Route Name" v-model="routeName" />
          <v-checkbox label="Going" v-model="going" />
        </v-row>
        <v-row><v-label>Starting Point Coordinates</v-label></v-row>
        <v-row>
          <v-text-field label="Latitude" v-model="startingPoint.lat" />
          <v-text-field label="Longitude" v-model="startingPoint.lng" />
        </v-row>

        <v-row><v-label>Intermediate Point Coordinates</v-label></v-row>
        <v-row>
          <v-text-field label="Latitude" v-model="intermediatePoint.lat" />
          <v-text-field label="Longitude" v-model="intermediatePoint.lng" />
        </v-row>

        <v-row><v-label>Destination Coordinates</v-label></v-row>
        <v-row>
          <v-text-field label="Latitude" v-model="endingPoint.lat" />
          <v-text-field label="Longitude" v-model="endingPoint.lng" />
        </v-row>
      </v-container>
      <v-btn color="blue" @click="addRoute">Add Route</v-btn>
    </v-form>
    <GMapMap
      :center="center"
      :zoom="11"
      style="width: 66%; height: 100%; position: absolute"
      :options="{
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false
      }"
      @click="logCoordinates"
    >
      <GMapPolyline :path="path" :options="{ strokeColor: '#0E33FF' }" />
      <GMapMarker v-for="(marker, index) in markers" :key="index" :position="marker" />
    </GMapMap>
  </div>
</template>
    
<script>
import axios from 'axios'
import { decode } from '@googlemaps/polyline-codec'
export default {
  data() {
    return {
      center: { lat: 31.950695, lng: 35.923022 },
      path: [],
      markers: [],
      encodedPolyline: '',
      routeName: '',
      going: true
    }
  },
  computed: {
    startingPoint() {
      if (this.markers.length === 0) return { lat: 0, lng: 0 }
      return this.markers[0]
    },
    endingPoint() {
      if (this.markers.length < 2) return { lat: 0, lng: 0 }
      return this.markers[this.markers.length - 1]
    },
    intermediatePoint() {
      console.log('MARKERS:', this.markers)
      if (this.markers.length < 3) return { lat: 0, lng: 0 }
      return this.markers[this.markers.length - 2]
    },
    computeRouteForm() {
      return {
        origin: {
          via: false,
          vehicleStopover: true,
          sideOfRoad: false,
          location: {
            latLng: {
              latitude: this.startingPoint.lat,
              longitude: this.startingPoint.lng
            },
            heading: 0
          }
        },
        destination: {
          via: false,
          vehicleStopover: true,
          sideOfRoad: false,
          location: {
            latLng: {
              latitude: this.endingPoint.lat,
              longitude: this.endingPoint.lng
            },
            heading: 0
          }
        },
        intermediates: this.markers.slice(1, this.markers.length - 1).map((marker) => ({
          via: true,
          vehicleStopover: true,
          sideOfRoad: false,
          location: {
            latLng: {
              latitude: marker.lat,
              longitude: marker.lng
            },
            heading: 0
          }
        }))
      }
    },
    addRouteForm() {
      if (this.going === true)
        return {
          name: this.routeName,
          waypointsGoing: this.encodedPolyline,
          startingPoint: {
            name: 'starting point test',
            logo: '',
            pointName: 'starting point test',
            latitude: this.startingPoint.lat,
            longitude: this.startingPoint.lng
          },
          endingPoint: {
            name: 'ending point test',
            logo: '',
            pointName: 'ending point test',
            latitude: this.endingPoint.lat,
            longitude: this.endingPoint.lng
          }
        }
      else
        return {
          name: this.routeName,
          waypointsReturning: this.encodedPolyline,
          startingPoint: {
            name: 'starting point test',
            logo: '/',
            pointName: 'starting point test',
            latitude: this.startingPoint.lat,
            longitude: this.startingPoint.lng
          },
          endingPoint: {
            name: 'ending point test',
            logo: '/',
            pointName: 'ending point test',
            latitude: this.endingPoint.lat,
            longitude: this.endingPoint.lng
          }
        }
    }
  },
  mounted() {
    this.intervalId = setInterval(() => {
      if (this.markers.length > 2) {
        this.makePolyline()
      }
    }, 100)

  },
  beforeUnmount() {
    clearInterval(this.intervalId)
  },
  methods: {
    logCoordinates(event) {
      const coordinates = { lat: event.latLng.lat(), lng: event.latLng.lng() }
      this.markers.push(coordinates)
      if (this.markers.length > 2) this.makePolyline()
    },
    makePolyline() {
      console.log(
        'api',
        axios
          .post(
            'https://routes.googleapis.com/directions/v2:computeRoutes?fields=routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline&key='+"AIzaSyDxNE0VlDOWFQyk5aYx3R8QG2etHa7l59A",
            this.computeRouteForm
          )
          .then((response) => {
            this.encodedPolyline = response.data.routes[0].polyline.encodedPolyline
          })
          .catch((error) => {
            console.error(error)
          })
      )
      const paths = decode(this.encodedPolyline, 5)
      this.path = paths.map((coord) => ({ lat: coord[0], lng: coord[1] }))
    },
    async addRoute() {
      try {
        console.log('form', this.addRouteForm)
        console.log('token', this.$store.state.token)
        const response = await axios.post(
          'http://vmi1560602.contaboserver.net/api/v1.0/Route/addRoute',
          this.addRouteForm,
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
              'Content-Type': 'application/json'
            }
          }
        )
        console.log(response.status)
      } catch (error) {
        console.error(error)
        if (error.response && error.response.status === 400) {
          this.wrongAlert = true
          this.emptyAlert = false
          this.successAlert = false
        }
      }
    }
  }
}
</script>