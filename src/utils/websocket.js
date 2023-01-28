import eventBus from "@/utils/eventBus";

class WS {
  ws = null;
  init() {
    this.ws = new WebSocket(`ws://127.0.0.1:3001/userId=admin`);
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
