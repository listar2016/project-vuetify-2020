import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import Axios from 'axios'

Vue.config.productionTip = false

Vue.prototype.$http = Axios;
const API_URL = process.env.API_URL || 'https://staging.riseapp.co.za/api'

Vue.prototype.$http.defaults.baseURL = API_URL
Vue.prototype.$http.defaults.headers.post['Accept'] = 'application/json';
const token = 'de6cb95587738ac442b58f2c4c722d8a9930c10d'
if (token) {
	Vue.prototype.$http.defaults.headers.common['Authorization'] = 'Token  ' + token
}

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
