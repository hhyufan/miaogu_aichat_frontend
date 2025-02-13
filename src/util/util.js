// 防抖函数
export function debounce(fn, delay = 150) {
    let timer = null;
    return function (...args) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}

// 下拉动画优化
export function animation(obj, target, fn1) {
    if (obj.timer) {
        cancelAnimationFrame(obj.timer);
    }

    function animate() {
        const step = (target - obj.scrollTop) / 10; // 计算步长
        if (Math.abs(step) > 1) {
            obj.scrollTop += step > 0 ? Math.ceil(step) : Math.floor(step);
            obj.timer = requestAnimationFrame(animate);
        } else {
            obj.scrollTop = target;
            if (fn1) fn1();
        }
    }

    animate();
}

// 判断是否在顶部
export function isTop(obj) {
    return obj.scrollTop === 0;
}

// 判断是否在底部
export function isBottom(obj) {
    return obj.scrollTop + obj.clientHeight >= obj.scrollHeight;
}
