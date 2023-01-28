<template>
  <div class="image-show-background">
    <div ref="image_show_box" id="container" class="image-show-box"></div>
    <div class="header-setting">
      <a-row class="header-setting-grid" style="margin-bottom: 16px">
        <a-col class="setting-left" flex="auto" :style="{ marginLeft: '30px' }">
          <a-button class="close-btn" shape="circle" @click="clickCloseBtn">
            <icon-close :style="{ color: 'white' }" />
          </a-button>
        </a-col>
        <a-col
          class="setting-right"
          flex="40px"
          :style="{ textAlign: 'center' }"
        >
          <icon-download />
        </a-col>
        <a-col
          class="setting-right"
          flex="40px"
          :style="{ textAlign: 'center' }"
        >
          <icon-share-internal />
        </a-col>
        <a-col
          class="setting-right"
          flex="40px"
          :style="{ textAlign: 'center', marginRight: '20px' }"
        >
          <icon-delete />
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, nextTick, watch } from "vue";
import Konva from "konva";

const props = defineProps({
  closeImageShow: Function,
  imageShowMeta: Object,
});

const image_show_box = ref(null);
const stage = ref(null);
const layer = ref(null);
const group = ref(null);

const clickCloseBtn = () => {
  props.closeImageShow();
};

const getScale = (borderWidth, borderHeight, imageWidth, imageHeight) => {
  let scale = 1;
  if (borderWidth >= imageWidth && borderHeight >= imageHeight) {
    if (
      Math.abs(borderWidth - imageWidth) <= Math.abs(borderHeight - imageHeight)
    ) {
      scale = Math.round((borderWidth / imageWidth) * 100) / 100;
    } else {
      scale = Math.round((borderHeight / imageHeight) * 100) / 100;
    }
  } else if (borderWidth < imageWidth && borderHeight < imageHeight) {
    if (
      Math.abs(borderWidth - imageWidth) > Math.abs(borderHeight - imageHeight)
    ) {
      scale = Math.floor((borderWidth / imageWidth) * 100) / 100;
    } else {
      scale = Math.floor((borderHeight / imageHeight) * 100) / 100;
    }
  } else if (borderWidth < imageWidth && borderHeight >= imageHeight) {
    scale = Math.floor((borderWidth / imageWidth) * 100) / 100;
  } else if (borderWidth >= imageWidth && borderHeight < imageHeight) {
    scale = Math.floor((borderHeight / imageHeight) * 100) / 100;
  }
  return scale;
};

// group鼠标滚轮缩放
const scaleChangeHandle = (e) => {
  const max = 10; // 放大最大的比例
  const min = 0.05; // 缩小最小的比例
  const step = 0.1; // 每次缩放的比例

  const x = e.evt.offsetX; // 当前鼠标距离layer图层左上角的位置,初始是(0,0)
  const y = e.evt.offsetY;

  const offsetX =
    ((x - group.value.offsetX()) * group.value.scaleX()) /
      (group.value.scaleX() - step) -
    (x - group.value.offsetX());
  const offsetY =
    ((y - group.value.offsetY()) * group.value.scaleY()) /
      (group.value.scaleY() - step) -
    (y - group.value.offsetY());

  if (e.evt.wheelDelta && e.evt.wheelDelta > 0) {
    // 放大
    if (group.value.scaleX() < max && group.value.scaleY() < max) {
      group.value.scaleX(group.value.scaleX() + step);
      group.value.scaleY(group.value.scaleY() + step);
      group.value.move({ x: -offsetX, y: -offsetY }); // 跟随鼠标偏移位置
    }
  } else if (e.evt.wheelDelta && e.evt.wheelDelta <= 0) {
    // 缩小
    if (group.value.scaleX() > min && group.value.scaleY() > min) {
      group.value.scaleX(group.value.scaleX() - step);
      group.value.scaleY(group.value.scaleY() - step);
      group.value.move({ x: offsetX, y: offsetY }); // 跟随鼠标偏移位置
    }
  }
  group.value.draw();
};

// 双击回初始状态
const scaleBackOrigin = () => {
  group.value.scaleX(1);
  group.value.scaleY(1);
  group.value.x(0);
  group.value.y(0);
  group.value.draw();
};

const drawImage = () => {
  const borderWidth = image_show_box.value.clientWidth;
  const borderHeight = image_show_box.value.clientHeight;

  stage.value = new Konva.Stage({
    container: "container",
    width: borderWidth,
    height: borderHeight,
  });

  layer.value = new Konva.Layer();
  stage.value.add(layer.value);

  group.value = new Konva.Group({
    draggable: true,
  });
  layer.value.add(group.value);

  group.value.on("wheel", (e) => {
    scaleChangeHandle(e);
  });

  stage.value.on("dblclick", () => {
    scaleBackOrigin();
  });

  const imageObj = new Image();
  console.log(props.imageShowMeta);
  imageObj.src = props.imageShowMeta.data || "";
  imageObj.onload = () => {
    console.log(imageObj.width, imageObj.height);
    const imageWidth = imageObj.width;
    const imageHeight = imageObj.height;
    const scale = getScale(borderWidth, borderHeight, imageWidth, imageHeight);

    const temp = new Konva.Image({
      x: (borderWidth - imageWidth * scale) / 2,
      y: (borderHeight - imageHeight * scale) / 2,
      image: imageObj,
      width: imageWidth * scale,
      height: imageHeight * scale,
      fill: "white",
    });
    group.value.add(temp);
  };
};

nextTick(() => {
  drawImage();
});

watch(
  () => props.imageShowMeta.data,
  () => {
    drawImage();
  }
);
</script>

<style lang="less" scoped>
.image-show-background {
  background-color: rgb(17, 17, 19);
  color: white;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  .image-show-box {
    height: 100%;
    width: 100%;
    position: absolute;
  }
  .header-setting-grid {
    position: absolute;
    width: 100%;
    margin-top: 20px;
    height: 30px;
    line-height: 30px;
    font-size: 20px;
    .close-btn {
      background-color: transparent;
      &:hover {
        background-color: rgba(255, 255, 255, 0.4);
      }
    }
    .setting-right {
      border-radius: 15px;
      &:hover {
        background-color: rgba(255, 255, 255, 0.4);
        cursor: pointer;
      }
    }
  }
}
</style>
