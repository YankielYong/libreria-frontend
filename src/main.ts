import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
// import './assets/main.css'

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import App from './App.vue';
import router from './router';
import { messages } from './i18n/messages';

// Importaciones de PrimeVue
import PrimeVue from 'primevue/config';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import ConfirmDialog from 'primevue/confirmdialog';
import ConfirmationService from 'primevue/confirmationservice';
import FloatLabel from 'primevue/floatlabel';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Divider from 'primevue/divider';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputIcon from 'primevue/inputicon';
import IconField from 'primevue/iconfield';
import Toolbar from 'primevue/toolbar';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import DataView from 'primevue/dataview';
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';
import MultiSelect from 'primevue/multiselect';
import Calendar from 'primevue/calendar';
import 'primevue/resources/themes/lara-light-green/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

const app = createApp(App);

const i18n = createI18n({
  locale: 'English',
  fallbackLocale: 'English',
  messages,
});

app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(PrimeVue);
app.use(ToastService);
app.use(ConfirmationService);
app.component('Toast', Toast);
app.component('FloatLabel', FloatLabel);
app.component('InputText', InputText);
app.component('Password', Password);
app.component('Button', Button);
app.component('Divider', Divider);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('InputIcon', InputIcon);
app.component('IconField', IconField);
app.component('Toolbar', Toolbar);
app.component('Dialog', Dialog);
app.component('ConfirmDialog', ConfirmDialog);
app.component('Dropdown', Dropdown);
app.component('DataView', DataView);
app.component('InputNumber', InputNumber);
app.component('Textarea', Textarea);
app.component('MultiSelect', MultiSelect);
app.component('Calendar', Calendar);

app.mount('#app');
