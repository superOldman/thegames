import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';

Vue.use(ElementUI);
import '@/styles/index.scss'
Vue.config.productionTip = false
// Vue.prototype.$bus =
window.$game_bus =  new Vue()
new Vue({
  render: h => h(App),
}).$mount('#app')
