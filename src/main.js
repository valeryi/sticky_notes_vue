import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import SnackBarPlugin from '@/plugins/snackBar';

Vue.use(SnackBarPlugin);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
