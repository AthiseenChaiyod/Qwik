import { style } from "@vanilla-extract/css";

//* อันดับแรกให้สร้างไฟล์ .css.ts ก่อน
//* จากนั้นให้สร้าง css ด้วย Vanilla Extract เพื่อนำไปใช้แทน class ทำได้โดยใช้ style()
//* ให้เราเขียน css ใน style() ในรูปแบบของ object
//* เช่น export const SomeStyle = style({ color: "red" })

export const VanillaExtract = style({
  color: "aquamarine",
});
