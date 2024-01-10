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
        title="Passenger added successfully"
      >
      </v-alert>
    </div>
    <div v-if="emptyAlert" style="padding-bottom: 50px">
      <v-alert
        v-model="emptyAlert"
        border="start"
        variant="tonal"
        closable
        close-label="Close Alert"
        color="error"
        title="Please fill all fields"
      >
        Some fields might be empty
      </v-alert>
    </div>
    <div v-if="wrongAlert" style="padding-bottom: 50px">
      <v-alert
        v-model="wrongAlert"
        border="start"
        variant="tonal"
        closable
        close-label="Close Alert"
        color="error"
        title="Duplicate data or invalid data"
      >
        The email or phone number you are using might be used by another user,
        <br />
        or the email or phone number you are using is not valid.
      </v-alert>
    </div>
    <v-form :style="anyAlert?'padding-top:0px' :'padding-top: 50px'">
      <v-container>
        <v-row>
          <v-col cols="10" md="5" align-self="center" offset="1">
            <v-text-field
              v-model="firstName"
              label="First Name"
              required
              hide-details
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="5">
            <v-text-field v-model="lastName" label="Last Name" hide-details required></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="10" offset="1">
            <v-text-field v-model="email" label="E-mail" hide-details required></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="10" offset="1">
            <v-text-field
              v-model="phoneNumber"
              label="Phone Number"
              hide-details
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="10" offset="1">
            <v-text-field
              v-model="password"
              label="Password"
              type="password"
              required
            ></v-text-field
          ></v-col>
        </v-row>
        <v-row>
          <v-col offset="1">
            <v-btn type="submit" color="blue" @click="addPassenger" style="align-self: center">
              Add Passenger
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
        style="height: 350px; border: 1px solid rgb(217, 217, 217)"
      >
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Email</th>
            <th class="text-left">Phone Number</th>
            <th class="text-center">Edit This user</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="passenger in passengers" :key="passenger.id">
            <td>{{ passenger.user.name }}</td>
            <td>{{ passenger.user.email }}</td>
            <td>{{ passenger.user.phoneNumber }}</td>
            <td class="text-center">
              <v-btn @click="editPassenger(passenger.id)" icon="mdi-pencil"></v-btn>
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
  name: 'addPassenger',
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      emptyAlert: false,
      wrongAlert: false,
      successAlert: false,
      passengers: [],
    }
  },
  created() {
    axios
      .get('http://vmi1560602.contaboserver.net/api/v1.0/Passenger/getpassengers', {
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
  },
  computed: {
    passenger() {
      return {
        name: this.firstName + ' ' + this.lastName,
        email: this.email,
        phoneNumber: this.phoneNumber,
        password: this.password
      }
    },
    anyAlert() {
      return this.emptyAlert || this.wrongAlert || this.successAlert
    }
  },
  methods: {
    editPassenger(ID) {
      this.$router.push({
        name: 'edit Passenger',
        params: {
          passengerID: ID
        }
      })
    },
    resetForm() {
      this.firstName = ''
      this.lastName = ''
      this.email = ''
      this.phoneNumber = ''
      this.password = ''
    },
    async addPassenger() {
      if (
        !this.firstName ||
        !this.lastName ||
        !this.passenger.phoneNumber ||
        !this.passenger.email ||
        !this.passenger.password
      ) {
        console.error('Missing required passenger fields')
        this.emptyAlert = true
        this.wrongAlert = false
        this.successAlert = false
        return
      } else {
        this.emptyAlert = false
      }
      try {
        const response = await axios.post(
          'http://vmi1560602.contaboserver.net/api/v1.0/Passenger/AddPassenger',
          this.passenger,
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
              'Content-Type': 'application/json'
            }
          }
        )
        if (response.status === 200 || response.status === 204) {
          console.log(response.status)
          this.successAlert = true
          this.wrongAlert = false
          this.emptyAlert = false
          this.resetForm()
          axios
            .get('http://vmi1560602.contaboserver.net/api/v1.0/Passenger/getpassengers', {
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

<style scoped>
body {
  overflow: hidden;
}
</style>