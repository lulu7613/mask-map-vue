import Vue from 'vue';

import {
  Button,
  Drawer,
  Row,
  Col,
  Input,
  Radio,
  RadioGroup,
  RadioButton,
  Divider,
  Card,
} from 'element-ui';

import App from './App.vue';
import router from './router';
import store from './store';

Vue.use(Button);
Vue.use(Drawer);
Vue.use(Row);
Vue.use(Col);
Vue.use(Input);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Divider);
Vue.use(Card);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
