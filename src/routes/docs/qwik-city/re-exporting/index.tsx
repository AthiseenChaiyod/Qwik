import { component$ } from "@builder.io/qwik";

import { useReExporting } from "~/actions/re-exporting";
export { useReExporting } from "~/actions/re-exporting";

//* การเขียน routeLoader$, routeAction$ นอกไฟล์ .tsx จะทำให้เกิดปัญหาเวลานำมาใช้งาน
//* เช่น สมมติว่าเราเขียน some-loader.ts โดย export const useSomeLoader = routeLoader$( ... )
//* เวลาเรานำมาใช้งานที่อื่นจะเจอกับ error routeLoader$ ... was invoked in a route where it was not declared
//* แต่เราสามารถใช้การทำ re-exporting เพื่อแก้ปัญหานี้ได้
//* ก็แค่ให้เราเพิ่มอีกบรรทัด copy code import ของเราเปลี่ยนเป็น export แทน
//* ตอนนี้เราก็จะมีทั้ง import / export ที่ชี้ไปที่ไฟล์ path เดียวกัน
//* จะเจอบ่อยตอนนำ library ภายนอกมาใช้งาน

//* ข้อสงสัยที่ว่า "แล้วทำไมไม่เขียนทุกอย่างเอาไว้ใน tsx เลย เมื่อ tsx ก็คือ ts ที่สามารถเขียน jsx ได้?"
//* หลัก ๆ ก็คือ convention ของ file, ts ถูกสร้างมาให้ใช้กับ logic เป็นส่วนใหญ่ ในขณะที่ tsx เอาไว้จัดการกับ component
//* บางครั้งการใช้ tsx แทน ts ทั้งหมดเลยก็จะทำให้ IDE เข้าใจผิดว่าเป็นไฟล์ component จนนำมาสู่การทำงานผิดพลาดบางอย่างได้

export default component$(() => {
  const reExportingData = useReExporting();

  return (
    <>
      <h3>This is Re-Exporting</h3>

      <p>{reExportingData.value}</p>
    </>
  );
});
