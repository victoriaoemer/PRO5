import './assets/main.css'
import { createApp } from 'vue';
import App from './App.vue';



/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faC, faDownload } from '@fortawesome/free-solid-svg-icons'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { faCube } from '@fortawesome/free-solid-svg-icons'
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons'
import {faRotateLeft} from '@fortawesome/free-solid-svg-icons'
import {faVideo} from '@fortawesome/free-solid-svg-icons'
import { faChevronUp} from '@fortawesome/free-solid-svg-icons'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
/* add icons to the library */
library.add(faDownload)
library.add(faPenToSquare)
library.add(faCube)
library.add(faCircleQuestion)
library.add(faRotateLeft)
library.add(faVideo)
library.add(faChevronUp)
library.add(faChevronDown)
createApp(App)
.component('font-awesome-icon', FontAwesomeIcon)
.mount('#app')