import { component$ } from "@builder.io/qwik";
import { Link, useNavigate } from "@builder.io/qwik-city";

//* ในการทำ navigation เรามีตัวเลือก 2 แบบ
//* แบบแรกคือการใช้ <Link /> ที่เป็น built-in ของ Qwik
//* ใน <Link /> จะมี attribute href ที่เอาไว้ระบุ path ที่เราจะ navigate ไป
//* เราสามารถใช้ relative path เพื่อระบุตำแหน่งของ path ได้ เช่น href='./something'
//* โดยนอกจาก href แล้ว Link ก็ยังมี attribute ที่น่าสนใจอีกสองตัวให้ใช้ นั่นก็คือ reload และ prefetch
//* reload ก็คือการ reload หน้านั่นแหละ
//* ส่วน prefetch ก็คือการ prefetch ข้อมูลของหน้าที่จะ navigate ไปหากมีการนำเมาส์มา hover บน Link
//* การ prefetch ก็คือการโหลดข้อมูลบางส่วนรอเอาไว้ ทำให้การเข้าถึงรวดเร็วขึ้นเพราะโหลดน้อยลง
//* และการทำ navigation แบบที่สองคือการใช้ useNavigate()
//* คล้าย ๆ กับ useLocation() เราจะสร้างตัวแปรและ assign useNavigate() ให้มัน
//* แล้วเราก็เรียกตัวแปรนั้น ต่อด้วย () เพื่อทำการระบุ path ที่เราจะ navigate ไป

export default component$(() => {
  const nav = useNavigate();

  return (
    <>
      <Link href="#">Use Link!</Link>
      <Link reload>Reload Link!</Link>
      <Link href="#" prefetch>
        Prefetch Link!
      </Link>

      <button onClick$={() => nav("./")}>Click</button>
    </>
  );
});
