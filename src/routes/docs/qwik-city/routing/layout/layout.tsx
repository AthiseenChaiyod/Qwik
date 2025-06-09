import { component$, Slot } from "@builder.io/qwik";

//* ในการเขียน layout จะเหมือนกับการเขียน page นั่นแหละ component$() return html กลับไป
//* concept ง่าย ๆ ก็คือ layout จะทำงานก่อน page เพื่อจัดการหน้าตาเว็บก่อนจะนำ page มา render ในตำแหน่งที่อยากได้
//* ให้เราแปะ <Slot /> เอาไว้ใน layout เสมอ เพื่อเอาไว้แทนที่ page ที่จะถูก render ณ ตำแหน่งนั้น ๆ
//* สมมติว่าเราแบ่งหน้าเว็บออกเป็น 2 ส่วน ได้แก่ header และ content
//* แล้วเราอยากให้ header ที่ทำหน้าที่เป็น navbar อยู่ในทุกหน้า (สำหรับ navigate)
//* แปลว่าใน layout เราก็ต้องเขียน header แปะเอาไว้ จากนั้นจึงค่อยใส่ <Slot />
//* เวลาที่เราไปที่หน้า /docs ตัว index.tsx ก็จะถูกนำมา render ในตำแหน่งใต้ <Slot /> หรือหน้าอื่น ๆ ก็จะเหมือนกัน
//* และเนื่องด้วยข้อดีเรื่องทำงานก่อน index.tsx ก็เลยทำให้เราสามารถนำ layout.tsx มาเขียนเป็น middleware ก็ได้
//* แต่ว่าเรื่อง middleware จะยกตัวอย่างในบทอื่นต่อไป
//* เราสามารถทำ nested layout ได้ (layout หลายตัวภายใต้ sub-directory) หลักการก็เหมือนเรื่อง layout นั่นแหละ

export default component$(() => {
  return (
    <>
      <h3>This is layout!</h3>
      <Slot />
    </>
  );
});
