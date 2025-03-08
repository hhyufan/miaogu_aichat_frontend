<template>
    <svg v-bind="svgAttributes" :class="className" v-html="innerContent"></svg>
</template>

<script setup>
import { defineProps, ref, watchEffect } from 'vue';

const innerContent = ref('');
const svgAttributes = ref({});

const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    className: {
        type: String,
        default: '',
    }
});

const parseSvg = (rawSvg) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawSvg, 'image/svg+xml');
    const svgElement = doc.querySelector('svg');

    if (!svgElement) {
        throw new Error('Invalid SVG file');
    }

    // 动态提取所有属性
    const attributes = Array.from(svgElement.attributes).reduce((acc, attr) => {
        acc[attr.name] = attr.value;
        return acc;
    }, {});

    // 确保必要的默认属性
    if (!attributes.xmlns) {
        attributes.xmlns = 'http://www.w3.org/2000/svg';
    }

    svgAttributes.value = attributes;

    // 提取内部内容
    innerContent.value = Array.from(svgElement.childNodes)
        .map(node => node.outerHTML || node.textContent)
        .join('');
};

watchEffect(async () => {
    try {
        const svgModule = (await import(`@/assets/icons/${props.name}.svg?raw`)).default;

        parseSvg(svgModule.default || svgModule);
    } catch {
        console.warn(`SVG not found: ${props.name}`);
    }
});
</script>

<style scoped></style>