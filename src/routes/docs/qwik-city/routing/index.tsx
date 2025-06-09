import { component$ } from "@builder.io/qwik";

//* Qwik จะสร้าง routing ขึ้นมาจาก directory
//* เบื้องต้นจะต้องมีไฟล์ index.tsx ที่จะทำหน้าที่เสมือน index.html สำหรับ route นั้น ๆ
//* สมมติว่าเราสร้าง directory ชื่อ hello และมีไฟล์ index.tsx ใน directory routes
//* เราจะสามารถเข้าถึง localhost:5173/hello ได้ โดยหน้าเว็บเราก็คือ index.tsx ของ hello ที่จะถูก render

export default component$(() => {
  return (
    <>
      <h3>Hi from routing!</h3>
    </>
  );
});
