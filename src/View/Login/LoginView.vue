<template>
  <div class="login-box">
    <a-form
      class="login-form"
      :model="form"
      :style="{ width: '500px' }"
      @input="showErrorInfo = false"
    >
      <h2>FileGO管理系统</h2>
      <a-form-item field="userName" label="用户名">
        <a-input
          :style="{ width: '300px' }"
          placeholder="请输入账号"
          v-model="form.userName"
        />
      </a-form-item>
      <a-form-item field="password" label="密码">
        <a-input
          :style="{ width: '300px' }"
          placeholder="请输入密码"
          v-model="form.password"
        />
      </a-form-item>
      <span
        :class="[showErrorInfo ? '' : 'err-info-noShow']"
        :style="{ color: 'red' }"
        >账号或密码错误</span
      >
      <a-form-item class="btn-box">
        <a-button
          size="large"
          :style="{ marginLeft: '150px' }"
          type="primary"
          html-type="submit"
          @click="login"
          >登录</a-button
        >
        <a-button
          size="large"
          :style="{ marginLeft: '50px' }"
          html-type="reset"
          @click="reset"
          >重置</a-button
        >
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { userLogin } from "@/request/user.js";
import { useRouter } from "vue-router";

const router = new useRouter();
const showErrorInfo = ref(false);
const form = reactive({
  userName: "",
  password: "",
});

const login = async () => {
  const { data } = await userLogin({
    userName: form.userName,
    password: form.password,
  });
  if (!data) {
    showErrorInfo.value = true;
    reset();
  } else {
    window.localStorage.setItem("userName", data.userName);
    window.localStorage.setItem("token", data.token);
    router.push("/manage/file");
  }
};

const reset = () => {
  form.userName = "";
  form.password = "";
};
</script>

<style scoped lang="less">
.login-box {
  height: 100%;
  width: 100%;
  background: url("@/assets/map_bg.png");
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;

  .login-form {
    background-color: white;
    height: 300px;
    padding: 30px;
    border-radius: 40px;

    .err-info-noShow {
      visibility: hidden;
    }

    .btn-box {
      margin-top: 40px;
      display: block;
    }
  }

  h2 {
    margin-bottom: 35px;
    font-size: 38px;
  }
}
</style>
