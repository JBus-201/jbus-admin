<script>
import sideBar from './components/side-bar.vue'

export default {
  name: 'main-app',
  data() {
    return {
    }
  },
  components: {
    sideBar
  },
  computed: {
    showSidebar() {
      // Check if the current route is not '/' (i.e. not logging in)
      console.log(this.$route.path)
      return this.$route.path !== '/'
    }
  }
}
</script>

<template>
  <v-app>
    <sideBar v-if="showSidebar" />
    <v-main><router-view style="padding-top: 50px;"> </router-view></v-main>
  </v-app>
</template>

<style scoped></style>
