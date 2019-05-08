import Vue from 'vue'
import App from './App.vue'

import $ from 'jquery'

import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';


Vue.use(Element, { size: 'small', zIndex: 3000 });

Vue.config.productionTip = false

Vue.prototype.$ = $;

new Vue({
  render: h => h(App),
}).$mount('#app')
