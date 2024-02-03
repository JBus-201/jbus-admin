<template>
  <div style="display: flex; width: 100%; height: 100%">
    <div style="width: 34%; padding: 20px">
      <!-- <div v-if="successAlert" style="padding-bottom: 20px">
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
          title="Stops added successfully"
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
      </div> -->
      <v-container>
        <v-row style="padding-top: 40px">
          <v-table
            fixed-header
            hover
            height="600px"
            style="height: 100%; width: 100%; border: 1px solid rgb(217, 217, 217)"
          >
            <thead>
              <tr>
                <th class="text-center">Bus Number</th>
                <th class="text-center">Route</th>
                <th class="text-center">Driver</th>
              </tr>
            </thead>
            <tbody>
              <tr @click="displayPosition" v-for="bus in buses" :key="bus.id">
                <td>{{ bus.busNumber }}</td>
                <td>{{ bus.route ? bus.route.name : 'No route assigned' }}</td>
                <td>{{ bus.driver ? bus.driver.user.name : 'No driver assigned' }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-row>
      </v-container>
    </div>
    <GMapMap
      :center="busPosition"
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
    >
      <GMapMarker v-if="flag" :position="busPosition" />
    </GMapMap>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      positions: [
        { lat: 32.401047, lng: 35.948555 },
        { lat: 32.157300, lng: 35.848866 },
        { lat: 32.352421, lng: 36.027887 },
        { lat: 32.141420, lng: 36.107600 },
        { lat: 32.016672, lng: 35.903809 }
      ],
      buses: [],
      busPosition: { lat: 31.9351052, lng: 35.7755961 },
      flag: false,
      i: 0
    }
  },
  created() {
    axios
      .get(import.meta.env.VITE_API_BASE_URL + '/Bus/getBuses', {
        headers: {
          Authorization: `Bearer ${this.$store.state.token}`
        }
      })
      .then((response) => {
        this.buses = response.data
      })
      .catch((error) => {
        console.error(error)
      })
  },
  methods: {
    displayPosition() {
      this.busPosition = this.positions[this.i++ % 5]
      this.flag = true
    }
  }
}
</script>
