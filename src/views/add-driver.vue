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
        title="Driver added successfully"
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
            <v-text-field v-model="firstName" label="First Name" required hide-details>
            </v-text-field>
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
            <v-text-field v-model="phoneNumber" label="Phone Number" hide-details required>
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="10" offset="1">
            <v-text-field v-model="password" label="Password" type="password" required>
            </v-text-field
          ></v-col>
        </v-row>
        <v-row>
          <v-col offset="1">
            <v-btn type="submit" color="blue" @click.prevent="addDriver" style="align-self: center">Add Driver</v-btn>
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
          <tr v-for="driver in drivers" :key="driver.id">
            <td>{{ driver.user.name }}</td>
            <td>{{ driver.user.email }}</td>
            <td>{{ driver.user.phoneNumber }}</td>
            <td class="text-center">
              <v-btn @click="editDriver(driver.id)" icon="mdi-pencil" style="margin: 6px;"></v-btn>
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
  name: 'addDriver',
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
      drivers: []
    }
  },
  created() {
    axios
      .get('http://vmi1560602.contaboserver.net/api/v1.0/Driver', {
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
  computed: {
    driver() {
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
    editDriver(ID) {
      this.$router.push({
        name: 'Edit Driver',
        params: {
          driverID: ID
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
    async addDriver() {
      if (
        !this.firstName ||
        !this.lastName ||
        !this.driver.phoneNumber ||
        !this.driver.email ||
        !this.driver.password
      ) {
        console.error('Missing required Driver fields')
        this.emptyAlert = true
        this.wrongAlert = false
        this.successAlert = false
        return
      } else {
        this.emptyAlert = false
      }
      try {
        const response = await axios.post(
          'http://vmi1560602.contaboserver.net/api/v1.0/Driver/addDriver',
          this.driver,
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
              'Content-Type': 'application/json'
            }
          }
        )
        if (response.status === 200) {
          console.log(response.data)
          this.successAlert = true
          this.wrongAlert = false
          this.emptyAlert = false
          this.resetForm()
          axios
            .get('http://vmi1560602.contaboserver.net/api/v1.0/Driver', {
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

