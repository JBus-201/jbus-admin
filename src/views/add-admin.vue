<template>
  <v-app>
    <v-form>
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
            <v-btn color="blue" @click="addPassenger" style="align-self: center">
              Add Admin
            </v-btn>
          </v-col></v-row>
      </v-container>
    </v-form>
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
      admininfo: {
        name: this.firstName + ' ' + this.lastName,
        phoneNumber: this.phoneNumber,
        email: this.email,
        password: this.password
      }
    }
  },
  computed: {
    name() {
      return this.firstName + ' ' + this.lastName
    }
  },
  methods: {
    async addPassenger() {
      this.passenger.user.name = this.name
      try {
        const response = await axios.put(
          'http://vmi1560602.contaboserver.net/api/v1.0/AdminAccount/addAdmin',
          this.admininfo,
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}` // replace this.token with your actual token
            }
          }
        )
        console.log(response.data)
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

