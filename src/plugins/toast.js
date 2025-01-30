class ToastManager {
    constructor() {
        this.container = null
        this.toasts = new Map()
        this.debounceTimers = new Map()
        this.nextId = 0
        this.init()
    }

    // 改进防抖逻辑：仅在防抖期结束后执行显示
    #checkDebounce(key, debounceTime) {
        if (this.debounceTimers.has(key)) return false

        this.debounceTimers.set(key, setTimeout(() => {
            this.debounceTimers.delete(key)
        }, debounceTime))

        return true
    }

    async show(message, type = 'info', options = {}) {
        if (typeof document === 'undefined') return

        // 生成防抖唯一键（增加选项序列化以区分不同配置）
        const debounceKey = JSON.stringify({ type, message, options })
        const debounceTime = options.debounce || 1000

        if (debounceTime > 0) {
            if (!this.#checkDebounce(debounceKey, debounceTime)) return
        }

        const id = this.nextId++
        const toastElement = this.createToastElement(id, message, type, options)

        this.toasts.set(id, toastElement)
        this.container.appendChild(toastElement)

        if (options.duration !== 0) {
            setTimeout(() => this.remove(id), options.duration || 4000)
        }

        return id
    }

    init() {
        if (typeof document !== 'undefined' && !this.container) {
            this.container = document.createElement('div')
            this.container.className = 'global-toast-container'
            document.body.appendChild(this.container)
        }
    }

    createToastElement(id, message, type, options) {
        const toast = document.createElement('div')
        toast.className = `toast-item toast-${type}`
        toast.innerHTML = `
            ${message}
            ${options.closable ? `<button class="toast-close" data-id="${id}">&times;</button>` : ''}
        `

        if (options.closable) {
            const closeBtn = toast.querySelector('.toast-close')
            closeBtn.addEventListener('click', () => this.remove(id))
        }

        toast.style.animation = 'toastSlideIn 0.3s ease'
        return toast
    }

    remove(id) {
        const toast = this.toasts.get(id)
        if (toast) {
            toast.style.animation = 'toastSlideOut 0.3s ease'
            setTimeout(() => {
                toast.remove()
                this.toasts.delete(id)
            }, 300)
        }
    }
}

const toastInstance = typeof window !== 'undefined' ? new ToastManager() : null

export const toast = {
    show: (...args) => toastInstance?.show(...args),
    remove: (...args) => toastInstance?.remove(...args),
    success: (msg, opts) => toastInstance?.show(msg, 'success', opts),
    error: (msg, opts = {}) => {
        console.error(msg, opts.error)
        return toastInstance?.show(msg, 'error', { duration: 1000, ...opts })
    },
    warning: (msg, opts) => {
        console.warn(msg)
        return toastInstance?.show(msg, 'warning', opts)
    }
}

if (typeof document !== 'undefined') {
    const style = document.createElement('style')
    style.textContent = `
    .global-toast-container {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        pointer-events: none;
    }

    .toast-item {
        padding: 12px 20px;
        border-radius: 6px;
        background: #fff;
        box-shadow: 0 3px 12px rgba(0,0,0,0.15);
        margin-bottom: 10px;
        pointer-events: auto;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .toast-close {
        margin-left: auto;
        padding: 2px 8px;
        border: none;
        background: transparent;
        cursor: pointer;
        font-size: 1.4em;
        line-height: 1;
        color: white !important;
        transition: all 0.2s ease;
        border-radius: 4px;
    }

    .toast-close:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.1);
    }

    .toast-success { background: #50f524; color: white; }
    .toast-error { background: #f65050; color: white; }
    .toast-warning { background: #f3b574; color: white; }

    @keyframes toastSlideIn {
        from { transform: translateY(-30px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }

    @keyframes toastSlideOut {
        to { transform: translateY(-30px); opacity: 0; }
    }
    `
    document.head.appendChild(style)
}
