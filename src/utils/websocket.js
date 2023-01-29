import eventBus from "@/utils/eventBus";

class WS {
  ws = null;
  init() {
    this.ws = new WebSocket(`ws://114.132.151.234:3001/userId=admin`);
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
}

export default new WS();
