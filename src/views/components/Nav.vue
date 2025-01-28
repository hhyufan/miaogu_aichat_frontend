<template>
  <div class="nav" v-if="userName">
    <div class="own-pic">
      <HeadPortrait :imgUrl="imgUrl" />
    </div>
    <div class="nav-menu-wrapper">
      <ul class="menu-list">
        <li v-for="(item, index) in menuList" :key="index" :ref="el => menuRefs[index] = el" @click="changeMenu(index)">
          <div :class="['block', `block-color${switchState ? 'A' : 'B'}`]"></div>
          <span :class="['iconfont', item, `iconfont-color${switchState ? 'A' : 'B'}`]"></span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import HeadPortrait from "./HeadPortrait.vue";
import headPortrait_img from '@/assets/img/head_portrait.jpg';
import store from "@/vuex/store.js";

const userName = computed(() => !!store.state.UserName);
const switchState = computed(() => store.state.switchState);

export default defineComponent({
  components: {
    HeadPortrait,
  },
  setup() {
    const menuRefs = ref([]); // 用于存储对 menuItem 的引用
    const router = useRouter();
    const menuList = ref(["icon-aichat", "icon-setting"]);
    const imgUrl = ref(headPortrait_img);

    const changeMenu = (index) => {
      switch (index) {
        case 0:
          router.push({ name: "ChatHome" });
          break;
        case 1:
          router.push({ name: "Setting" });
          break;
        default:
          router.push({ name: "ChatHome" });
      }
      // 访问对应的 block 标签
      menuRefs.value.forEach((_, i) => {
        const blockElement = menuRefs.value[i].querySelector('.block'); // 使用 liElement
        blockElement.style.opacity = i === index ? '1' : '0';
      });

    };

    return {
      menuList,
      imgUrl,
      changeMenu,
      userName,
      switchState,
      menuRefs, // 确保将 menuRefs 返回，以便在模板中使用
    };
  }
});
</script>

<style lang="scss" scoped>
.nav {
  width: 100%;
  height: 90vh;
  position: relative;
  border-radius: 20px 0 0 20px;

  .nav-menu-wrapper {
    position: absolute;
    top: 25%;
    transform: translate(0, -50%);

    .menu-list {
      margin-left: 10px;

      li {
        margin: 40px 0 0 30px;
        list-style: none;
        cursor: pointer;
        position: relative;
        .block-colorA {
          background-color: rgb(153, 125, 236);
        }
        .block-colorB {
          background-color: rgb(253, 216, 95);
        }
        .iconfont-colorA {
          color: rgb(111, 81, 209);
        }
        .iconfont-colorB {
          color: rgb(243, 194, 93);
        }
        .block {
          position: absolute;
          left: -40px;
          width: 6px;
          height: 25px;
          transition: 0.5s;
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
          opacity: 0;
        }
        &:hover {
          .iconfont {
            opacity: 1 !important;
          }
          .block {
            opacity: 1;
          }
        }
      }
    }
  }

  .own-pic {
    position: absolute;
    margin-left: 25px;
  }
}
</style>
