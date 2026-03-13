// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import { svelte } from "file:///home/project/node_modules/@sveltejs/vite-plugin-svelte/src/index.js";
var vite_config_default = defineConfig({
  plugins: [svelte()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQge2RlZmluZUNvbmZpZ30gZnJvbSAndml0ZSdcbmltcG9ydCB7c3ZlbHRlfSBmcm9tICdAc3ZlbHRlanMvdml0ZS1wbHVnaW4tc3ZlbHRlJ1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgICBwbHVnaW5zOiBbc3ZlbHRlKCldLFxuICAgIGJ1aWxkOiB7XG4gICAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgICAgIG91dHB1dDoge1xuICAgICAgICAgICAgICAgIGVudHJ5RmlsZU5hbWVzOiBgYXNzZXRzL1tuYW1lXS5qc2AsXG4gICAgICAgICAgICAgICAgY2h1bmtGaWxlTmFtZXM6IGBhc3NldHMvW25hbWVdLmpzYCxcbiAgICAgICAgICAgICAgICBhc3NldEZpbGVOYW1lczogYGFzc2V0cy9bbmFtZV0uW2V4dF1gXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF5TixTQUFRLG9CQUFtQjtBQUNwUCxTQUFRLGNBQWE7QUFHckIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDeEIsU0FBUyxDQUFDLE9BQU8sQ0FBQztBQUFBLEVBQ2xCLE9BQU87QUFBQSxJQUNILGVBQWU7QUFBQSxNQUNYLFFBQVE7QUFBQSxRQUNKLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBLE1BQ3BCO0FBQUEsSUFDSjtBQUFBLEVBQ0o7QUFDSixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
