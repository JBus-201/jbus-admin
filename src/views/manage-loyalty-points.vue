<template>
  <v-app>
    <div>
      <v-container :style="anyAlert ? 'padding-top:0px' : 'padding-top: 50px'">
        <v-row>
          <v-col cols="12" md="5">
            <v-text-field
              label="Points to be Added for all Passengers"
              v-model="pointsForAll"
              type="number"
              hide-details=""
            />
          </v-col>
          <v-btn style="align-self: center" color="blue">ADD POINTS FOR ALL PASSENGERS</v-btn>
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
              <th class="text-left">Points</th>
              <th class="text-center">Add Points for This user only</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="passenger in passengers" :key="passenger.id">
              <td>{{ passenger.user.name }}</td>
              <td>{{ passenger.user.email }}</td>
              <!-- <td>{{ passenger.user.phoneNumber }}</td> -->
              <td class="text-center">
                <v-btn
                  @click="editPassenger(passenger.id)"
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
      pointsForAll: 0,
      passengers: []
    }
  },
  computed: {
    anyAlert() {
      return this.successAlert || this.errorAlert
    }
  },
  created() {
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
</script>

<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>