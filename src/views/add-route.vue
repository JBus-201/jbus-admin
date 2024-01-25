<template>
  <div style="display: flex; width: 100%; height: 100%">
    <div style="width: 34%; padding: 20px">
      <div v-if="successAlert" style="padding-bottom: 20px">
        <v-alert
          v-model="successAlert"
          border="start"
          variant="tonal"
          closable
          close-label="Close Alert"
          color="success"
          :title="this.goingAlert ? 'Route added successfully' : 'Return route added successfully'"
        ></v-alert>
      </div>
      <div v-if="pointsAlert" style="padding-bottom: 20px">
        <v-alert
          v-model="pointsAlert"
          border="start"
          variant="tonal"
          closable
          close-label="Close Alert"
          color="success"
          title="Points added successfully"
        ></v-alert>
      </div>
      <div v-if="deleteAlert" style="padding-bottom: 20px">
        <v-alert
          v-model="deleteAlert"
          border="start"
          variant="tonal"
          closable
          close-label="Close Alert"
          color="error"
          title="Route deleted successfully"
        ></v-alert>
      </div>
      <div v-if="viewPathAlert" style="padding-bottom: 20px">
        <v-alert
          v-model="viewPathAlert"
          border="start"
          variant="tonal"
          closable
          close-label="Close Alert"
          color="error"
          title="Can't view route while adding a new one"
        >
          You are currently adding a route, you can view a route after you finish adding the current
          one
        </v-alert>
      </div>
      <v-container>
        <v-row>
          <!-- <v-text-field label="Route Name" v-model="routeName" :maxlength="40" :counter="40" /> -->
          <v-text-field
            label="Start Location (name)"
            v-model="startingPointName"
            :maxlength="20"
            :counter="20"
          />
          <v-text-field
            label="Destination (name)"
            v-model="endingPointName"
            :maxlength="20"
            :counter="20"
          />
        </v-row>
        <v-row style="margin-bottom: 20px">
          <v-text-field label="Fee (piastre)" v-model="fee" type="number" hide-details="" />
        </v-row>
        <v-row style="justify-content: space-between">
          <v-btn v-if="this.addingStops === false" color="blue" @click="addRoute">Add Route</v-btn>
          <v-btn v-if="this.addingStops === true" color="blue" @click="addStops">Add Stops</v-btn>
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
                <th class="text-center">Route Fees</th>
                <th class="text-center">Route Name</th>
                <th class="text-center">Edit Route</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="route in routes" :key="route.id">
                <td @click="displayRoute(route.id)" class="text-center">{{ route.fee }}</td>
                <td @click="displayRoute(route.id)" class="text-center">{{ route.name }}</td>
                <td class="text-center">
                  <v-btn
                    v-if="route.waypointsReturning === ''"
                    @click="returnRoute(route.id)"
                    icon="mdi-swap-horizontal"
                  ></v-btn>
                  <v-btn
                    v-if="!route.predefinedStops"
                    @click="addRoutePoints(route.id)"
                    icon="mdi-plus"
                  ></v-btn>
                  <v-btn @click="deleteRoute(route.id)" icon="mdi-delete"></v-btn>
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
      <GMapMarker v-for="(marker, index) in stops" :key="index" :position="marker" />
      <div v-if="this.markers.length === 0 && this.stops.length === 0">
        <GMapPolyline :path="viewPath" :options="{ strokeColor: '#0E33FF' }" />
        <GMapMarker v-for="(marker, index) in viewStops" :key="index" :position="marker" />
        <GMapMarker :position="viewPath[0]" content="" />
        <GMapMarker :position="viewPath[viewPath.length - 1]" />
      </div>
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
      encodedPolylineComing: '',
      startingPointName: '',
      endingPointName: '',
      goingInfo: false,
      comingInfo: false,
      routes: [],
      flag: true,
      halfRoute: {},
      fee: '',
      returning: false,
      stops: [],
      addingStops: false,
      index: 1,
      stopsRoute: 0,
      viewPath: [],
      viewStops: [],
      successAlert: false,
      pointsAlert: false,
      goingAlert: true,
      deleteAlert: false,
      viewPathAlert: false
    }
  },
  created() {
    this.fillTable()
  },
  computed: {
    addStopsForm() {
      const points = this.stops.map((stop) => ({
        name: (this.index++).toString(),
        latitude: stop.lat,
        longitude: stop.lng
      }))
      return {
        routeId: this.stopsRoute,
        points
      }
    },
    routeName() {
      if (!this.returning) return this.startingPointName + ' - ' + this.endingPointName
      else return this.startingPointName + '-' + this.endingPointName
    },
    startingPoint() {
      if (this.markers.length === 0) return { lat: 0, lng: 0 }
      return this.markers[0]
    },
    endingPoint() {
      if (this.markers.length < 2) return { lat: 0, lng: 0 }
      return this.markers[this.markers.length - 1]
    },
    intermediatePoint() {
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
      return {
        name: this.routeName,
        waypointsGoing: this.encodedPolyline,
        waypointsReturning: this.encodedPolylineComing,
        fee: parseInt(this.fee),
        startingPoint: {
          name: 'starting point test',
          logo: '/',
          latitude: this.startingPoint.lat,
          longitude: this.startingPoint.lng
        },
        endingPoint: {
          name: 'ending point test',
          logo: '/',
          latitude: this.endingPoint.lat,
          longitude: this.endingPoint.lng
        }
      }
    },
    addRouteFormReturning() {
      return {
        name: this.routeName,
        waypointsReturning: this.encodedPolyline,
        fee: this.fee,
        endingPoint: {
          name: 'ending point test',
          logo: '/',
          latitude: this.startingPoint.lat,
          longitude: this.startingPoint.lng
        },
        startingPoint: {
          name: ' starting point test',
          logo: '/',
          latitude: this.endingPoint.lat,
          longitude: this.endingPoint.lng
        }
      }
    }
  },
  mounted() {
    this.intervalId = setInterval(() => {
      if (this.flag === true && this.markers.length > 2 && this.addingStops === false) {
        this.makePolyline()
        this.flag = false
      }
    }, 100)
  },
  beforeUnmount() {
    clearInterval(this.intervalId)
  },
  methods: {
    async displayRoute(routeID) {
      if (this.markers.length !== 0 || this.stops.length !== 0) {
        this.viewPathAlert = true
        return
      }
      var getStops = true
      await axios
        .get(import.meta.env.VITE_API_BASE_URL + '/Route/' + routeID, {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`
          }
        })
        .then((response) => {
          this.viewPath = decode(response.data.waypointsGoing, 5).map((coord) => ({
            lat: coord[0],
            lng: coord[1]
          }))
          if (!response.data.predefinedStops) {
            getStops = false
            this.viewStops = []
          }
        })
        .catch((error) => {
          console.error(error)
        })
        
      if (getStops) {
        await axios
          .get(import.meta.env.VITE_API_BASE_URL + '/PredefinedStops/' + routeID, {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`
            }
          })
          .then((response) => {
            this.viewStops = response.data.points.map((coord) => ({
              lat: coord.latitude,
              lng: coord.longitude
            }))
          })
          .catch((error) => {
            console.error(error)
          })
      }
    },
    returnRoute(routeID) {
      console.log('getting here')
      this.successAlert = false
      this.goingAlert = false
      this.pointsAlert = false
      this.deleteAlert = false
      this.returning = true
      axios
        .get(import.meta.env.VITE_API_BASE_URL + '/Route/' + routeID, {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`
          }
        })
        .then((response) => {
          this.halfRoute = response.data
          this.startingPointName = response.data.name.split('-')[0]
          this.endingPointName = response.data.name.split('-')[1]
          this.fee = response.data.fee
          console.log('half route', this.halfRoute)
          window.alert(
            'You are adding a returning route to ' +
              this.startingPointName +
              '-' +
              this.endingPointName
          )
        })
        .catch((error) => {
          console.error(error)
        })
    },
    async addStops() {
      this.addingStops = false
      this.index = 1
      try {
        console.log(this.addStopsForm)
        const response = await axios.post(
          import.meta.env.VITE_API_BASE_URL + '/PredefinedStops',
          this.addStopsForm,
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
              'Content-Type': 'application/json'
            }
          }
        )
        console.log(response.status)
        this.fillTable()
        // this.clearRoute()
        this.pointsAlert = true
        this.stops = []
        // this.startingPointName = ''
        // this.endingPointName = ''
        // this.fee = ''
      } catch (error) {
        console.error(error)
        if (error.response && error.response.status === 400) {
          this.wrongAlert = true
          this.emptyAlert = false
          this.successAlert = false
        }
      }
    },
    addRoutePoints(ID) {
      window.alert("You are adding stop points to the route, click 'Add Stops' to save them.")
      this.stopsRoute = ID
      this.addingStops = true
      this.successAlert = false
      this.deleteAlert = false
    },
    deleteRoute(routeID) {
      this.displayRoute(routeID)
      var confirmDelete
      setTimeout(function () {
        confirmDelete = window.confirm('Are you sure you want to delete the route?')
      }, 200) //wait until the route is displayed
      if (confirmDelete) {
        axios
          .delete(import.meta.env.VITE_API_BASE_URL + '/Route/' + routeID, {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`
            }
          })
          .then((response) => {
            console.log(response.status)
            this.fillTable()
          })
          .catch((error) => {
            console.error(error)
          })
        this.deleteAlert = true
        this.successAlert = false
        this.pointsAlert = false
      } else {
        console.log('canceled delete')
        return
      }
    },
    fillTable() {
      axios
        .get(import.meta.env.VITE_API_BASE_URL + '/Route/getRoutes', {
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
    logCoordinates(event) {
      const coordinates = { lat: event.latLng.lat(), lng: event.latLng.lng() }
      if (this.addingStops === false) this.markers.push(coordinates)
      else this.stops.push(coordinates)
      this.flag = true
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
              import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
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
      console.log(this.addRouteForm)
      if (this.startingPointName === '' || this.endingPointName === '' || this.fee === '') {
        console.error('Missing required route fields')
        window.alert('You need to provide starting point name, destination name, and route fees')
        return
      }
      if (this.encodedPolyline === '') {
        console.error('Missing required route fields')
        window.alert('You need to provide at least 3 points on the map to create a route')
        return
      }
      if (this.returning) {
        console.log('getting to line 268')
        console.log(this.addRouteFormReturning)
        this.returning = false
        try {
          const response = await axios.put(
            import.meta.env.VITE_API_BASE_URL + '/Route/' + this.halfRoute.id,
            this.addRouteFormReturning,
            {
              headers: {
                Authorization: `Bearer ${this.$store.state.token}`,
                'Content-Type': 'application/json'
              }
            }
          )
          console.log(response.status)
          this.fillTable()
          this.clearRoute()
          this.startingPointName = ''
          this.endingPointName = ''
          this.fee = ''
          this.successAlert = true
          this.pointsAlert = false
          this.deleteAlert = false
        } catch (error) {
          console.error(error)
          if (error.response && error.response.status === 400) {
            this.wrongAlert = true
            this.emptyAlert = false
            this.successAlert = false
          }
        }
      } else
        try {
          const response = await axios.post(
            import.meta.env.VITE_API_BASE_URL + '/Route/addRoute',
            this.addRouteForm,
            {
              headers: {
                Authorization: `Bearer ${this.$store.state.token}`,
                'Content-Type': 'application/json'
              }
            }
          )
          console.log(response.status)
          this.fillTable()
          this.clearRoute()
          this.startingPointName = ''
          this.endingPointName = ''
          this.fee = ''
          this.successAlert = true
          this.pointsAlert = false
          this.deleteAlert = false
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

<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
