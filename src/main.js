import {createApp} from "vue";
import App from './App.vue'
import store from "./store";

//開発中は true にしたほうがいいかも true の場合の方が開発者向けのメッセージがコンソールによりたくさん出る
// Vue.config.productionTip = false;

//4系はおそらくこれ
const app = createApp(App)
app.use(store)
app.mount('#app')

//Vueの3系はこれで行けた
// new Vue({
// 	//storeをローカルに登録
// 	//これでどこからでも使える
// 	store,
// 	render: (h) => h(App),
// }).$mount("#app");