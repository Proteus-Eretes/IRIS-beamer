import Vue from 'vue';
import App from './App.vue';
import router from './router';
import BootstrapVue from 'bootstrap-vue';
import {Pagination} from 'bootstrap-vue/es/components';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue);
Vue.use(Pagination);
Vue.config.productionTip = false;

new Vue({
    router,
    render: h => h(App),
}).$mount('#app');
