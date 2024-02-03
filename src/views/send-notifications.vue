<template>
  <v-app>
    <div v-if="successAlert" style="padding-bottom: 50px">
      <v-alert
        v-model="successAlert"
        close-label="Close Alert"
        color="success"
        title="Notification Sent"
        border="start"
        variant="tonal"
        closable
      >
      </v-alert>
    </div>
    <div v-if="failAlert" style="padding-bottom: 50px">
      <v-alert
        v-model="failAlert"
        close-label="Close Alert"
        color="error"
        title="Error"
        border="start"
        variant="tonal"
        closable
      >
        Something went wrong
      </v-alert>
    </div>
    <div v-if="emptyAlert" style="padding-bottom: 50px">
      <v-alert
        v-model="emptyAlert"
        close-label="Close Alert"
        color="error"
        title="Some fields might be empty"
        border="start"
        variant="tonal"
        closable
      >
        Make sure you filled all the fields
      </v-alert>
    </div>
    <v-container :style="anyAlert ? 'padding-top:0px' : 'padding-top:50px'">
      <v-row>
        <v-col>
          <v-text-field label="Title" v-model="title" hide-details></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-textarea label="Message" v-model="message" hide-details></v-textarea>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn @click="sendNotification" color="primary">Send</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      title: '',
      message: '',
      type: 'admin',
      successAlert: false,
      failAlert: false,
      emptyAlert: false
    }
  },
  computed: {
    anyAlert() {
      return this.successAlert || this.failAlert || this.emptyAlert
    }
  },
  methods: {
    sendNotification() {
      console.log(this.title, this.message, this.type, this.value)
      if (this.title === '' || this.message === '') {
        this.emptyAlert = true
        this.successAlert = false
        this.failAlert = false
        return
      }
      axios
        .post(
          import.meta.env.VITE_API_BASE_URL + '/Notification/sendNotisToAll',
          {
            title: this.title,
            body: this.message,
            type: this.type
          },
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
              'Content-Type': 'application/json'
            }
          }
        )
        .then((response) => {
          console.log(response)
          this.successAlert = true
          this.failAlert = false
          this.title = ''
          this.message = ''
        })
        .catch((error) => {
          console.error(error)
          this.successAlert = false
          this.failAlert = true
        })
    }
  }
}
</script>