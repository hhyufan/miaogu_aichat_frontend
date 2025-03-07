// 加载Vite环境变量
export function requireViteEnvValue(variableName) {
    const value = import.meta.env[variableName];
    if (!value) {
        throw new Error(`${variableName} is Empty!`);
    }
    return value;
}

const env = {
    get PUBLIC_KEY() {
        return requireViteEnvValue('VITE_PUBLIC_KEY');
    },
    get APP_URL() {
        return requireViteEnvValue('VITE_APP_URL');
    },
    get API_URL() {
        return requireViteEnvValue('VITE_API_URL');
    },
    get MOBILE_URL() {
        return requireViteEnvValue('VITE_MOBILE_URL');
    },
    get GITHUB_REPOSITORY_URL() {
        return requireViteEnvValue('VITE_GITHUB_REPOSITORY_URL');
    },
}

export default env;
