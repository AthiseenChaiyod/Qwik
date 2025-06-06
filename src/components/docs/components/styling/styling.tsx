import { component$, useStyles$, useStylesScoped$ } from "@builder.io/qwik";
import styles from "./css-module.module.css";
import style from "./css-module.css?inline";
import { VanillaExtract } from "./vanilla-extract.css";

//* การตกแต่ง css ใน component ทำได้โดยการใช้ CSS Module
//* ให้เราสร้างไฟล์ .module.css และเขียน css เอาไว้ข้างในไฟล์นั้น
//* ตอน import ก็ให้เขียน import styles from "path" ปกติ
//* และใช้ class={styles.ClassName} เพื่ออ้างอิง class ที่เขียนเอาไว้ใน styles

export const CSSModule = component$(() => {
  return (
    <>
      <p class={styles.CSSModule}>This styled by CSS Module!</p>
    </>
  );
});

//* กรณีที่ไม่อยากเขียนแยกไฟล์ เราสามารถใช้ useStylesScoped$() ใน component เพื่อเขียน css ได้โดยตรง
//* แต่ตอนเข้าถึง css ที่เขียนไว้ ให้ใช้ "" แทน {}

export const UseStylesScopedCSS = component$(() => {
  useStylesScoped$(`
    .use-styles-scoped {
      color: violet;
    }  
  `);

  return (
    <>
      <p class="use-styles-scoped">This styled by UseStylesScoped$()</p>
    </>
  );
});

//* นอกจากการ import styles แบบปกติ เราสามารถ import แบบ inline ได้โดยการแปะ ?inline เอาไว้หลัง path
//* เช่น import style from "path?inline"
//* จากเดิมที่เราใช้ import styles จะเปลี่ยนเป็น import style เพื่อกันการสับสนระหว่างแบบปกติกับแบบ inline
//* และไฟล์ของ inline จะต้องไม่มี .module.css แต่จะ .css เลยตรง ๆ
//* เราสามารถนำ inline มาใช้กับ useStylesScoped เพื่อให้ไม่ต้องเขียน style. เป็น prefix ตลอดก็ได้
//* ให้เราส่ง style ไปเป็น argument ให้กับ useStylesScoped$() ก่อน
//* หลังจากนั้นที่จากเดิมเราต้องเขียน class={styles.SomeClass} จะกลายเป็น class="SomeClass" แทน

export const InlineCSSModule = component$(() => {
  useStylesScoped$(style);

  return (
    <>
      <p class="InlineCSSModule">This styled by CSS Module (Inlined)</p>
    </>
  );
});

//* useStylesScoped$() จะเป็นการทำ css ใน scope ของ component นั้น ๆ เพื่อป้องกัน conflict กับ css ที่อยู่นอก component
//* ส่วน useStyles$() จะเหมือนกับการประกาศ css แบบ global เลย เพียงแค่เขียนใน useStyles$() แทน
//* นอกนั้น การใช้งานอะไรก็จะเหมือนกับ useStylesScoped$() ทุกอย่าง

export const UseStylesCSS = component$(() => {
  useStyles$(`
    .use-styles {
      color: teal;
    }  
  `);

  return (
    <>
      <p class="use-styles">This styled by useStyles!</p>
    </>
  );
});

export const UseStylesCSSOnAnother = component$(() => {
  return (
    <>
      <p class="use-styles">This styled by useStyles as well!</p>
    </>
  );
});

//* การประกาศ css แบบสุดท้ายเราจะต้องใช้ vanilla extract ซึ่งเป็น library ภายนอก
//* ให้เรา run cmd: npm run qwik add styled-vanilla-extract ก่อน
//* แล้วก็ลง plugin ให้ vite ด้วย npm i --save @vanilla-extract/vite-plugin
//* การเรียกใช้ class ก็ให้เรียกใช้เหมือนตัวแปรตัวนึงไปเลย ใช้ {} ครอบเอา
//* การเขียน vanilla extract ดูได้ที่ ./vanilla-extract.css.ts

export const VanillaExtractCSS = component$(() => {
  return (
    <>
      <p class={VanillaExtract}>This styled by Vanilla Extract!</p>
    </>
  );
});
