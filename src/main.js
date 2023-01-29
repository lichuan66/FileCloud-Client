import { createApp } from "vue";
import App from "./App.vue";
import routes from "@/routes/index";
import ArcoVue from "@arco-design/web-vue";
import "@arco-design/web-vue/dist/arco.css";
import ArcoVueIcon from "@arco-design/web-vue/es/icon";
import "@/assets/style/style.less";
import ws from "./utils/websocket";

ws.init();
ws.connect();
ws.receiveData();

const app = createApp(App);
app.use(ArcoVue);
app.use(ArcoVueIcon);
app.use(routes);
app.mount("#app");

export { ws };
