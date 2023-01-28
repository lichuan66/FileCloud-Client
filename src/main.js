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

// ws.onopen = () => {
//   ws.send("发送数据");
//   console.log("WebSocket onopen");
// };
// ws.onmessage = function (evt) {
//   console.log("数据已接收..." + evt.data);
// };

export { ws };
