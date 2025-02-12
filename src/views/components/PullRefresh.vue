<template>
  <div
      :class="{'animate':isTransition}"
      :style="{transform:`translateY(${distance}px)`}"
      @touchstart="handlerStart"
      @touchmove="handlerMove"
      @touchend="handlerEnd"
      @mousedown="handlerMouseDown"
      @mousemove="handlerMouseMove"
      @mouseup="handlerMouseEnd"
      @mouseleave="handlerMouseEnd"
  >
    <div class="refresh_tip" v-if="distance > 0">释放即可刷新...</div>
    <div class="refresh_tip" v-if="modelValue">加载中...</div>
    <slot></slot>
  </div>
</template>

<script setup>
import {ref} from "vue";
import {isTop} from "@/util/util.js";

const distance = ref(0);
const startY = ref(0);
const isTransition = ref(false);
const isMouseDown = ref(false);
const isPullRefresh = ref(false);

const props = defineProps({
  chatContentRef: {
    type: Object,
    required: true
  },
  modelValue: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits(["update:modelValue", "refreshEnd"]);

// 处理鼠标按下
const handlerMouseDown = (e) => {
  isMouseDown.value = true;
  startY.value = e.clientY;
};

// 处理鼠标移动
const handlerMouseMove = (e) => {
  if (!isMouseDown.value) return;
  if (window.getSelection().toString().length > 0) return;

  const delta = e.clientY - startY.value;
  if (delta > 0 && props.chatContentRef.scrollTop === 0) { // 使用传递的 chatContentRef
    isPullRefresh.value = true;
    distance.value = Math.min(delta, 10); // 限制最大下拉距离
  } else {
    isPullRefresh.value = false;
  }
};

// 处理鼠标释放
const handlerMouseEnd = () => {
  if (!isPullRefresh.value) return;
  if (!isMouseDown.value) return;
  isMouseDown.value = false;
  handlerEnd(); // 复用触摸结束逻辑
};

const handlerStart = (e) => {
  startY.value = e.touches[0].clientY;
};

const handlerEnd = () => {
  distance.value = 0;
  startY.value = 0;
  isTransition.value = true;
  emits("update:modelValue", true);
  emits("refreshEnd");
};
</script>

<style scoped>
.refresh_tip {
  text-align: center;
  padding: 12px 0;
  color: #ccc;
}
</style>
