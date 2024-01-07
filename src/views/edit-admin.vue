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
          title="Admin edited successfully"
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
          title="Invalid data"
        >
          The email or phone number you are using is not valid.
        </v-alert>
      </div>
      <v-form>
        <v-container>
          <v-row>
            <v-col cols="10" md="10" align-self="center" offset="1">
              <v-text-field v-model="name" label="Name" required hide-details></v-text-field>
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
          <v-col offset="1">
            <v-btn type="submit" color="blue" @click="editAdmin" style="align-self: center">Save Edits </v-btn>
          </v-col>
        </v-container>
      </v-form>
    </v-app>
  </template>
    
    <script>
  import axios from 'axios'
  export default {
    name: 'editAdmin',
    data() {
      return {
        name: '',
        email: '',
        phoneNumber: '',
        emptyAlert: false,
        wrongAlert: false,
        successAlert: false,
        adminInfo: {}
      }
    },
    created() {
      //maybe change created() to mounted()
      if (this.$route.params.adminID) {
        axios
          .get(
            'http://vmi1560602.contaboserver.net/api/v1.0/Admin/' +
              this.$route.params.adminID,
            {
              headers: {
                Authorization: `Bearer ${this.$store.state.token}`
              }
            }
          )
          .then((response) => {
            this.adminInfo = response.data
            console.log(this.adminInfo)
            this.name = this.adminInfo.user.name
            this.email = this.adminInfo.user.email
            this.phoneNumber = this.adminInfo.user.phoneNumber
          })
          .catch((error) => {
            console.error(error)
          })
      }
    },
    methods: {
      async editAdmin() {
        if (!this.name || !this.phoneNumber || !this.email) {
          console.error('Missing required admin fields')
          this.emptyAlert = true
          this.wrongAlert = false
          this.successAlert = false
          return
        } else {
          this.emptyAlert = false
          this.adminInfo.user.name = this.name
          this.adminInfo.user.email = this.email
          this.adminInfo.user.phoneNumber = this.phoneNumber
        }
        try {
          console.log(this.adminInfo)
          const response = await axios.put(
            'http://vmi1560602.contaboserver.net/api/v1.0/Admin/' +
              this.$route.params.adminID,
            this.adminInfo,
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
            this.$router.push('/add-admin')
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