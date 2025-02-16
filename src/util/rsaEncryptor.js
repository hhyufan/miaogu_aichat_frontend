import JSEncrypt from 'jsencrypt'

export const encryptPassword = (password, publicKey) => {
    const encryptor = new JSEncrypt()
    encryptor.setPublicKey(publicKey)
    const encrypted = encryptor.encrypt(password)
    if (!encrypted) throw new Error("加密失败")
    // 生成6位随机盐（字母数字组合）
    const salt = Math.random().toString(36).slice(-6)
    return encrypted + salt
}
