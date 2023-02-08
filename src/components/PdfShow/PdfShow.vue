<template>
  <div class="pdf-show-background">
    <div class="header-setting">
      <a-row class="header-setting-grid">
        <a-col class="setting-left" flex="80px" :style="{ marginLeft: '30px' }">
          <a-button class="close-btn" shape="circle" @click="clickCloseBtn">
            <icon-close />
          </a-button>
        </a-col>
        <a-col
          flex="auto"
          class="settinf-middle title"
          :style="{ textAlign: 'center', color: 'black' }"
        >
          <span>{{ pdfShowMeta.name }}</span>
        </a-col>
        <a-col
          class="setting-right"
          flex="100px"
          :style="{ textAlign: 'center', color: 'black' }"
        >
          <span class="last-page"><icon-arrow-left />上一项</span>
        </a-col>
        <a-col
          class="setting-right"
          flex="100px"
          :style="{ textAlign: 'center', color: 'black' }"
        >
          <span class="next-page">下一项<icon-arrow-right /></span>
        </a-col>
        <a-col
          class="setting-right menu"
          flex="40px"
          :style="{ textAlign: 'center', marginRight: '20px', color: 'black' }"
        >
          <icon-unordered-list />
        </a-col>
      </a-row>
    </div>
    <div class="content-setting">
      <div class="modal-box" v-if="showLoading">
        <div class="modal-dialog">
          <div class="modal-icon">
            <img
              class="img-content"
              src="@/assets/img/文档.svg"
              alt="图片"
              :style="{ width: '100px', height: '100px' }"
            />
          </div>
          <div class="modal-title">
            <span>多人协作在线文档</span>
          </div>
          <div class="modal-loading">
            <icon-sync class="icon-loading" :style="{ fontSize: '32px' }" />
          </div>
        </div>
      </div>
      <div ref="pdf_show_box" id="container" class="pdf-show-box container">
        <div
          class="wrapper-scroll"
          id="wrapper_scroll"
          ref="wrapper_scroll"
          :style="{ height: totalHeight + 'px', position: 'relative' }"
        >
          <!-- <div
            v-for="item in showItem"
            :key="item"
            class="pageItem"
            :id="`pageItem_${item}`"
            :style="{marginTop: '20px'}"
          >
            <canvas class="canvas" :style="{ width: '100%' }"></canvas>
          </div> -->
        </div>
      </div>
      <div class="pdf-show-bottom"></div>
    </div>
  </div>
</template>

<script setup>
/*eslint no-import-assign: "error"*/
import { defineProps, ref, watch, nextTick, computed, watchEffect } from "vue";
import Konva from "konva";
import { getScale } from "@/utils/handleData";
import * as pdfJS from "pdfjs-dist/legacy/build/pdf.js";
pdfJS.GlobalWorkerOptions.workerSrc =
  "https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.js";

const props = defineProps({
  closeImageShow: Function,
  deletePdfData: Function,
  pdfShowMeta: Object,
});

const pdf_show_box = ref(null);
const wrapper_scroll = ref(null);
const showLoading = ref(true);
const storeRenderContext = ref({});
const renderedPage = new Set();
var PDFOBJ = null;
const CSS_UNITS = ref(1);

// --------------------------------虚拟滚动-----------------------------------
const showItem = ref([]);
const pageHeight = ref(0);
const totalHeight = ref(0);
const startKey = ref(0);
// //片段容器偏移量
// let scrollTopWrapper = ref(0);
// //视窗内应该显示的 DOM 数量
const showItemNum = ref(0);
// //容器高度
const wrapperHeight = ref(0);
const pagesNum = ref(0);

// const data = ref({
//   // 列表第一项的高度（起始高度）
//   initH: 0,

//   // 一行的高度
//   unitH: 0,

//   // 屏幕范围内能显示个数
//   displayCount: 1,

//   // 列表起始值
//   startIdx: 0,
// });

// // 屏幕高度
// const screenH = document.documentElement.clientHeight;

// const curListData = computed(() => {
//   let endIdx = data.value.startIdx + data.value.displayCount;
//   if (endIdx >= listData.value.length) endIdx = listData.value.length;

//   return listData.value.slice(data.value.startIdx, endIdx).map((v, k) => {
//     v.idx = data.value.startIdx + k + 1;
//     return v;
//   });
// });

// const scrollHandler = () => {
//   // 当前滚动高度
//   const curScrollTop = document.documentElement.scrollTop;
//   if (curScrollTop > data.value.initH) {
//     const addCount = Math.floor(
//       (curScrollTop - data.value.initH) / data.value.unitH
//     );
//     // ulRef.value.style.setProperty(
//     //   "padding-top",
//     //   `${addCount * data.value.unitH}px`
//     // );
//     data.value.startIdx = addCount;
//   } else {
//     // ulRef.value.style.setProperty("padding-top", "0px");
//     data.value.startIdx = 0;
//   }
// };

