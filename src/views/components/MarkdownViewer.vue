<template>
  <div class="markdown-viewer" v-html="processedMarkdown"></div>
</template>

<script>
import {marked} from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

export default {
  props: {
    markdown: {
      type: String,
      required: true,
    },
  },
  computed: {
    processedMarkdown() {
      return marked(this.markdown);
    },
  },
  mounted() {
    this.highlightCode();
  },
  updated() {
    this.highlightCode();
  },
  methods: {
    highlightCode() {
      this.$nextTick(() => {
        hljs.highlightAll();
      });
    }
  }
};
</script>
<style scoped>
/* 容器基础样式 */
.markdown-viewer {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  max-width: 800px;
  padding: 20px;
}

/* 使用 Vue 3 推荐的作用域穿透语法 */
.markdown-viewer :deep(pre) {
  margin: 24px 0 !important; /* 强制覆盖默认 margin */
  font-family: Arial, sans-serif !important; /* 覆盖 monospace */
  background-color: #ffffff !important;
  padding: 12px;
  border-radius: 12px;
  overflow-x: auto;
  position: relative;
  counter-reset: line;
}

/* 文本元素对齐 */
.markdown-viewer :deep(:is(p, h1, h2, h3, h4, h5, h6)){
  text-align: left;
}

/* 增强代码块样式特异性 */
.markdown-viewer :deep(pre code) {
  display: block;
  padding: 1em;
  font-size: 14px;
  line-height: 1.5;
  background: transparent !important; /* 确保 hljs 主题透明 */
}
</style>
