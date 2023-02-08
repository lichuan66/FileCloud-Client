<template>
  <div
    :class="['box', selectStatus ? 'select-status' : '']"
    @contextmenu.prevent.stop="boxSettingShowChange"
  >
    <div class="img">
      <img class="img-content" :src="itemRender(meta)" alt="图片" />
    </div>
    <div class="title">{{ meta.name }}</div>
    <div class="descript">{{ meta.modifyTime }}</div>
    <slot name="checkbox"></slot>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  meta: {
    default: () => {
      return {
        name: "前端开发1",
        modifyTime: "2022-07-19",
      };
    },
  },
  selectStatus: {
    default: () => {
      return true;
    },
  },
});

const itemRender = (meta) => {
  const obj = {
    folder: require("@/assets/img/文件夹.svg"),
    uploading: require("@/assets/img/等待文件.svg"),
    "application/vnd.rar": require("@/assets/img/压缩包.svg"),
    "application/zip": require("@/assets/img/压缩包.svg"),
  };
  if (meta.data) {
    return meta.data;
  } else {
    return obj[meta.type];
  }
};
</script>

<style lang="less" scoped>
.box {
  height: 200px;
  width: 150px;
  margin-left: 30px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  position: relative;
  &:hover {
    background-color: rgba(155, 155, 155, 0.2);
    cursor: pointer;
  }
  .img {
    height: 140px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .img-content {
      height: 90%;
      width: 90%;
    }
  }
  .title {
    text-align: center;
    text-overflow: ellipsis;
  }
  .descript {
    text-align: center;
    font-size: 10px;
    margin-top: 5px;
  }
  .box-setting {
    top: 50%;
    left: 50%;
    position: absolute;
    background-color: white;
    border-radius: 5px;

    .box-setting-title {
      height: 20px;
      line-height: 20px;
      font-size: 15px;
      padding: 5px 5px;
      margin: 2px;
      width: 100px;
      border-radius: 5px;
      &:hover {
        background-color: #ccc;
        cursor: pointer;
      }
    }
  }
}
.select-status {
  background-color: rgba(155, 155, 155, 0.2);
}
</style>
