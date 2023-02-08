import eventBus from "@/utils/eventBus";
import { IP, WebSocket_PORT } from "@/config/ipConfig";

const url = `ws://${IP}:${WebSocket_PORT}/userId=admin`;

class WS {
  constructor(option) {
    this.url = option.url;
    this.webSocketType = option.webSocketType;
    this.option = option;
    this.websocket = null;
    this.init();
  }
  ws = null;
  init() {
    const _this = this;
    if (typeof WebSocket === "undefined") {
      this.$message.error("您的浏览器不支持socket");
    } else {
      this.websocket = new WebSocket(url);
      this.websocket.onopen = function (evt) {
        _this.onOpen(evt);
      };
      this.websocket.onmessage = function (evt) {
        _this.onMessage(evt);
      };
      this.websocket.onclose = function (evt) {
        // debugger;
        _this.onClose(evt);
      };

      this.websocket.onerror = function (evt) {
        _this.onError(evt);
      };
    }
    // this.ws = new WebSocket(`ws://${IP}:${WebSocket_PORT}/userId=admin`);
  }
  connect() {
    this.ws.onopen = () => {
      this.ws.send("发送数据");
      console.log("WebSocket onopen");
    };
  }
  receiveData() {
    this.ws.onmessage = (evt) => {
      const funcType = JSON.parse(evt.data).funcType;
      eventBus.emit(funcType, JSON.parse(evt.data));
    };
  }

  onOpen(evt) {
    let _this = this;
    // 心跳检验
    var heartCheck = {
      timeout: 5000, //5秒
      timeoutObj: null,
      reset: function () {
        clearInterval(this.timeoutObj);
        return this;
      },
      start: function () {
        let thisHeartCheck = this;
        _this.websocket.send("HeartBeat");
        // this.timeoutObj = setInterval(function () {
        // _this.websocket.send("HeartBeat"); // 发送心跳信息，保持不断
        // if (
        //   _this.websocket.readyState != 1 ||
        //   (_this.webSocketType &&
        //     _this.webSocketType == "XXX" &&
        //     Cookies.get("XXX") == "false")
        // ) {
        //   thisHeartCheck.reset();
        //   _this.onClose();
        // } else {
        //   _this.websocket.send("HeartBeat"); // 发送心跳信息，保持不断
        // }
        // }, this.timeout);
      },
    };

    console.log("websock连接成功");
    heartCheck.reset().start();
  }

  // 从后台接收参数
  onMessage(evt) {
    const funcType = JSON.parse(evt.data).funcType;
    eventBus.emit(funcType, JSON.parse(evt.data));
    // if (this.option && this.option.onMessageCallBack instanceof Function) {
    //   this.option.onMessageCallBack(evt.data ? JSON.parse(evt.data) : "");
    // }
    // this.websocket.close();
  }
  onClose(evt) {
    this.websocket.close();
    console.log("websocket关闭");
  }
}

export default new WS({
  url: "ws://${IP}:${WebSocket_PORT}/userId=admin",
  webSocketType: "XX",
  onMessageCallBack: "回调方法",
});
