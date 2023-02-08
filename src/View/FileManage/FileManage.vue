<template>
  <div ref="grid">
    <a-row class="grid-demo1">
      <a-col flex="auto">
        <a-breadcrumb :style="{ marginLeft: '20px' }" :routes="routes">
          <template #separator>
            <icon-right />
          </template>
          <template #item-render="{ route }">
            <span
              class="router-item"
              :style="{ fontSize: `20px` }"
              @click="changeRoute(route.path)"
            >
              {{ route.label }}
            </span>
          </template>
        </a-breadcrumb>
      </a-col>
      <a-col flex="100px">
        <div class="icon-right">
          <div class="search-icon">
            <icon-search :style="{ fontSize: `30px` }" />
          </div>
          <div class="add-icon">
            <icon-plus-circle
              class="add-setting"
              @click.stop="addSettingMenuShowChange"
              :style="{
                fontSize: `35px`,
                marginLeft: '20px',
                color: '#446dff',
              }"
            />
            <!-- <Teleport to="body"> -->
            <div class="add-setting-menu" v-if="addSettingMenuShow">
              <div
                @click="clickAddSettingMenu(item.label)"
                class="add-setting-menu-title"
                v-for="(item, id) in addSettingMenuList"
                :key="id"
              >
                <AddSettingMenuIconRender
                  :type="item.value"
                  :style="{ marginRight: '5px', fontSize: '15px' }"
                />
                <span>{{ item.label }}</span>
              </div>
              <a-upload
                action="/"
                v-show="false"
                :custom-request="customRequest"
              >
                <template #upload-button>
                  <button ref="uploadDiv" id="uploadDiv" />
                </template>
              </a-upload>
            </div>
            <!-- </Teleport> -->
          </div>
        </div>
      </a-col>
    </a-row>
    <a-row class="grid-demo2" justify="end">
      <a-col flex="auto">
        <a-checkbox
          :style="{ marginLeft: '20px' }"
          :model-value="checkedAll"
          :indeterminate="indeterminate"
          @change="handleChangeAll"
          >{{ checkAllTitle }}
        </a-checkbox>
      </a-col>
      <a-col flex="200px" justify="center" align="center">
        <icon-swap :style="{ fontSize: `15px` }" />
        <span :style="{ fontSize: `15px` }">按修改时间顺序</span>
        <icon-menu-unfold :style="{ fontSize: `15px`, marginLeft: '20px' }" />
      </a-col>
    </a-row>
    <a-checkbox-group v-model="checkedAllData" @change="handleChange">
      <a-row class="grid-demo3">
        <FileBox
          ref="fileBoxRef"
          v-for="(item, id) in meta"
          :key="id"
          :meta="item"
          :select-status="currentSelectData.includes(id)"
          @contextmenu.prevent.stop="boxSettingShowChange(item.name, $event)"
          @click="enterFolderRoute(item)"
        >
          <template #checkbox>
            <a-checkbox
              @click.stop=""
              class="checkbox"
              :value="id"
            ></a-checkbox>
          </template>
        </FileBox>
        <div
          v-if="boxSettingShow"
          class="box-setting"
          :style="{
            top: `${boxSettingShowPos.y}px`,
            left: `${boxSettingShowPos.x}px`,
          }"
        >
          <div
            @click="clickBoxSettingMenu(item.label)"
            class="box-setting-title"
            v-for="(item, id) in setListData"
            :key="id"
          >
            <span
              :style="{
                color: id === setListData.length - 1 ? 'red' : 'black',
              }"
              >{{ item.label }}</span
            >
          </div>
        </div>
      </a-row>
    </a-checkbox-group>
    <a-modal
      v-model:visible="modalVisible"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <template #title> 新建文件夹 </template>
      <ModalContent ref="modalContentRef" />
    </a-modal>
    <Teleport to="body">
      <ImageShow
        v-if="imageShow"
        :closeImageShow="closeImageShow"
        :imageShowMeta="imageShowMeta"
      />
      <PdfShow
        v-if="pdfShow"
        :closeImageShow="closeImageShow"
        :pdfShowMeta="pdfShowMeta"
        :deletePdfData="deletePdfData"
      />
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, h, nextTick } from "vue";
import {
  getFileList,
  createFolder,
  deleteFolder,
  enterFolder,
  uploadFile,
  getFileData,
} from "@/request/fileManage";
import {
  IconFolder,
  IconUpload,
  IconShareExternal,
} from "@arco-design/web-vue/es/icon";
import { Message } from "@arco-design/web-vue";
import eventBus from "@/utils/eventBus";
import FileBox from "@/View/FileManage/components/FileBox.vue";
import ModalContent from "@/View/FileManage/components/ModalContent.vue";
import ImageShow from "@/components/ImageShow/ImageShow.vue";
import PdfShow from "@/components/PdfShow/PdfShow.vue";

