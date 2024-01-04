<template>
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
        this.$store.commit('setToken', response.data.token) // replace response.data.token with the actual path to the token in the response
        // Handle the response as needed
        console.log('Login response:', response.data)
        this.$router.push('/Home')
      } catch (error) {
        // Handle errors
        console.error('Error during login:', error.message)
      }
    }
  }
}
</script>

<style scoped>
/* Add your custom styles here */
</style>
