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
        this.addLanguageLabels();
      });
    },
    addLanguageLabels() {
      // 语言名称映射表（小写键 => 显示名称）
      const LANGUAGE_DISPLAY_MAP = {
        html: 'HTML',
        xml: 'XML',
        sql: 'SQL',
        css: 'css',
        sass: 'sass',
        scss: 'sass',
        js: 'JavaScript',
        ts: 'TypeScript',
        py: 'Python',
        php: 'PHP',
        md: 'Markdown',
        yml: 'YAML',
        yaml: 'YAML',
        json: 'JSON',
        rb: 'Ruby'
      };

      const codeBlocks = this.$el.querySelectorAll('code');

      codeBlocks.forEach(code => {
        const pre = code.closest('pre');
        if (!pre) return;

        // 清理旧标签
        pre.querySelector('.lang-tag')?.remove();

        // 提取语言类型（统一转小写处理）
        const langClass = [...code.classList].find(c => c.startsWith('language-'));
        const rawLang = langClass ? langClass.split('-')[1] || '' : '';
        const langKey = rawLang.toLowerCase();

        // 获取显示名称
        let displayLang = LANGUAGE_DISPLAY_MAP[langKey];

        // 未定义的特殊情况处理
        if (!displayLang) {
          // 处理带版本号的情况：python3 → Python 3
          const versionMatch = langKey.match(/^(\D+)(\d+)$/);
          if (versionMatch) {
            displayLang = `${versionMatch[1].charAt(0).toUpperCase()}${versionMatch[1].slice(1)} ${versionMatch[2]}`;
          } else {
            // 默认首字母大写
            displayLang = langKey.charAt(0).toUpperCase() + langKey.slice(1);
          }
        }

        // 创建标签
        const tag = document.createElement('div');
        tag.className = 'lang-tag';
        tag.textContent = displayLang;
        pre.appendChild(tag);
      });
    }
  }
};
</script>
<style scoped>
/* 容器基础样式 */
.markdown-viewer {
  max-width: 70%;
  font-family: Arial, sans-serif;
  line-height: 1.6;
  padding: 16px;
  box-sizing: border-box; /* 重要：包含padding在宽度计算中 */
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
  max-width: 100%; /* 确保不溢出容器 */
  width: 100%;
  box-sizing: border-box; /* 包含padding */
  white-space: pre-wrap; /* 允许代码换行 */
  word-wrap: break-word;
}

.markdown-viewer :deep(.lang-tag) {
  position: absolute;
  top: 8px;
  right: 12px;
  color: #666;
  font-size: 0.8em;
  background: rgba(255, 255, 255, 0.8);
  padding: 2px 8px;
  border-radius: 4px;
}
/* 文本元素对齐 */
.markdown-viewer :deep(:is(p, h1, h2, h3, h4, h5, h6)){
  text-align: left;
}
.markdown-viewer :deep(:is(ol, li)){
  text-align: left;
  margin-left: 8px;
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
