import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";

//* การทำ dynamic routing จะต้อง [] ครอบชื่อ directory เอาไว้
//* โดยเราสามารถเข้าถึง dynamic route ด้วยการใส่ path อะไรตามหลังก็ได้
//* เช่น localhost:5173/1, localhost:5173/something, localhost:5173/something1234, etc.
//* dynamic route จะให้เราดึงข้อมูลจาก path segment นั้น ๆ มาใช้ในชื่อที่เรานำไปตั้งเป็น directory
//* เช่น [id] เราก็สามารถจะเข้าถึง route parameter นั้น ๆ ได้ด้วยชื่อ id
//* อย่าง route นี้ที่ใช้ชื่อว่า routing-id เราก็สามารถเข้าถึง route นี้ได้ด้วย path localhost:5173/docs/qwik-city/routing/...
//* ... เราอยากจะใส่อะไรก็ได้ ขอแค่ไม่ใช่ segment ตามหลัง (/ และใส่ข้อมูลตามหลังเพิ่มอีกที)
//* เช่น localhost:5173/docs/qwik-city/routing/1234/athiseen ก็จะไม่เจอ เพราะว่าเรารับแค่ segment เดียว คือ 1234
//* ถ้าเราต้องการเข้าถึง route parameter ของ dynamic route เราจะต้องใช้ useLocation() เพื่อเข้าถึง .params
//* เช่น const loc = useLocation(); const dynamicId = loc.params.id;

export default component$(() => {
  const loc = useLocation();

  return (
    <>
      <h3>Hi from dynamic routing!</h3>
      <p>Your dynamic parameter is: {loc.params["routing-id"]}</p>
    </>
  );
});
