<template>
  <v-app>
    <div v-if="successAlert" style="padding-bottom: 50px">
      <v-alert
        v-model="successAlert"
        border="start"
        variant="tonal"
        closable
        close-label="Close Alert"
        color="success"
        title="Bus added successfully"
      ></v-alert>
    </div>
    <div v-if="emptyAlert" style="padding-bottom: 50px">
      <v-alert
        v-model="emptyAlert"
        border="start"
        variant="tonal"
        closable
        close-label="Close Alert"
        color="error"
        title="Some fields might be empty"
      >
        Please fill Bus Number and Capacity fields
      </v-alert>
    </div>
    <v-form :style="anyAlert ? 'padding-top:0px' : 'padding-top: 50px'">
      <v-container>
        <v-row>
          <v-col cols="10" md="5" align-self="center" offset="1">
            <v-text-field
              v-model="busNumber"
              label="Bus Number"
              required
              hide-details
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="5">
            <v-text-field label="Capacity" v-model="capacity" type="number" hide-details="" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="10" md="5" align-self="center" offset="1">
            <v-text-field
              v-model="routeName"
              label="Route Name"
              required
              disabled
              hide-details
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="5">
            <v-text-field v-model="driverName" label="Driver" required disabled hide-details />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="10" offset="1">
            <div style="display: flex; width: 100%; gap: 10px">
              <v-table
                fixed-header
                hover
                height="300px"
                style="height: 250px; flex: 1; border: 1px solid rgb(217, 217, 217)"
              >
                <thead>
                  <tr>
                    <th class="text-center">
                      Route Name <span style="font-weight: 100">(optional)</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="route in routes" :key="route.id">
                    <td
                      class="text-center"
                      @click="
                        this.routeID = route.id;
                        this.routeName = route.name;
                      "
                    >
                      {{ route.name }}
                    </td>
                  </tr>
                </tbody>
              </v-table>

              <v-table
                fixed-header
                hover
                height="300px"
                style="height: 250px; flex: 1; border: 1px solid rgb(217, 217, 217)"
              >
                <thead>
                  <tr>
                    <th class="text-center">
                      Driver <span style="font-weight: 100">(optional)</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="driver in drivers" :key="driver.id">
                    <td
                      class="text-center"
                      @click="
                        this.driverID = driver.id;
                        this.driverName = driver.user.name;
                      "
                    >
                      {{ driver.user.name }}
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </div>
          </v-col>
        </v-row>
        <v-row> </v-row>
        <v-row>
          <v-col offset="1">
            <v-btn type="submit" color="blue" @click.prevent="addBus"> Add Bus </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <v-container>
      <v-table
        fixed-header
        hover
        height="300px"
        style="height: 250px; border: 1px solid rgb(217, 217, 217)"
      >
        <thead>
          <tr>
            <th class="text-left">Bus Number</th>
            <th class="text-left">Capacity</th>
            <th class="text-left">Driver ID</th>
            <th class="text-left">Route ID</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="bus in buses" :key="bus.id">
            <td>{{ bus.busNumber }}</td>
            <td>{{ bus.capacity }}</td>
            <td>{{ bus.driverId }}</td>
            <td>{{ bus.routeId }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-container>
  </v-app>
</template>

<script>
import axios from 'axios'
export default {
  name: 'AddEditBus',
  data() {
    return {
      successAlert: false,
      emptyAlert: false,
      anyAlert: false,
      busNumber: '',
      capacity: '',
      routes: [],
      routeID: '',
      drivers: [],
      driverID: '',
      buses: [],
      routeName: '',
      driverName: ''
    }
  },
  computed: {
    busForm() {
      return {
        busNumber: this.busNumber,
        capacity: parseInt(this.capacity),
        routeId: parseInt(this.routeID),
        driverId: parseInt(this.driverID)
      }
    }
  },
  created() {
    this.fillTable()
  },
  methods: {
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

      axios
        .get(import.meta.env.VITE_API_BASE_URL + '/Driver', {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`
          }
        })
        .then((response) => {
          this.drivers = response.data
        })
        .catch((error) => {
          console.error(error)
        })

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
    async addBus() {
      if (!this.busNumber || !this.capacity) {
        console.error('Missing required Bus fields')
        this.emptyAlert = true
        this.successAlert = false
        return
      } else {
        this.emptyAlert = false
      }
      try {
        const response = await axios.post(
          import.meta.env.VITE_API_BASE_URL + '/Bus/addBus',
          this.busForm,
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
              'Content-Type': 'application/json'
            }
          }
        )
        if (response.status === 201) {
          console.log(response.data)
          this.successAlert = true
          this.wrongAlert = false
          this.emptyAlert = false
          this.resetForm()
          this.fillTable()
        }
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

