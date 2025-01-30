class ToastManager {
    constructor() {
        this.container = null
        this.toasts = new Map()
        this.debounceTimers = new Map() // 新增防抖计时器
        this.nextId = 0
        this.init()
    }

    // 新增防抖标识检查
    #checkDebounce(key, options) {
        const debounceTime = options.debounce || 1
        if (this.debounceTimers.has(key)) {
            clearTimeout(this.debounceTimers.get(key))
        }

        return new Promise(resolve => {
            this.debounceTimers.set(key, setTimeout(() => {
                this.debounceTimers.delete(key)
                resolve(true)
            }, debounceTime))
        })
    }

    async show(message, type = 'info', options = {}) {
        if (typeof document === 'undefined') return

        // 生成防抖唯一键（组合内容和类型）
        const debounceKey = `${type}-${message}`

        // 检查防抖状态
        if (options.debounce) {
            const shouldShow = await this.#checkDebounce(debounceKey, options)
            if (!shouldShow) return
        }

        // 原有逻辑...
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
            toast.querySelector('.toast-close').addEventListener('click', () => {
                this.remove(id)
            })
        }

        // 添加动画
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

// 创建全局单例（客户端环境）
const toastInstance = typeof window !== 'undefined' ? new ToastManager() : null

// 安全访问方法
export const toast = {
    show: (...args) => toastInstance?.show(...args),
    remove: (...args) => toastInstance?.remove(...args),
    success: async (msg, opts) => {
        console.log(msg)
        await toastInstance?.show(msg, 'success', opts)
    },
    error: async (msg, error) => {
        console.error(msg, error)
        await toastInstance?.show(msg, 'error', {duration: 1000})
    },
    warning: async (msg, opts) => {
        console.warn(msg)
        await toastInstance?.show(msg, 'warning', opts)
    }
}

// 添加样式
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
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 1.2em;
    line-height: 1;
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
