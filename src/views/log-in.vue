<template>
  <v-container>
    <div v-if="loginAlert" style="padding-bottom: 50px">
      <v-alert
        v-model="loginAlert"
        border="start"
        variant="tonal"
        closable
        close-label="Close Alert"
        color="error"
        title="Wrong Email or Password."
      >
        Check that you entered the correct email and password.
      </v-alert>
    </div>
  </v-container>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title class="headline">Login</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="login">
              <v-text-field v-model="form.email" label="Email" required></v-text-field>
              <v-text-field
                v-model="form.password"
                label="Password"
                type="password"
                required
              ></v-text-field>
              <v-btn type="submit" color="primary">Login</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      loginAlert: false,
      form: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    async login() {
      try {
        // Inside your login method
        const response = await axios.post(
          'http://109.123.253.16/api/v1.0/AdminAccount/login',
          this.form
        )
        if (response.status == 200) {
          this.loginAlert = false
          localStorage.setItem('token', response.data.token)
          localStorage.setItem('adminEmail', response.data.adminDto.user.email)
          localStorage.setItem('adminName', response.data.adminDto.user.name)
          console.log('Login response:', response.data)
          this.$router.push('/Home')
        }
      } catch (error) {
        // Handle errors
        this.loginAlert = true
        console.error('Error during login:', error.message)
      }
    }
  }
}
</script>
