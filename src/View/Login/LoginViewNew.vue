<template>
  <div class="box">
    <div class="shell">
      <div ref="aContainer" class="container a-container" id="a-container">
        <form action="" method="" class="form" id="a-form">
          <h2 class="form_title title">登录账号</h2>
          <!-- <span>选择注册方式激活电子邮箱注册</span> -->
          <input
            type="text"
            class="form_input"
            placeholder="Username"
            v-model="form.userName"
            @input="showErrorInfo = false"
          />
          <input
            type="text"
            class="form_input"
            placeholder="PassWord"
            v-model="form.password"
            @input="showErrorInfo = false"
          />

          <span
            :class="[showErrorInfo ? '' : 'err-info-noShow']"
            :style="{ color: 'red' }"
            >账号或密码错误</span
          >
          <a href="" class="form_link">忘记密码</a>

          <button
            :ref="allButtons"
            class="form_submit button submit"
            @click="login"
          >
            SIGN IN
          </button>
        </form>
      </div>

      <div ref="bContainer" class="container b-container" id="b-container">
        <form
          action=""
          method=""
          class="form"
          id="b-form"
          onsubmit="
            (e) => {
              console.log(12);

              e.preventDefault();
            }
          "
        >
          <h2 class="form_title title">创建账号</h2>
          <!-- <span>选择注册方式激活电子邮箱注册</span> -->
          <input
            type="text"
            class="form_input"
            placeholder="Username"
            v-model="form.userName"
          />
          <input
            type="text"
            class="form_input"
            placeholder="PassWord"
            v-model="form.password"
          />
          <input
            type="text"
            class="form_input"
            placeholder="Email"
            v-model="form.email"
          />
          <button
            :ref="allButtons"
            class="form_submit button submit"
            @click="signUp"
          >
            SIGN UP
          </button>
        </form>
      </div>

      <div ref="switchCtn" class="switch" id="switch-cnt">
        <div :ref="switchCircle" class="switch_circle"></div>
        <div :ref="switchCircle" class="switch_circle switch_circle-t"></div>
        <div ref="switchC1" v class="switch_container" id="switch-c1">
          <h2 class="switch_title" style="letter-spacing: 0">Hello Friend!</h2>
          <p>去注册一个账号, 让我们踏上奇妙之旅吧!!</p>
          <button :ref="switchBtn" class="switch_button button switch-btn">
            SIGN UP
          </button>
        </div>

        <div ref="switchC2" class="switch_container is-hidden" id="switch-c2">
          <h2 class="switch_title" style="letter-spacing: 0">Welcome Back!</h2>
          <p>已经有账号了嘛? 去登录账号来进入奇妙世界吧!!</p>
          <button :ref="switchBtn" class="switch_button button switch-btn">
            SIGN IN
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { userLogin, userSignUp } from "@/request/user.js";
import { useRouter } from "vue-router";
import { Message } from "@arco-design/web-vue";

const router = new useRouter();
const showErrorInfo = ref(false);
const form = reactive({
  userName: "",
  password: "",
  email: "",
});

const reset = () => {
  form.userName = "";
  form.password = "";
  form.email = "";
};

const login = async () => {
  const { data } = await userLogin({
    userName: form.userName,
    password: form.password,
  });
  if (!data) {
    showErrorInfo.value = true;
    reset();
  } else {
    Message.success("登录成功");
    window.localStorage.setItem("userName", data.userName);
    window.localStorage.setItem("token", data.token);
    router.push("/manage/file");
  }
};

const signUp = async () => {
  if (!form.userName || !form.password || !form.email) {
    Message.error("账号、密码或邮箱未填写");
    return;
  }
  const { data, status, errMsg } = await userSignUp({
    userName: form.userName,
    password: form.password,
    email: form.email,
  });
  console.log(status, errMsg);
  if (!status) {
    Message.error(errMsg);
    reset();
  } else {
    Message.success("创建成功");
    window.localStorage.setItem("userName", data.userName);
    window.localStorage.setItem("token", data.token);
    router.push("/manage/file");
  }
};

// 渲染页面动态

const switchCtn = ref(null);
const switchC1 = ref(null);
const switchC2 = ref(null);
const itemRef = ref([]);
const switchCircle = (el) => {
  itemRef.value.push(el);
};
const switchBtnRef = ref([]);
const switchBtn = (el) => {
  switchBtnRef.value.push(el);
};
const aContainer = ref(null);
const bContainer = ref(null);
const allButtonsRef = ref([]);
const allButtons = (el) => {
  allButtonsRef.value.push(el);
};

