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
          <v-col cols="12" md="10" offset="1">
            <v-menu transition="slide-y-transition">
              <template v-slot:activator="{ props }">
                <v-btn color="green" v-bind="props"> route </v-btn>
              </template>
              <v-list>
                <v-list-item v-for="route in routes" :key="route.id">
                  <v-list-item @click="this.routeID = route.id">{{ route.name }}</v-list-item>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-menu transition="slide-y-transition">
              <template v-slot:activator="{ props }">
                <v-btn color="green" v-bind="props"> Driver </v-btn>
              </template>
              <v-list>
                <v-list-item v-for="driver in drivers" :key="driver.id">
                  <v-list-item @click="this.driverID = driver.id">{{ driver.user.name }}</v-list-item>
                </v-list-item>
              </v-list>
            </v-menu>
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
      driverID: ''
    }
  },
  computed: {
    busForm() {
      return {
        busNumber: this.busNumber,
        capacity: this.capacity,
        routeId: this.routeID,
        driverId: this.driverID
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
          axios
            .get(import.meta.env.VITE_API_BASE_URL + '/Admin/getAdmins', {
              headers: {
                Authorization: `Bearer ${this.$store.state.token}`
              }
            })
            .then((response) => {
              this.admins = response.data
            })
            .catch((error) => {
              console.error(error)
            })
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

