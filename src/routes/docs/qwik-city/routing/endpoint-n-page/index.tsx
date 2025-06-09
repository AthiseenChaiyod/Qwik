import { component$ } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";

//* อย่างไรก็ตาม เราไม่สามารถเขียน page / endpoint ใน directory เดียวกันได้
//* แต่ว่าเราสามารถเขียน endpoint รวมเอาไว้ใน .tsx ได้
//* หลักการคือการทำ condition เพื่อส่งค่า json กลับ ถ้าหากไม่ตรง condition ก็ไม่ต้องส่งอะไรกลับ จะได้ component$() แทน
//* ง่าย ๆ เลยก็คือ endpoint จะทำงานก่อน component$() ถ้ามีการส่ง json() กลับมาก็จะไม่ได้ component$()
//* แต่กลับกัน ถ้าเกิด execute endpoint แล้วไม่ได้ส่ง json() กลับมาก็จะได้ component$() แทน

export const onGet: RequestHandler = async ({ json }) => {
  if (3 > 4) {
    json(200, {
      message: "Hi from /endpoint-n-page!",
    });
  }
};

export default component$(() => {
  return (
    <>
      <h3>Hello World!</h3>
    </>
  );
});
