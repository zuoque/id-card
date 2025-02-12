import { resolve } from "path";
import { defineConfig } from 'vite'
import dtsPlugin from "vite-plugin-dts";


// https://vitejs.dev/config/
export default defineConfig( ({ mode}) => {
  return {
    plugins: [dtsPlugin({ outDir: "dist/types" })],
    build: {
      lib: {
        entry: resolve(__dirname, 'src/main.ts'),
        name: "zqIdCardGenerator",
        fileName: "main",
      },
      rollupOptions: {
        external: ['vue', 'canvas'],
      }
    },

    esbuild: {
      drop: mode === "production" ? ["console", "debugger"] : []
    }
  }
})
