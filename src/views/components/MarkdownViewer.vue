<template>
  <div class="markdown-viewer" v-html="processedMarkdown"></div>
</template>

<script setup>
import { computed, onMounted, onUpdated, nextTick} from 'vue';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import store from "@/vuex/store.js";
import {toast} from "@/plugins/toast.js";

// Props
const props = defineProps({
  markdown: {
    type: String,
    required: true,
  },
});

// Computed
const switchState = computed(() => store.state.switchState);

const processedMarkdown = computed(() => {
  const renderer = new marked.Renderer();
  renderer.codespan = (code) => {
    return `<code class="custom-inline-code${switchState.value ? 'A' : 'B'}">${code.text}</code>`;
  };
  marked.setOptions({ renderer });
  return marked(props.markdown);
});

// Lifecycle Hooks
onMounted(() => {
  highlightCode();
});

onUpdated(() => {
  highlightCode();
});

// Methods
const highlightCode = () => {
  nextTick(() => {
    hljs.highlightAll();
    hljs.registerLanguage("vue", () => hljs.getLanguage("html"));
    addLanguageLabels();
  });
};

const addLanguageLabels = () => {
  const LANGUAGE_DISPLAY_MAP = {
    html: 'HTML',
    xml: 'XML',
    sql: 'SQL',
    css: 'CSS',
    sass: 'Sass',
    scss: 'Sass',
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

  const codeBlocks = document.querySelectorAll('code');

  codeBlocks.forEach(code => {
    const pre = code.closest('pre');
    if (!pre) return;

    // Clear old labels
    pre.querySelector('.lang-tag')?.remove();

    // Extract language type
    const langClass = [...code.classList].find(c => c.startsWith('language-'));
    const rawLang = langClass ? langClass.split('-')[1] || '' : '';
    const langKey = rawLang.toLowerCase();

    // Get display name
    let displayLang = LANGUAGE_DISPLAY_MAP[langKey];

    // Handle undefined special cases
    if (!displayLang) {
      const versionMatch = langKey.match(/^(\D+)(\d+)$/);
      if (versionMatch) {
        displayLang = `${versionMatch[1].charAt(0).toUpperCase()}${versionMatch[1].slice(1)} ${versionMatch[2]}`;
      } else {
        displayLang = langKey.charAt(0).toUpperCase() + langKey.slice(1);
      }
    }
    // Create tag
    const tag = document.createElement('button');
    tag.className = 'lang-tag';
    tag.textContent = displayLang;
    tag.addEventListener('click', () => copyToClipboard(code.textContent));
    tag.addEventListener('mouseover', () => {
      tag.style.backgroundColor = '#f8f7f7'; // hover 时的背景色
    });

    tag.addEventListener('mouseout', () => {
      tag.style.backgroundColor = ''; // 恢复默认背景色
    });
    pre.appendChild(tag);
  });
};
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
      .then(() => {
        toast.success('内容已复制', {debounce: 3000, closable: true});
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
};
</script>

<style lang="scss" scoped src="./markdownViewer.scss"/>