// const loadingStatus = computed(() => {
//   if (!props.pdfShowMeta.data) {
//     return true;
//   } else {
//     return false;
//   }
// });

// const getPageData = () => {
//   let decodedBase64 = atob(props.pdfShowMeta.data);
//   pdfJS.getDocument({ data: decodedBase64 }).promise.then(async (pdf) => {
//     pagesNum.value = pdf.numPages;
//     if (pagesNum.value > 0) {
//       const scale = 1; //缩放倍数，1表示原始大小
//       const rotation = 0;
//       const CSS_UNITS = 96.0 / 72.0;
//       for (let i = 1; i <= pagesNum.value; i++) {
//         const page = await pdf.getPage(i); //调用getPage方法传入当前循环的页数,返回一个page对象
//         const viewport = page.getViewport({ scale, rotation });
//         // const pageWidth = Math.floor(viewport.width * CSS_UNITS);
//         if (i === 1) {
//           pageHeight.value = Math.floor(viewport.height * CSS_UNITS);
//           totalHeight.value = pageHeight.value * pagesNum.value;
//           //获取容器高度
//           wrapperHeight.value = pdf_show_box.value.clientHeight;
//           //运算出应该显示的 DOM 数量
//           showItemNum.value = Math.ceil(wrapperHeight.value / pageHeight.value);
//           showItem.value = Array.from(new Array(pagesNum.value).keys()).slice(
//             startKey.value,
//             showItemNum.value + startKey.value + 2
//           );
//         }
//       }
//     }
//   });
// };

// const scrollHandler = (e) => {
//   const tempNum = Math.floor(e.target.scrollTop / pageHeight.value) + 1;
//   if (tempNum !== startKey.value) {
//     startKey.value = tempNum;
//     showItem.value = Array.from(new Array(pagesNum.value).keys()).slice(
//       startKey.value,
//       showItemNum.value + startKey.value + 2
//     );
//     scrollTopWrapper.value = e.target.scrollTop;
//     console.log(startKey.value, scrollTopWrapper.value);
//   }
// };

// const showItem = computed(() => {
//   return Array.from(new Array(pagesNum.value).keys()).slice(
//     startKey.value,
//     showItemNum.value + startKey.value + 2
//   );
// });
// --------------------------------虚拟滚动-----------------------------------

const clickCloseBtn = () => {
  props.closeImageShow();
};

const showPdf = async () => {
  pdfJS.getDocument(props.pdfShowMeta.url).promise.then(async (pdf) => {
    PDFOBJ = pdf;
    pagesNum.value = pdf.numPages;
    if (pagesNum.value >= 10) {
      CSS_UNITS.value = 96.0 / 72.0;
    } else {
      CSS_UNITS.value = 96.0 / 24.0;
    }
    if (pagesNum.value > 0) {
      const page = await pdf.getPage(1); //调用getPage方法传入当前循环的页数,返回一个page对象
      const scale = 1; //缩放倍数，1表示原始大小
      const rotation = 0;
      const viewport = page.getViewport({ scale, rotation });
      pageHeight.value = viewport.height;
      totalHeight.value = pageHeight.value * pagesNum.value;
      wrapperHeight.value = pdf_show_box.value.clientHeight;
      showItemNum.value = Math.ceil(wrapperHeight.value / pageHeight.value);
      startKey.value = 1;
      for (
        let i = startKey.value;
        i <
        Math.min(showItemNum.value + startKey.value + 2, pagesNum.value + 1);
        i++
      ) {
        if (!renderedPage.has(i)) {
          const div = document.createElement("div");
          const canvas = document.createElement("canvas");
          div.setAttribute("class", "pageItem");
          div.setAttribute("id", `pageItem_${i}`);
          div.setAttribute("style", "margin-top: 20px");
          canvas.setAttribute("style", "width: 100%");
          canvas.setAttribute("class", "canvas"); //给canvas节点定义一个class名,这里我取名为canvasv
          canvas.setAttribute("id", `canvas_${i}`); //给canvas节点定义一个class名,这里我取名为canvasv
          const scale = 1; //缩放倍数，1表示原始大小
          const rotation = 0;
          const page = await PDFOBJ.getPage(i);
          const viewport = page.getViewport({ scale, rotation });
          const context = canvas.getContext("2d"); //创建绘制canvas的对象
          const pageWidth = Math.floor(viewport.width * CSS_UNITS.value);
          const pageHeight = Math.floor(viewport.height * CSS_UNITS.value);
          canvas.width = pageWidth;
          canvas.height = pageHeight;
          const renderContext = {
            transform: [CSS_UNITS.value, 0, 0, CSS_UNITS.value, 0, 0],
            canvasContext: context,
            viewport: viewport,
          };
          div.appendChild(canvas);
          await page.render(renderContext);
          storeRenderContext.value[i] = renderContext;
          renderedPage.add(i);
          wrapper_scroll.value.appendChild(div);
        }
      }
    }
    showLoading.value = false;
  });
};

