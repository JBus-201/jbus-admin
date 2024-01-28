<template>
  <v-navigation-drawer expand-on-hover rail>
    <v-list>
      <v-list-item
        prepend-avatar="https://static.vecteezy.com/system/resources/previews/021/079/672/original/user-account-icon-for-your-design-only-free-png.png"
        :title="this.$store.state.adminInfo.name"
        :subtitle="this.$store.state.adminInfo.email"
      ></v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list density="compact" nav>
      <v-list-item
        prepend-icon="mdi-map-marker"
        title="Track Buses"
        value="Track Buses"
        :to="{ name: 'Home' }"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-account-plus-outline"
        title="Add Passenger"
        value="Add Passenger"
        :to="{ name: 'Add Passenger' }"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-steering"
        title="Add Driver"
        value="Add Driver"
        :to="{ name: 'Add Driver' }"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-crown-circle"
        title="Add Admin"
        value="Add Admin"
        :to="{ name: 'Add Admin' }"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-routes"
        title="Add Route"
        value="Add Route"
        :to="{ name: 'Add Route' }"
      >
      </v-list-item>
      <v-list-item
        prepend-icon="mdi-bus"
        title="Add Bus"
        value="Add Bus"
        :to="{ name: 'Add Bus' }"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-heart-circle"
        title="Manage Loyalty Points"
        value="Manage Loyalty Points"
        :to="{ name: 'Manage Loyalty Points' }"
      >
      </v-list-item>
      <!-- <v-list-item
        prepend-icon="mdi-bell-cog"
        title="Manage Notifications"
        value="Manage Notifications"
        :to="{ name: 'Manage Notifications' }"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-chart-line"
        title="Generate Report"
        value="Generate Report"
        :to="{ name: 'Generate Report' }"
      ></v-list-item> -->
      <v-divider />
      <v-list-item
        prepend-icon="mdi-logout"
        title="Logout"
        value="Logout"
        @click="logout"
        class="sticky-bottom"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import axios from 'axios'
export default {
  name: 'sideBar',
  methods: {
    logout() {
      axios
        .post(import.meta.env.VITE_API_BASE_URL + '/AdminAccount/logout', null, {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
            'Content-Type': 'application/json'
          }
        })
        .then(() => {
          // console.log('the response:', response)
          localStorage.removeItem('token')
          this.$router.push({ name: 'Login' })
        })
        .catch((error) => {
          console.error(error)
        })
      // this.$router.push({ name: 'Login' })
    }
  }
}
</script>

<style scoped>
.sticky-bottom {
  position: fixed;
  bottom: 0;
}
</style>
