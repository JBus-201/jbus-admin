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
        title="Driver edited successfully"
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
    <v-form style="padding-top: 50px">
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
          <v-btn type="submit" color="blue" @click.prevent="editDriver" style="align-self: center"
            >Save Edits
          </v-btn>
        </v-col>
      </v-container>
    </v-form>
  </v-app>
</template>

<script>
import axios from 'axios'
export default {
  name: 'editDriver',
  data() {
    return {
      name: '',
      email: '',
      phoneNumber: '',
      emptyAlert: false,
      wrongAlert: false,
      successAlert: false,
      driverInfo: {}
    }
  },
  computed: {
    driverForm() {
      return {
        user: {
          name: this.name,
          phoneNumber: this.phoneNumber,
          email: this.email
          // "sex": "string"
        },
        busId: 0
      }
    }
  },
  created() {
    //maybe change created() to mounted()
    if (this.$route.params.driverID) {
      axios
        .get(import.meta.env.VITE_API_BASE_URL + '/Driver/' + this.$route.params.driverID, {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`
          }
        })
        .then((response) => {
          this.driverInfo = response.data
          console.log('driver info from api:', this.driverInfo)
          this.name = this.driverInfo.user.name
          this.email = this.driverInfo.user.email
          this.phoneNumber = this.driverInfo.user.phoneNumber
        })
        .catch((error) => {
          console.error(error)
        })
    }
  },
  methods: {
    async editDriver() {
      if (!this.name || !this.phoneNumber || !this.email) {
        console.error('Missing required driver fields')
        this.emptyAlert = true
        this.wrongAlert = false
        this.successAlert = false
        return
      } else {
        this.emptyAlert = false
        // this.driverInfo.user.name = this.name
        // this.driverInfo.user.email = this.email
        // this.driverInfo.user.phoneNumber = this.phoneNumber
      }
      try {
        console.log(this.driverForm)
        const response = await axios.put(
          import.meta.env.VITE_API_BASE_URL + '/Driver/' + this.$route.params.driverID,
          this.driverForm,
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
              'Content-Type': 'application/json'
            }
          }
        )
        if (response.status === 204) {
          console.log(response.status)
          this.successAlert = true
          this.wrongAlert = false
          this.emptyAlert = false
          this.$router.push('/add-driver')
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