const getButtons = (e) => e.preventDefault();
const changeForm = (e) => {
  switchCtn.value.classList.add("is-gx");
  setTimeout(() => {
    switchCtn.value.classList.remove("is-gx");
  }, 1500);
  switchCtn.value.classList.toggle("is-txr");
  itemRef.value[0].classList.toggle("is-txr");
  itemRef.value[1].classList.toggle("is-txr");

  switchC1.value.classList.toggle("is-hidden");
  switchC2.value.classList.toggle("is-hidden");
  aContainer.value.classList.toggle("is-txl");
  bContainer.value.classList.toggle("is-txl");
  bContainer.value.classList.toggle("is-z");
};
const shell = (e) => {
  for (let i = 0; i < allButtonsRef.value.length; i++) {
    allButtonsRef.value[i].addEventListener("click", getButtons);
  }
  for (let i = 0; i < switchBtnRef.value.length; i++) {
    switchBtnRef.value[i].addEventListener("click", changeForm);
  }
};

onMounted(() => {
  shell();
});
// window.addEventListener("load", shell);
</script>

<style lang="less" scoped>
.box {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  background-color: #ecf0f3;
  color: #a0a5a8;
}
.shell {
  position: relative;
  width: 1000px;
  min-width: 1000px;
  min-height: 600px;
  height: 600px;
  padding: 25px;
  background-color: #ecf0f3;
  box-shadow: 10px 10px 10px #d1d9e6, -10px -10px 10px #f9f9f9;
  border-radius: 12px;
  overflow: hidden;
}
// 设置响应式
@media (max-width: 1200px) {
  .shell {
    transform: scale(0.7);
  }
}

@media (max-width: 1000px) {
  .shell {
    transform: scale(0.6);
  }
}

@media (max-width: 800px) {
  .shell {
    transform: scale(0.5);
  }
}

@media (max-width: 600px) {
  .shell {
    transform: scale(0.4);
  }
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  width: 600px;
  height: 100%;
  padding: 25px;
  background-color: #ecf0f3;
  transition: 1.25s;
}
.form {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.form_input {
  width: 350px;
  height: 40px;
  margin: 4px 0;
  padding-left: 25px;
  font-size: 13px;
  letter-spacing: 0.15px;
  border: none;
  outline: none;
  background-color: #ecf0f3;
  transition: 0.25s ease;
  border-radius: 8px;
  box-shadow: inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #f9f9f9;
  &:focus {
    box-shadow: inset 4px 4px 4px #d1d9e6, inset -4px -4px 4px #f9f9f9;
  }
}
.form_link {
  color: #181818;
  font-size: 15px;
  margin-top: 25px;
  border-bottom: 1px solid #a0a5a8;
  line-height: 2;
}
.title {
  font-size: 34px;
  font-weight: 700;
  line-height: 3;
  color: #181818;
  letter-spacing: 10px;
}

.description {
  font-size: 14px;
  letter-spacing: 0.25px;
  text-align: center;
  line-height: 1.6;
}

.button {
  width: 180px;
  height: 50px;
  border-radius: 25px;
  margin-top: 50px;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 1.15px;
  background-color: #4b70e2;
  color: #f9f9f9;
  box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #f9f9f9;
  border: none;
  outline: none;
}

.a-container {
  z-index: 100;
  left: calc(100% - 600px);
}

.b-container {
  left: calc(100% - 600px);
  z-index: 0;
}
.switch {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 400px;
  padding: 50px;
  z-index: 200;
  transition: 1.25s;
  background-color: #ecf0f3;
  overflow: hidden;
  box-shadow: 4px 4px 10px #d1d9e6, -4px -4px 10px #d1d9e6;
}

.switch_circle {
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background-color: #ecf0f3;
  box-shadow: inset 8px 8px 12px #b8bec7, inset -8px -8px 12px #fff;
  bottom: -60%;
  left: -60%;
  transition: 1.25s;
}

.switch_circle-t {
  top: -30%;
  left: 60%;
  width: 300px;
  height: 300px;
}

.switch_container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: absolute;
  width: 400px;
  padding: 50px 55px;
  transition: 1.25s;
}

.switch_button,
.submit {
  cursor: pointer;
}

.switch_button:hover,
.submit:hover {
  box-shadow: 6px 6px 10px #d1d9e6, -6px -6px 10px #f9f9f9;
  transform: scale(0.985);
  transition: 0.25s;
  cursor: pointer;
}

.switch_button:active,
.switch_button:focus {
  box-shadow: 2px 2px 6px #d1d9d6, -2px -2px 6px #f9f9f9;
  transform: scale(0.97);
  transition: 0.25s;
}

.is-txr {
  left: calc(100% - 400px);
  transition: 1.25s;
  transform-origin: left;
}

.is-txl {
  left: 0;
  transition: 1.25s;
  transform-origin: right;
}

.is-z {
  z-index: 200;
  transition: 1.25s;
}

.is-hidden {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  transition: 1.25s;
}

.is-gx {
  animation: is-gx 1.25s;
}

@keyframes is-gx {
  0%,
  10%,
  100% {
    width: 100%;
  }

  30%,
  50% {
    width: 500px;
  }
}

.err-info-noShow {
  visibility: hidden;
}
</style>
