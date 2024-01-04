import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './vuetify'
import store from './store' // Path to your store file

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(store) // Use Vuex store

app.mount('#app')