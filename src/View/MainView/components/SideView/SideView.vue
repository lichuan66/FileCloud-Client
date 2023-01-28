<template>
  <a-layout-sider breakpoint="lg" :width="250">
    <div class="sider-container">
      <div class="sider-logo">
        <icon-bytedance-color size="45" />
        <span>FileGo</span>
      </div>
      <div class="sider-menu">
        <a-menu
          :defaultSelectedKeys="['0']"
          :style="{ backgroundColor: 'var(--color-fill-2)' }"
        >
          <a-menu-item
            v-for="(item, id) in routerList"
            :key="`${id}`"
            @click="getRouterPath(item, id)"
            :class="[
              'menu-item-common',
              `${id}` === currentRouteMenu ? 'menu-item-select' : '',
            ]"
          >
            <template #icon>
              <IconRender
                :name="item.meta.label"
                :style="{ fontSize: '25px' }"
              />
            </template>
            <span :style="{ fontSize: '18px', color: 'black' }">{{
              item.meta.title
            }}</span>
          </a-menu-item>
        </a-menu>
      </div>
      <div class="sider-info">
        <a-row justify="center" :style="{ textAlign: 'center' }">
          <a-col flex="auto">
            <a-avatar :style="{ backgroundColor: '#3370ff' }" :size="35">
              <IconUser />
            </a-avatar>
          </a-col>
          <a-col flex="100px">
            <span>17860782213</span>
          </a-col>
          <a-col flex="100px" @click="exitSystem">
            <icon-exclamation-circle-fill
              size="25"
              class="sider-info-setting"
            />
          </a-col>
        </a-row>
      </div>
    </div>
  </a-layout-sider>
</template>

<script setup>
import { ref, h } from "vue";
import { useRouter } from "vue-router";
import { IconHome } from "@arco-design/web-vue/es/icon";
import { IconDriveFile, IconFileImage } from "@arco-design/web-vue/es/icon";

const router = useRouter();
const routerList = router
  .getRoutes()
  .filter((item) => item.meta.isShow === true);
console.log(routerList);

const collapsed = ref(false);
const currentRouteMenu = ref("0");

const onCollapse = (val) => {
  collapsed.value = val;
};

const IconRender = (name) => {
  const obj = {
    document: IconDriveFile,
    photo: IconFileImage,
  };
  return h(obj[name.name]);
};

const getRouterPath = (value, id) => {
  currentRouteMenu.value = `${id}`;
  router.push(value.path);
};

const exitSystem = () => {
  window.localStorage.removeItem("token");
  window.localStorage.removeItem("userName");
  router.push("/login");
};
</script>

<style lang="less" scoped>
.sider-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--color-fill-2);
  .sider-logo {
    font-size: 30px;
    height: 80px;
    font-family: Georgia, "Times New Roman", Times, serif;
    display: flex;
    align-items: center;
    justify-content: center;
    // border-bottom: 1px solid #ccc;
    background: rgba(255, 255, 255, 0.2);
  }
  .sider-menu {
    flex: 1;
    .menu-item-common {
      background-color: var(--color-fill-2);
      border-radius: 10px;
      padding: 5px 10px;
      cursor: pointer;
      &:hover {
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
    .menu-item-select {
      background-color: #ccc;
    }
  }
  .sider-info {
    height: 80px;
    line-height: 80px;
    border-top: 1px solid #ccc;

    .sider-info-setting {
      border-radius: 5px;
      padding: 2px;
      vertical-align: middle;
      color: red;
      &:hover {
        cursor: pointer;
        background-color: #ccc;
      }
    }
  }
}
</style>
