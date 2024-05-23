// import './assets/main.css'

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

// Importaciones de PrimeVue
import PrimeVue from 'primevue/config';
import FloatLabel from 'primevue/floatlabel';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Divider from 'primevue/divider';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import 'primevue/resources/themes/lara-light-green/theme.css';
// import 'primeicons/primeicons.css'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue);
app.component('FloatLabel', FloatLabel);
app.component('InputText', InputText);
app.component('Password', Password);
app.component('Button', Button);
app.component('Divider', Divider);
app.component('DataTable', DataTable);
app.component('Column', Column);

app.mount('#app');
