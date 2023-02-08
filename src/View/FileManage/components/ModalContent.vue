<template>
  <a-row>
    <a-col align="center">
      <img src="@/assets/img/文件夹.svg" alt="文件夹" />
    </a-col>
  </a-row>
  <a-row>
    <a-col align="center">
      <a-input
        size="large"
        ref="inputRef"
        v-model="inputValue"
        :style="{ width: '300px', borderRadius: '30px', textAlign: 'center' }"
      >
      </a-input>
    </a-col>
  </a-row>
</template>

<script setup>
import { ref, defineExpose } from "vue";

const inputRef = ref(null);
const inputValue = ref("新建文件夹");

defineExpose({ inputValue });
</script>

<style lang="scss" scoped></style>
