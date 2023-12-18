<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title class="headline">Login</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="login">
              <v-text-field v-model="form.email" label="Email" required></v-text-field>
              <v-text-field v-model="form.password" label="Password" type="password" required></v-text-field>

              <!-- Radio buttons -->
              <!-- <v-radio-group v-model="form.userType">
                <v-radio v-for="type in userTypes" :key="type.value" :label="type.label" :value="type.value"></v-radio>
              </v-radio-group> -->

              <v-btn type="submit" color="primary">Login</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      form: {
        email: '',
        password: '',
        // userType: 'user' // Default user type
      },
      // userTypes: [
      //   { label: 'Admin', value: 'admin' },
      //   { label: 'User', value: 'user' },
      //   { label: 'Guest', value: 'guest' }
      // ]
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://109.123.253.16/api/v1.0/Account/login', this.form);

        // Handle the response as needed
        console.log('Login response:', response.data);
      } catch (error) {
        // Handle errors
        console.error('Error during login:', error.message);
      }
    }
  }
};
</script>

<style scoped>
/* Add your custom styles here */
</style>
