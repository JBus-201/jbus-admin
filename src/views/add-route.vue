<template>
  <div style="display: flex; width: 100%; height: 100%">
    <div style="width: 34%; padding: 20px">
      <v-container>
        <v-row>
          <v-text-field label="Route Name" v-model="routeName" />
        </v-row>
        <v-row style="justify-content: space-between">
          <v-btn color="blue" @click="addRoute">Add Route</v-btn>
          <v-btn color="blue" @click="popMarker">Remove Last Marker</v-btn>
          <v-btn color="red" @click="clearRoute">Clear Route</v-btn>
        </v-row>
        <v-row style="padding-top: 20px">
          <v-table
            fixed-header
            hover
            height="600px"
            style="height: 100%; width: 100%; border: 1px solid rgb(217, 217, 217)"
          >
            <thead>
              <tr>
                <th class="text-left">Route ID</th>
                <th class="text-left">Route Name</th>
                <th class="text-center">Delete Route</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="route in routes" :key="route.id">
                <td>{{ route.id }}</td>
                <td>{{ route.name }}</td>
                <td class="text-center">
                  <v-btn @click="deleteRouet(route.id)" icon="mdi-delete"></v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-row>
      </v-container>
    </div>
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
      going: true,
      routes: [],
      flag: true
    }
  },
  created() {
    axios
      .get('http://vmi1560602.contaboserver.net/api/v1.0/Route/getRoutes', {
        headers: {
          Authorization: `Bearer ${this.$store.state.token}`
        }
      })
      .then((response) => {
        this.routes = response.data
      })
      .catch((error) => {
        console.error(error)
      })
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
    //=============
    this.intervalId = setInterval(() => {
      // console.log('flag', this.flag, 'markers', this.markers.length)
      if (this.flag === true && this.markers.length > 2) {
        this.makePolyline() //calls
        this.flag = false
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
      this.flag = true
      // if (this.markers.length > 2) this.makePolyline()
    },
    popMarker() {
      this.markers.pop()
      this.flag = true
      if (this.markers.length <= 2) {
        this.encodedPolyline = ''
        this.path = []
      }
    },
    clearRoute() {
      this.markers = []
      this.encodedPolyline = ''
      this.path = []
    },
    async makePolyline() {
      console.log(
        'api',
        await axios
          .post(
            'https://routes.googleapis.com/directions/v2:computeRoutes?fields=routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline&key=' +
              'AIzaSyDxNE0VlDOWFQyk5aYx3R8QG2etHa7l59A',
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
      if (this.encodedPolyline === '') {
        console.error('Missing required route fields')
        window.alert('You need to provide at least 3 points on the map to create a route')
        return
      }
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