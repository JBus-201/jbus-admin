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
        title="Admin added successfully"
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
        title="Duplicate data"
      >
        The email or phone number you are using might be used by another user,
        <br />
        or the email or phone number you are using is not valid.
      </v-alert>
    </div>
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
            <v-btn color="blue" @click="addAdmin" style="align-self: center"> Add Admin </v-btn>
          </v-col></v-row
        >
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
      emptyAlert: false,
      wrongAlert: false,
      successAlert: false
    }
  },
  computed: {
    admin() {
      return {
        name: this.firstName + ' ' + this.lastName,
        phoneNumber: this.phoneNumber,
        email: this.email,
        password: this.password
      }
    }
  },
  methods: {
    resetForm() {
      this.firstName = ''
      this.lastName = ''
      this.email = ''
      this.phoneNumber = ''
      this.password = ''
    },
    async addAdmin() {
      if (
        !this.firstName ||
        !this.lastName ||
        !this.admin.phoneNumber ||
        !this.admin.email ||
        !this.admin.password
      ) {
        console.error('Missing required admin fields')
        this.emptyAlert = true
        this.wrongAlert = false
        this.successAlert = false
        return
      } else {
        this.emptyAlert = false
      }
      try {
        const response = await axios.post(
          'http://vmi1560602.contaboserver.net/api/v1.0/Admin/addAdmin',
          this.admin,
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}` // replace this.token with your actual token
            }
          }
        )
        if (response.data.status === 200) {
          console.log(response.data)
          this.successAlert = true
          this.wrongAlert = false
          this.emptyAlert = false
          this.resetForm()
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