const handleScrolls = async (e) => {
  const tempNum = Math.floor(e.target.scrollTop / pageHeight.value) + 1;
  if (tempNum !== startKey.value) {
    startKey.value = tempNum;
    for (
      let i = startKey.value;
      i < Math.min(showItemNum.value + startKey.value + 2, pagesNum.value + 1);
      i++
    ) {
      // const ty = sonHeight[i - 1].getBoundingClientRect().top;
      // const selfHeight = sonHeight[i - 1].clientHeight;
      // if (ty < 60 + scope && ty > -selfHeight + 60) {
      if (!renderedPage.has(i)) {
        const div = document.createElement("div");
        const canvas = document.createElement("canvas");
        div.setAttribute("class", "pageItem");
        div.setAttribute("id", `pageItem_${i}`);
        div.setAttribute("style", "margin-top: 20px");
        canvas.setAttribute("style", "width: 100%");
        canvas.setAttribute("class", "canvas"); //给canvas节点定义一个class名,这里我取名为canvasv
        canvas.setAttribute("id", `canvas_${i}`); //给canvas节点定义一个class名,这里我取名为canvasv
        const scale = 1; //缩放倍数，1表示原始大小
        const rotation = 0;
        const page = await PDFOBJ.getPage(i);
        const viewport = page.getViewport({ scale, rotation });
        const context = canvas.getContext("2d"); //创建绘制canvas的对象
        const pageWidth = Math.floor(viewport.width * CSS_UNITS.value);
        const pageHeight = Math.floor(viewport.height * CSS_UNITS.value);
        canvas.width = pageWidth;
        canvas.height = pageHeight;
        const renderContext = {
          transform: [CSS_UNITS.value, 0, 0, CSS_UNITS.value, 0, 0],
          canvasContext: context,
          viewport: viewport,
        };
        div.appendChild(canvas);
        await page.render(renderContext);
        storeRenderContext.value[i] = renderContext;
        renderedPage.add(i);
        wrapper_scroll.value.appendChild(div);
      }
    }
  }
};

window.addEventListener("scroll", handleScrolls, true); //监听滚动事件

window.removeEventListener("scroll", handleScrolls);

nextTick(() => {
  showPdf();
});
</script>

<style lang="less" scoped>
.pdf-show-background {
  overflow: hidden;
  background-color: white;
  color: white;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  .header-setting-grid {
    background-color: white;
    height: 60px;
    line-height: 60px;
    .close-btn {
      background-color: transparent;
      &:hover {
        background-color: rgba(0, 0, 0, 0.2);
      }
    }

    .next-page,
    .last-page {
      border-radius: 10px;
      padding: 5px 8px;
      &:hover {
        background-color: rgba(0, 0, 0, 0.2);
        cursor: pointer;
      }
    }
  }
  .content-setting {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: auto;
    position: relative;

    .pdf-show-box {
      flex: 1;
      background-color: rgb(242, 244, 247);
      padding-right: 10px;
      overflow: auto;
    }

    .pdf-show-bottom {
      height: 20px;
      background-color: beige;
    }
    .modal-box {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background-color: rgb(242, 244, 247);
      display: flex;
      justify-content: center;
      align-items: center;
      .modal-dialog {
        padding: 50px;
        width: 300px;
        height: 200px;
        background-color: white;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .modal-icon {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 20px;
        }
        .modal-title {
          color: black;
          text-align: center;
          font-size: 20px;
          font-weight: 500;
        }
        .modal-loading {
          color: black;
          text-align: center;
          @keyframes icon-loading {
            0% {
              -webkit-transform: rotate(0deg);
              transform: rotate(0deg);
            }

            100% {
              -webkit-transform: rotate(359deg);
              transform: rotate(359deg);
            }
          }
          .icon-loading {
            animation: icon-loading 1s infinite linear;
          }
        }
      }
    }
  }
}

.pdf-show-background ::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
.pdf-show-background ::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  background-image: linear-gradient(180deg, #d0368a 0%, #708ad4 99%);
  box-shadow: inset 2px 2px 5px 0 rgba(#fff, 0.5);
  border-radius: 100px;
}
.pdf-show-background ::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #ededed;
}
</style>
