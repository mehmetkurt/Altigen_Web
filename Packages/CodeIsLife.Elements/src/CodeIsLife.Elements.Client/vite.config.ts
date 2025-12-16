import { defineConfig } from "vite";

export default defineConfig({
    build: {
        lib: {
            entry: "src/entrypoints/manifest.ts",
            formats: ["es"],
            fileName: "codeislife.elements",
        },
        outDir: "../CodeIsLife.Elements/wwwroot/App_Plugins/codeislife.elements/dist",
        emptyOutDir: true,
        rollupOptions: {
            external: [/^@umbraco/],
        },
    },
});
