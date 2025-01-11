<template>
    <div class="nav" v-if="userName">
        <div class="own-pic">
            <HeadPortrait :imgUrl="imgUrl" />
        </div>
        <div class="nav-menu-wrapper">
            <ul class="menu-list">
                <li v-for="(item, index) in menuList" :key="index" :class="{ activeNav: index === current }"
                    @click="changeMenu(index)">
                    <div class="block"></div>
                    <span class="iconfont" :class="item"></span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import {computed, defineComponent, ref} from 'vue';
import { useRouter } from 'vue-router';
import HeadPortrait from "./HeadPortrait.vue";
import headPortrait_img from '@/assets/img/head_portrait.jpg'
import store from "@/vuex/store.js";
const userName = computed(() => !!store.state.UserName);
export default defineComponent({
    components: {
        HeadPortrait,
    },
    setup() {
        console.log(userName.value)

        const router = useRouter();
        const menuList = ref(["icon-aichat", "icon-setting"]);
        const current = ref(0);
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

            current.value = index;
        };

        return {
            menuList,
            current,
            imgUrl,
            changeMenu,
            userName
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
                .block {
                    background-color: rgb(153, 125, 236);
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

                    span {
                        color: rgb(111, 81, 209);
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

.activeNav {
    span {
        color: rgb(153, 125, 236);
    }

    .block {
        opacity: 1 !important;
    }
}
</style>
