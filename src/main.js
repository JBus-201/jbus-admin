import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './vuetify'
import store from './store' // Path to your store file
import VueGoogleMaps from '@fawmi/vue-google-maps';

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(store) // Use Vuex store

app.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDxNE0VlDOWFQyk5aYx3R8QG2etHa7l59A' // replace with your API key
  }
})

app.mount('#app')