const routes = ref([
  {
    path: "",
    label: "文件",
  },
]);
const setListData = [
  {
    label: "下载",
  },
  {
    label: "分享",
  },
  {
    label: "收藏",
  },
  {
    label: "移动",
  },
  {
    label: "放入回收站",
  },
];

const boxSettingShow = ref(false);
const currentRoute = ref("");
const indeterminate = ref(false);
const checkedAll = ref(false);
const addSettingMenuShow = ref(false);
const modalVisible = ref(false);
const modalContentRef = ref(null);
const fileBoxRef = ref(null);
const grid = ref(null);
const imageShow = ref(false);
const imageShowMeta = ref(null);
const pdfShow = ref(false);
const pdfShowMeta = ref(null);
const curSelectFileName = ref("");
const checkedAllData = ref([]);
const currentSelectData = ref([]);
const meta = ref([]);
const uploadDiv = ref(null);
const addSettingMenuList = [
  { label: "新建文件夹", value: "addFolder" },
  { label: "上传文件", value: "uploadFile" },
  { label: "上传文件夹", value: "uploadFolder" },
];
const boxSettingShowPos = ref({
  x: "10",
  y: "10",
});

const handleChangeAll = (value) => {
  indeterminate.value = false;
  if (value) {
    checkedAll.value = true;
    checkedAllData.value = [...new Array(meta.value.length).keys()];
    currentSelectData.value = checkedAllData.value;
  } else {
    checkedAll.value = false;
    checkedAllData.value = [];
    currentSelectData.value = [];
  }
};

const handleChange = (values) => {
  if (values.length === meta.value.length) {
    checkedAll.value = true;
    indeterminate.value = false;
  } else if (values.length === 0) {
    checkedAll.value = false;
    indeterminate.value = false;
  } else {
    checkedAll.value = false;
    indeterminate.value = true;
  }
  currentSelectData.value = values;
  console.log(currentSelectData.value);
};

const checkAllTitle = computed(() => {
  return checkedAllData.value.length
    ? `已选${checkedAllData.value.length}项`
    : `共${meta.value.length}项`;
});

const addSettingMenuShowChange = () => {
  addSettingMenuShow.value = !addSettingMenuShow.value;
};

const clickAddSettingMenu = async (type) => {
  addSettingMenuShow.value = false;
  switch (type) {
    case "新建文件夹":
      modalVisible.value = true;
      modalContentRef.value.inputValue = "新建文件夹";
      break;
    case "上传文件":
      uploadDiv.value.click();
      eventBus.on("upload", (eventBusData) => {
        meta.value.forEach((item) => {
          if (item.name === eventBusData.fileName) {
            item.data = eventBusData.data;
            item.type = eventBusData.type;
          }
        });
      });
      break;
    default:
      break;
  }
};

const AddSettingMenuIconRender = (type) => {
  const obj = {
    addFolder: IconFolder,
    uploadFile: IconUpload,
    uploadFolder: IconShareExternal,
  };
  return h(obj[type.type]);
};

const clickBoxSettingMenu = async (type) => {
  boxSettingShow.value = false;
  switch (type) {
    case "放入回收站":
      if (currentSelectData.value.length) {
        for (let id = 0; id < meta.value.length; id++) {
          if (currentSelectData.value.includes(id)) {
            await deleteFolder(currentRoute.value, meta.value[id].name);
            checkedAllData.value = checkedAllData.value.filter(
              (item) => item !== id
            );
          }
        }
      } else {
        for (let id = 0; id < meta.value.length; id++) {
          if (meta.value[id].name === curSelectFileName.value) {
            await deleteFolder(currentRoute.value, curSelectFileName.value);
            checkedAllData.value = checkedAllData.value.filter(
              (item) => item !== id
            );
          }
        }
      }
      if (!checkedAllData.value.length) {
        indeterminate.value = false;
        checkedAll.value = false;
      }
      fetchData();
      break;

    default:
      break;
  }
};

