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
<script  setup>
import { ref } from "vue";
const distance = ref(0);
const startY = ref(0);
const isTransition = ref(false);
const isMouseDown = ref(false); // 新增鼠标按下状态

// 处理鼠标按下
const handlerMouseDown = (e) => {
  isMouseDown.value = true;
  startY.value = e.clientY; // 使用 clientY 而非 touches
};

// 处理鼠标移动
const handlerMouseMove = (e) => {
  if (!isMouseDown.value) return;

  const delta = e.clientY - startY.value;
  if (delta > 0) { // 只有下拉时触发
    distance.value = delta;
    if (distance.value > 10) distance.value = 10;
  }
};

// 处理鼠标释放
const handlerMouseEnd = () => {
  if (!isMouseDown.value) return;

  isMouseDown.value = false;
  handlerEnd(); // 复用触摸结束逻辑
};

defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits(["update:modelValue", "refreshEnd"]);

const handlerStart = e => {
  console.log("e", e);
  startY.value = e.touches[0].clientY;
};
const handlerMove = e => {
  distance.value = e.touches[0].clientY - startY.value;
  if (distance.value > 40) {
    distance.value = 40;
  }
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
