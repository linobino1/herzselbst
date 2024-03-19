// vite.config.mjs
import { vitePlugin as remix } from "file:///Users/leohilsheimer/Sites/repos/herzselbst/node_modules/.pnpm/@remix-run+dev@2.8.1_@types+node@20.11.27_ts-node@10.9.2_typescript@5.4.2_vite@5.1.6/node_modules/@remix-run/dev/dist/index.js";
import { defineConfig } from "file:///Users/leohilsheimer/Sites/repos/herzselbst/node_modules/.pnpm/vite@5.1.6_@types+node@20.11.27/node_modules/vite/dist/node/index.js";
import tsconfigPaths from "file:///Users/leohilsheimer/Sites/repos/herzselbst/node_modules/.pnpm/vite-tsconfig-paths@4.3.1_typescript@5.4.2_vite@5.1.6/node_modules/vite-tsconfig-paths/dist/index.mjs";
import UnoCSS from "file:///Users/leohilsheimer/Sites/repos/herzselbst/node_modules/.pnpm/unocss@0.58.5_postcss@8.4.35_vite@5.1.6/node_modules/unocss/dist/vite.mjs";
var vite_config_default = defineConfig({
  plugins: [
    remix({
      ignoredRouteFiles: ["**/.*"]
      // appDirectory: "app",
      // assetsBuildDirectory: "public/build",
      // publicPath: "/build/",
      // serverBuildPath: "build/index.js",
    }),
    tsconfigPaths(),
    UnoCSS()
  ],
  logLevel: "warn"
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubWpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2xlb2hpbHNoZWltZXIvU2l0ZXMvcmVwb3MvaGVyenNlbGJzdFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2xlb2hpbHNoZWltZXIvU2l0ZXMvcmVwb3MvaGVyenNlbGJzdC92aXRlLmNvbmZpZy5tanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2xlb2hpbHNoZWltZXIvU2l0ZXMvcmVwb3MvaGVyenNlbGJzdC92aXRlLmNvbmZpZy5tanNcIjtpbXBvcnQgeyB2aXRlUGx1Z2luIGFzIHJlbWl4IH0gZnJvbSBcIkByZW1peC1ydW4vZGV2XCI7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHRzY29uZmlnUGF0aHMgZnJvbSBcInZpdGUtdHNjb25maWctcGF0aHNcIjtcbmltcG9ydCBVbm9DU1MgZnJvbSBcInVub2Nzcy92aXRlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZW1peCh7XG4gICAgICBpZ25vcmVkUm91dGVGaWxlczogW1wiKiovLipcIl0sXG4gICAgICAvLyBhcHBEaXJlY3Rvcnk6IFwiYXBwXCIsXG4gICAgICAvLyBhc3NldHNCdWlsZERpcmVjdG9yeTogXCJwdWJsaWMvYnVpbGRcIixcbiAgICAgIC8vIHB1YmxpY1BhdGg6IFwiL2J1aWxkL1wiLFxuICAgICAgLy8gc2VydmVyQnVpbGRQYXRoOiBcImJ1aWxkL2luZGV4LmpzXCIsXG4gICAgfSksXG4gICAgdHNjb25maWdQYXRocygpLFxuICAgIFVub0NTUygpLFxuICBdLFxuICBsb2dMZXZlbDogXCJ3YXJuXCIsXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBcVQsU0FBUyxjQUFjLGFBQWE7QUFDelYsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxtQkFBbUI7QUFDMUIsT0FBTyxZQUFZO0FBRW5CLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxNQUNKLG1CQUFtQixDQUFDLE9BQU87QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBSzdCLENBQUM7QUFBQSxJQUNELGNBQWM7QUFBQSxJQUNkLE9BQU87QUFBQSxFQUNUO0FBQUEsRUFDQSxVQUFVO0FBQ1osQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
