<template>
  <v-navigation-drawer expand-on-hover rail>
    <v-list>
      <v-list-item
        prepend-avatar="https://static.vecteezy.com/system/resources/previews/021/079/672/original/user-account-icon-for-your-design-only-free-png.png"
        :title=this.$store.state.adminInfo.name
        :subtitle=this.$store.state.adminInfo.email
      ></v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list density="compact" nav>
      <v-list-item
        prepend-icon="mdi-map-marker"
        title="Track Buses"
        value="Track Buses"
        to="Home"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-account-plus-outline"
        title="Add Passenger"
        value="Add Passenger"
        to="add-passenger"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-account-plus-outline"
        title="Add Driver"
        value="Add Driver"
        to="add-driver"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-crown-circle"
        title="Add Admin"
        value="Add Admin"
        to="add-Admin"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-bus"
        title="Add-Edit Bus"
        value="Add-Edit Bus"
        to="add-edit-bus"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-routes"
        title="Add Route"
        value="Add Route"
        to="add-route"
      >
      </v-list-item>
      <v-list-item
        prepend-icon="mdi-heart-circle"
        title="Manage Loyalty Points"
        value="Manage Loyalty Points"
        to="manage-loyalty-points"
      >
      </v-list-item>
      <v-list-item
        prepend-icon="mdi-bell-cog"
        title="Manage Notifications"
        value="Manage Notifications"
        to="manage-notifications"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-chart-line"
        title="Generate Report"
        value="Generate Report"
        to="generate-reports"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'sideBar',
  data() {
    return {
      username: 'Admin',
      email: 'Admin@gmail.com'
    }
  }
}
</script>
