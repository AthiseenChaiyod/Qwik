import type { RequestHandler } from "@builder.io/qwik-city";

//* Qwik สามารถทำ endpoint ได้เหมือนกัน ในกรณีต้องการ backend ง่าย ๆ
//* ให้เราสร้างไฟล์ index.ts ใน directory ที่ต้องการทำ endpoint
//* และสร้างโดยการใช้ export const on...: RequestHandler
//* ให้เรา import type RequestHandler เสมอ เพราะเราไม่ได้ใช้อะไรมากกว่านั้นแล้ว (performance)
//* on... จะเป็น onGet, onPost, etc.
//* ส่วนการ assign ค่าจะใช้ async callback เป็น value ให้กับตัวแปร
//* ตัวอย่างการสร้าง export const onGet: RequestHandler = async () => { ... }
//* ใน callback เราสามารถส่ง request event เข้าไปเป็น argument ได้
//* โดย request event จะมีหลายอย่างให้ใช้ ในการส่งค่ากลับจะใช้ json() แทน return
//* เช่น export const onGet: RequestHandler = async (requestEvent) => { requestEvent.json(...)}
//* json จะรับค่า 2 ตัว ได้แก่ status code เป็น number และ data เป็น object ใด ๆ
//* เช่น json(200, { message: "Hello, Athiseen!"})

export const onGet: RequestHandler = async (requestEvent) => {
  requestEvent.json(200, {
    message: "Hello World!",
  });
};
