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
        title="Points added successfully"
      ></v-alert>
    </div>
    <div v-if="errorAlert" style="padding-bottom: 50px">
      <v-alert
        v-model="errorAlert"
        border="start"
        variant="tonal"
        closable
        close-label="Close Alert"
        color="error"
        title="Something went wrong"
      ></v-alert>
    </div>
    <div>
      <v-container
        style="display: flex"
        :style="anyAlert ? 'padding-top:0px' : 'padding-top: 50px'"
      >
        <v-row>
          <v-col style="margin: auto" cols="12" md="5">
            <v-row>
              <v-text-field
                v-if="this.specificPassengerID"
                label="Points to be Added for Selected Passenger"
                v-model="points"
                type="number"
                hide-details=""
              />
              <v-text-field
                v-else
                label="Points to be Added for all Passengers"
                v-model="points"
                type="number"
                hide-details=""
              />
              <v-btn @click="addPoints" style="align-self: center" color="blue">ADD POINTS</v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
      <v-container>
        <v-table
          fixed-header
          hover
          height="300px"
          style="height: 350px; border: 1px solid rgb(217, 217, 217)"
        >
          <thead>
            <tr>
              <th class="text-left">Name</th>
              <th class="text-left">Email</th>
              <th class="text-left">Reward Points</th>
              <th class="text-center">Add Points for This user</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="passenger in passengers" :key="passenger.id">
              <td>{{ passenger.user.name }}</td>
              <td>{{ passenger.user.email }}</td>
              <td>{{ passenger.rewardPoints }}</td>
              <td class="text-center">
                <v-btn
                  @click="this.specificPassengerID = passenger.id"
                  icon="mdi-plus"
                  style="margin: 6px"
                ></v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-container>
    </div>
  </v-app>
</template>

<script>
import axios from 'axios'
export default {
  name: 'manageLoyaltyPoints',
  data() {
    return {
      successAlert: false,
      errorAlert: false,
      points: null,
      passengers: [],
      specificPassengerID: null
    }
  },
  computed: {
    anyAlert() {
      return this.successAlert || this.errorAlert
    }
  },
  created() {
    this.fillTable()
  },
  methods: {
    addPoints() {
      if (this.specificPassengerID) {
        axios
          .put(
            import.meta.env.VITE_API_BASE_URL +
              '/Passenger/updateRewardPoints/' +
              this.specificPassengerID,
            {
              rp: this.points
            },
            {
              headers: {
                Authorization: `Bearer ${this.$store.state.token}`
              }
            }
          )
          .then((response) => {
            this.successAlert = true
            this.errorAlert = false
            this.specificPassengerID = null
            this.points = null
            // this.passengers = response.data
            console.log(response.data)
            this.fillTable()
          })
          .catch((error) => {
            console.error(error)
            this.successAlert = false
            this.errorAlert = true
          })
      } else {
        axios
          .put(
            import.meta.env.VITE_API_BASE_URL + '/Passenger/updateRewardPointsToAll',
            {
              rp: this.points
            },
            {
              headers: {
                Authorization: `Bearer ${this.$store.state.token}`
              }
            }
          )
          .then((response) => {
            this.successAlert = true
            this.errorAlert = false
            this.specificPassengerID = null
            this.points = null
            // this.passengers = response.data
            console.log(response.data)
            this.fillTable()
          })
          .catch((error) => {
            console.error(error)
            this.successAlert = false
            this.errorAlert = true
          })
      }
    },
    fillTable() {
      axios
        .get(import.meta.env.VITE_API_BASE_URL + '/Passenger/getPassengers', {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`
          }
        })
        .then((response) => {
          this.passengers = response.data
        })
        .catch((error) => {
          console.error(error)
        })
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