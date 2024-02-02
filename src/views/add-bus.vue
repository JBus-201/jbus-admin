<template>
  <v-app>
    <div v-if="editAlert" style="padding-bottom: 50px">
      <v-alert
        v-model="editAlert"
        border="start"
        variant="tonal"
        closable
        close-label="Close Alert"
        color="success"
        title="Bus edited successfully"
      ></v-alert>
    </div>
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
        Please fill Bus Number, Capacity, Route Name and Driver fields
      </v-alert>
    </div>
    <div v-if="failAlert" style="padding-bottom: 50px">
      <v-alert
        v-model="failAlert"
        border="start"
        variant="tonal"
        closable
        close-label="Close Alert"
        color="error"
        title="Bus not added/edited"
      >
        There was an issue performing this action
      </v-alert>
    </div>
    <div v-if="driverAlert" style="padding-bottom: 50px">
      <v-alert
        v-model="driverAlert"
        border="start"
        variant="tonal"
        closable
        close-label="Close Alert"
        color="error"
        title="Bus not added"
      >
        The driver is already assigned to a bus
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
                    <th class="text-center">Route Name</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="route in routes" :key="route.id">
                    <td class="text-center" @click="setRoute(route.id, route.name)">
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
                    <th class="text-center">Driver</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="driver in drivers" :key="driver.id">
                    <td class="text-center" @click="setDriver(driver.id, driver.user.name)">
                      {{ driver.user.name }}
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col offset="1">
            <v-btn v-if="editing === false" type="submit" color="blue" @click.prevent="addBus">
              Add Bus
            </v-btn>
            <v-btn v-if="editing === true" type="submit" color="blue" @click.prevent="pushEdits">
              Edit Bus
            </v-btn>
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
            <th class="text-left">Driver</th>
            <th class="text-left">Route Name</th>
            <th class="text-left">Edit Bus</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="bus in buses" :key="bus.id">
            <td class="text-left">{{ bus.busNumber }}</td>
            <td class="text-left">{{ bus.capacity }}</td>
            <td class="text-left">
              {{ bus.driver ? bus.driver.user.name : 'No driver assigned' }}
            </td>
            <td class="text-left">{{ bus.route ? bus.route.name : 'No route assigned' }}</td>
            <td class="text-left">
              <v-btn @click="editBus(bus.id)" icon="mdi-pencil" style="margin: 6px"></v-btn>
            </td>
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
      editAlert: false,
      failAlert: false,
      driverAlert: false,
      busNumber: '',
      capacity: '',
      routes: [],
      routeID: '',
      drivers: [],
      driverID: '',
      buses: [],
      routeName: '',
      driverName: '',
      editing: false,
      busID: ''
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
    },
    anyAlert() {
      return (
        this.successAlert || this.emptyAlert || this.failAlert || this.editAlert || this.driverAlert
      )
    }
  },
  created() {
    this.fillTable()
  },
  methods: {
    setDriver(ID, name) {
      this.driverID = ID
      this.driverName = name
    },
    setRoute(ID, name) {
      this.routeID = ID
      this.routeName = name
    },
    resetForm() {
      this.busNumber = ''
      this.capacity = ''
      this.routeID = ''
      this.driverID = ''
      this.routeName = ''
      this.driverName = ''
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
    async editBus(ID) {
      this.editing = true
      this.busID = ID
      await axios
        .get(import.meta.env.VITE_API_BASE_URL + '/Bus/' + ID, {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`
          }
        })
        .then((response) => {
          this.busNumber = response.data.busNumber
          this.capacity = response.data.capacity
          this.routeName = response.data.route? response.data.route.name : ''
          this.driverName = response.data.driver ? response.data.driver.user.name : ''
          this.routeID = response.data.route? response.data.route.id : ''
          this.driverID = response.data.driver ? response.data.driver.id : ''
        })
    },
    async pushEdits() {
      if (
        !this.busNumber ||
        (!this.capacity && this.capacity !== 0) ||
        !this.routeID ||
        !this.driverID
      ) {
        console.error('Missing required Bus fields')
        this.emptyAlert = true
        this.successAlert = false
        this.driverAlert = false
        this.editAlert = false
        this.failAlert = false
        return
      } else {
        this.emptyAlert = false
      }
      try {
        const response = await axios.put(
          import.meta.env.VITE_API_BASE_URL + '/Bus/' + this.busID,
          this.busForm,
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
              'Content-Type': 'application/json'
            }
          }
        )
        if (response.status === 204) {
          console.log(response.data)
          this.resetForm()
          this.fillTable()
          this.editAlert = true
          this.successAlert = false
          this.emptyAlert = false
          this.failAlert = false
          this.driverAlert = false
          this.editing = false
        }
      } catch (error) {
        console.error(error)
        if (error.response && error.response.status === 400) {
          this.failAlert = true
          this.emptyAlert = false
          this.successAlert = false
          this.driverAlert = false
          this.editAlert = false
        }
      }
    },
    async addBus() {
      if (
        !this.busNumber ||
        (!this.capacity && this.capacity !== 0) ||
        !this.routeID ||
        !this.driverID
      ) {
        console.error('Missing required Bus fields')
        this.emptyAlert = true
        this.successAlert = false
        this.failAlert = false
        this.driverAlert = false
        this.editAlert = false
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
          this.editAlert = false
          this.emptyAlert = false
          this.failAlert = false
          this.driverAlert = false
          this.resetForm()
          this.fillTable()
        }
      } catch (error) {
        console.error(error)
        if (error.response && error.response.status === 400) {
          this.driverAlert = true
          this.failAlert = false
          this.emptyAlert = false
          this.successAlert = false
          this.editAlert = false
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

