/**
 * This is the base config for vite.
 * When building, the adapter config is used which loads this file and extends it.
 */
import { defineConfig, type UserConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import pkg from "./package.json";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
type PkgDep = Record<string, string>;
const { dependencies = {}, devDependencies = {} } = pkg as any as {
  dependencies: PkgDep;
  devDependencies: PkgDep;
  [key: string]: unknown;
};
errorOnDuplicatesPkgDeps(devDependencies, dependencies);
/**
 * Note that Vite normally starts from `index.html` but the qwikCity plugin makes start at `src/entry.ssr.tsx` instead.
 */

//* เรื่องสุดท้ายของหัวข้อ routing จะอยู่ในหน้าของ vite.config.ts 
//* สมมติว่าเรากำลังจะเข้าหน้า /docs แต่ว่าเข้าด้วย /document แทน
//* ตามหลักแล้วก็ต้องไม่เจอ route /document เพราะเราไม่ได้สร้างเอาไว้
//* แต่การทำ rewrite route จะทำให้เราสามารถระบุชื่อ path อีกตัวหนึ่งที่จะชี้มายัง path หลักของเราได้
//* เช่น /document ก็จะหมายถึง /docs เหมือนกัน สามารถใช้ทั้งสองในการเข้าถึงได้โดยไม่ต้องเขียน route เพิ่ม
//* ใน defineConfig ข้างในจะมี plugin และด้านในจะมี qwikCity ให้เราส่ง object ที่มี rewriteRoutes: [] เข้าไปด้านใน
//* เช่น return { plugins: [qwikCity({ rewriteRoutes: []}), ...]}
//* ด้านใน array เราก็จะสามารถทำ rewrite route ได้แล้วโดยการเขียนแยกใน object แต่ละตัว
//* config object จะต้องมี paths: { stringA: stringB } เพื่อระบุว่าถ้าเข้า /stringB ก็จะหมายถึง /stringA เหมือนกัน
//* ตัวอย่างการ config คือ rewriteRoutes: [ {paths: {'docs': 'document'}} ]
//* จากตัวอย่าง การเข้า document ก็จะหมายถึงการเข้า docs เหมือนกัน (บน url ก็ยังแสดงว่า /document อยู่เหมือนเดิม)
//* นอกจากั้นเราสามารถระบุ prefix ให้ rewrite route ก็ได้เหมือนกัน
//* ก่อนหน้า paths ให้เราใช้ prefix: 'string'
//* เช่น rewriteRoutes: [{ prefix: 'th', paths: { 'docs': 'aekkasarn' } }]
//* เราก็จะถูกจำกัดให้เข้า aekkasarn ด้วย /th ก่อน ไม่งันจะเข้าไม่ได้ จะต้องเข้าผ่าน path /th/aekkasarn

//* อย่าลืมประกาศ serverPluginsDir เอาไว้ใน qwikCity() ด้วย จะได้ใช้ plugin ได้

export default defineConfig(({ command, mode }): UserConfig => {
  return {
    plugins: [qwikCity({
      serverPluginsDir: 'src/plugins',

      rewriteRoutes: [
        {
          paths: { 'docs': 'documentation' }
        }, 

        {
          prefix: 'th', 
          paths: { 'docs': 'th-docs'}
        }
      ]
    }), qwikVite(), tsconfigPaths(), vanillaExtractPlugin()],
    // This tells Vite which dependencies to pre-build in dev mode.
    optimizeDeps: {
      // Put problematic deps that break bundling here, mostly those with binaries.
      // For example ['better-sqlite3'] if you use that in server functions.
      exclude: [],
    },
    /**
     * This is an advanced setting. It improves the bundling of your server code. To use it, make sure you understand when your consumed packages are dependencies or dev dependencies. (otherwise things will break in production)
     */
    // ssr:
    //   command === "build" && mode === "production"
    //     ? {
    //         // All dev dependencies should be bundled in the server build
    //         noExternal: Object.keys(devDependencies),
    //         // Anything marked as a dependency will not be bundled
    //         // These should only be production binary deps (including deps of deps), CLI deps, and their module graph
    //         // If a dep-of-dep needs to be external, add it here
    //         // For example, if something uses `bcrypt` but you don't have it as a dep, you can write
    //         // external: [...Object.keys(dependencies), 'bcrypt']
    //         external: Object.keys(dependencies),
    //       }
    //     : undefined,
    server: {
      headers: {
        // Don't cache the server response in dev mode
        "Cache-Control": "public, max-age=0",
      },
    },
    preview: {
      headers: {
        // Do cache the server response in preview (non-adapter production build)
        "Cache-Control": "public, max-age=600",
      },
    },
  };
});
// *** utils ***
/**
 * Function to identify duplicate dependencies and throw an error
 * @param {Object} devDependencies - List of development dependencies
 * @param {Object} dependencies - List of production dependencies
 */
function errorOnDuplicatesPkgDeps(
  devDependencies: PkgDep,
  dependencies: PkgDep,
) {
  let msg = "";
  // Create an array 'duplicateDeps' by filtering devDependencies.
  // If a dependency also exists in dependencies, it is considered a duplicate.
  const duplicateDeps = Object.keys(devDependencies).filter(
    (dep) => dependencies[dep],
  );
  // include any known qwik packages
  const qwikPkg = Object.keys(dependencies).filter((value) =>
    /qwik/i.test(value),
  );
  // any errors for missing "qwik-city-plan"
  // [PLUGIN_ERROR]: Invalid module "@qwik-city-plan" is not a valid package
  msg = `Move qwik packages ${qwikPkg.join(", ")} to devDependencies`;
  if (qwikPkg.length > 0) {
    throw new Error(msg);
  }
  // Format the error message with the duplicates list.
  // The `join` function is used to represent the elements of the 'duplicateDeps' array as a comma-separated string.
  msg = `
    Warning: The dependency "${duplicateDeps.join(", ")}" is listed in both "devDependencies" and "dependencies".
    Please move the duplicated dependencies to "devDependencies" only and remove it from "dependencies"
  `;
  // Throw an error with the constructed message.
  if (duplicateDeps.length > 0) {
    throw new Error(msg);
  }
}
