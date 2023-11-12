import { createVuetify } from 'vuetify'

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const theme = {
  dark: true
}

export default createVuetify({ components, directives, theme })
