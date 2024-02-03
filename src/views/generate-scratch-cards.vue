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
        title="Cards generated successfully"
      >
      </v-alert>
    </div>
    <div v-if="errorAlert" style="padding-bottom: 50px">
      <v-alert
        v-model="errorAlert"
        border="start"
        variant="tonal"
        closable
        close-label="Close Alert"
        color="error"
        title="Something went wrong"
      >
      </v-alert>
    </div>
    <v-container style="display: flex" :style="anyAlert ? 'padding-top:0px' : 'padding-top: 50px'">
      <v-row>
        <v-col>
          <v-select v-model="cardType" :items="cardTypes" label="Card Type"></v-select>
        </v-col>
        <v-col>
          <v-text-field label="Quantity" v-model="quantity" hide-details></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            @blur="setDate(numberOfDays)"
            label="Valid for (Days)"
            v-model="numberOfDays"
            hide-details
          ></v-text-field>
        </v-col>
        <v-col style="display: flex">
          <v-btn @click="generateCards" style="align-self: center" color="blue"
            >Generate cards</v-btn
          >
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-table
        fixed-header
        hover
        height="600px"
        :style="anyAlert?'height: 600px; border: 1px solid rgb(217, 217, 217)':'height: 650px; border: 1px solid rgb(217, 217, 217)'"
      >
        <thead>
          <tr>
            <th class="text-left">Card Number</th>
            <th class="text-left">Card Type</th>
            <th class="text-left">Card Status</th>
            <th class="text-left">Expiration Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="card in cards" :key="card.id">
            <td class="text-left">{{ card.cardNumber }}</td>
            <td class="text-left">{{ cardNameAmount[card.type] }}</td>
            <td class="text-left">{{ card.status }}</td>
            <td class="text-left">
              {{ month[card.expiryDate.substring(5, 7)] + ', ' + card.expiryDate.substring(0, 4) }}
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
  data() {
    return {
      successAlert: false,
      errorAlert: false,
      cardTypes: ['1 JD', '2 JD', '4 JD', '5 JD', '10 JD'],
      quantity: null,
      expiryDate: null,
      numberOfDays: 180,
      cardType: null,
      cardAmountNames: {
        '1 JD': 'ONE_JOD',
        '2 JD': 'TWO_JOD',
        '4 JD': 'FOUR_JOD',
        '5 JD': 'FIVE_JOD',
        '10 JD': 'TEN_JOD'
      },
      cardNameAmount: {
        ONE_JOD: '1 JD',
        TWO_JOD: '2 JD',
        FOUR_JOD: '4 JD',
        FIVE_JOD: '5 JD',
        TEN_JOD: '10 JD'
      },
      cards: [],
      month: {
        '01': 'January',
        '02': 'February',
        '03': 'March',
        '04': 'April',
        '05': 'May',
        '06': 'June',
        '07': 'July',
        '08': 'August',
        '09': 'September',
        10: 'October',
        11: 'November',
        12: 'December'
      }
    }
  },
  computed: {
    anyAlert() {
      return this.successAlert || this.errorAlert
    }
  },
  methods: {
    generateCards() {
      if (this.cardType === null || this.quantity === 0 || this.quantity === null || this.numberOfDays === '' || this.numberOfDays === 0 || this.numberOfDays === null) {
        this.errorAlert = true
        this.successAlert = false
        return
      }
      axios
        .post(
          import.meta.env.VITE_API_BASE_URL + '/ScratchCards/' + this.quantity,
          {
            type: this.cardAmountNames[this.cardType],
            expiryDate: this.expiryDate
          },
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`
            }
          }
        )
        .then(() => {
          this.successAlert = true
          this.fillTable()
        })
        .catch((error) => {
          console.error(error)
          this.errorAlert = true
        })
    },
    setDate(numberOfDays) {
      let expDate = new Date()
      console.log('expDate', expDate)
      console.log('numberOfDays', numberOfDays)
      expDate.setDate(expDate.getDate() + parseInt(numberOfDays))
      this.expiryDate = expDate.toISOString()
      console.log(this.expiryDate)
    },
    fillTable() {
      axios
        .get(import.meta.env.VITE_API_BASE_URL + '/ScratchCards', {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`
          }
        })
        .then((response) => {
          this.cards = response.data
        })
        .catch((error) => {
          console.error(error)
        })
    }
  },
  created() {
    this.fillTable()
  }
}
</script>