const handleOk = async () => {
  const repeatName = meta.value.filter(
    (item) => item.name === modalContentRef.value.inputValue
  );
  if (repeatName.length) {
    Message.error("文件夹名字重复, 请重新输入!");
    return;
  } else {
    await createFolder(currentRoute.value, modalContentRef.value.inputValue);
    fetchData();
  }
};

const handleCancel = () => {};

const boxSettingShowChange = (fileName, e) => {
  boxSettingShow.value = true;
  curSelectFileName.value = fileName;
  boxSettingShowPos.value.x = e.pageX - grid.value.offsetLeft;
  boxSettingShowPos.value.y = e.pageY - grid.value.offsetTop - 130;
};

const enterFolderRoute = async (fileMeta) => {
  if (fileMeta.type === "folder") {
    checkedAllData.value = [];
    checkedAll.value = false;
    indeterminate.value = false;
    enterFolder(currentRoute.value, fileMeta.name).then((res) => {
      meta.value = res.data;
      const lastPath = routes.value[routes.value.length - 1].path;
      const curPath = lastPath + "/" + fileMeta.name;
      routes.value.push({
        path: curPath,
        label: fileMeta.name,
      });
      currentRoute.value = curPath;
    });
  }
  if (/image\//.test(fileMeta.type)) {
    const { data } = await getFileData(currentRoute.value, fileMeta.name);
    imageShowMeta.value = data;
    imageShow.value = true;
    // eventBus.on("getFile", (eventBusData) => {
    //   imageShowMeta.value = eventBusData;
    // });
  }
  if (/pdf/.test(fileMeta.type)) {
    const { data } = await getFileData(currentRoute.value, fileMeta.name);
    pdfShowMeta.value = data;
    pdfShow.value = true;
  }
};

const closeImageShow = () => {
  imageShow.value = false;
  pdfShow.value = false;
  imageShowMeta.value = null;
  pdfShowMeta.value = null;
};

const deletePdfData = () => {
  pdfShowMeta.value.data = null;
};

const changeRoute = (path) => {
  checkedAllData.value = [];
  checkedAll.value = false;
  indeterminate.value = false;
  currentRoute.value = path;
  let order;
  routes.value.forEach((item, id) => {
    if (item.path === path) {
      order = id;
    }
  });
  routes.value = routes.value.filter((item, id) => id <= order);
  fetchData();
};

const customRequest = async (option) => {
  const { fileItem } = option;
  console.log(fileItem);

  const formData = new FormData();
  formData.append("routerPath", currentRoute.value);
  formData.append("fileName", fileItem.name);
  formData.append("file", fileItem.file);

  await uploadFile(formData);
  fetchData();
};

const fetchData = () => {
  getFileList(currentRoute.value).then((res) => {
    meta.value = res.data;
  });
};

fetchData();

window.addEventListener(
  "click",
  () => {
    if (addSettingMenuShow.value) {
      addSettingMenuShow.value = false;
    }
    if (boxSettingShow.value) {
      boxSettingShow.value = false;
    }
  },
  false
);
</script>

<style lang="less" scoped>
.grid-demo1 {
  height: 80px;
  line-height: 80px;
  .add-setting {
    &:hover {
      opacity: 0.5;
      cursor: pointer;
    }
  }
  .router-item {
    &:hover {
      cursor: pointer;
      font-weight: 800;
    }
  }
  .icon-right {
    display: flex;
    flex-direction: row;
  }
  .add-setting-menu {
    z-index: 1;
    position: fixed;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 10px;
    top: 50px;
    right: 20px;
    padding: 2px;
    .add-setting-menu-title {
      height: 30px;
      line-height: 30px;
      padding: 5px 5px;
      padding-right: 25px;
      border-radius: 5px;
      &:hover {
        background-color: #ccc;
        cursor: pointer;
      }
    }
  }
}

.grid-demo2 {
  height: 50px;
  line-height: 50px;
}

.checkbox {
  position: absolute;
  top: 4%;
  left: 1%;
}

.grid-demo3 {
  position: relative;
  overflow: auto;
  .box-setting {
    // top: 50%;
    // left: 50%;
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
</style>
