import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";

//* [...name] จะต่างจาก dynamic routing ตรงที่มี ... เป็น prefix
//* path นี้จะหมายถึงข้อมูลอะไรก็ได้ จะกี่ segment จะส่งอะไรมา รับหมดทุกอย่าง
//* เช่น /docs/something/options/other
//* เหมาะเอาไว้ทำหน้า not found
//* เราสามารถเข้าถึงข้อมูลทั้งหมดได้ด้วย useLocation() ตามด้วยชื่อ directory เหมือนกับ dynamic routing
//* เช่น ถ้ามี [...something] เราก็สามารถใช้ loc.params.something เพื่อเข้าถึงข้อมูลได้เลย
//* แต่ข้อมูลที่ได้จะเป็น string ทั้งหมด ถ้าอยากได้เป็น segment เดี่ยว ๆ ก็ให้ไป split เอาเอง

export default component$(() => {
  const loc = useLocation();

  return (
    <>
      <h3>This is not found page!</h3>
      <p>Your wildcard parameter is: {loc.params.catchall}</p>
    </>
  );
});
