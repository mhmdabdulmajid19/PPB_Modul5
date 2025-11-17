import {
    defineConfig,
    minimal2023Preset as preset,
} from '@vite-pwa/assets-generator/config'

export default defineConfig({
    headLinkOptions: {
        preset: '2023',
    },
    preset,
    // Menggunakan LOGORN.png sebagai sumber utama alih-alih favicon.ico
    images: ['public/LOGORN.png'], 
})