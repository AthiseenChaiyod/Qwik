import { component$, useSignal } from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";

//* ในการทำ streaming จะต่างจาก endpoint เล็กน้อย
//* ใน endpoint เราจะใช้ requestEvent.getWritableStream() เพื่อนำมาทำ writer เพื่อส่งข้อมูลที่ถูก encode กลับ
//* แต่ใน server$ เราจะต้องสร้าง async function* () { ... } ขึ้นมา
//* สัญลักษณ์ * ด้านหลัง function ก็คือการบอกว่า async function นี้คือ async generator
//* เราก็เลยจะต้องใช้ yield แทน return ในการส่งข้อมูลกลับ
//* ให้เราใช้ return new Promise((resolve) => setTimeout(resolve, ms)) ในการทำ delay เหมือนเดิม
//* ส่วนการ yield ถ้าเราไม่ได้ yield ข้อมูลตรง ๆ เราก็ต้องใช้ข้อมูลที่เป็น iterable ในการทำ loop เสมอ
//* เราจะทำ Object.entries(value) ในการแปลง value object ให้เป็น iterable ก่อน
//* แล้วค่อยใช้ for ... of ในการ yield กลับไป
//* ถ้าเป็น Array ปกติก็ไม่จำเป็นจะต้องทำ เขียน loop ด้วย for ... of ปกติได้เลย
//* ในการทำ for ... of ให้เรา destructure ข้อมูล key, value ออกมาด้วย จะได้สะดวกตอนนำไปใช้งาน
//* ตอนจะรับข้อมูล streaming server$ ให้เรา assign ค่าให้กับตัวแปรก่อนตามปกติ
//* แต่ตอนนำตัวแปรนั้นมาทำ for ... of ให้เราใช้ await ด้านหน้า for ด้วย (เป็น for await ... of)

export const serverStreaming = server$(async function* () {
  const testObject = {
    firstName: "Athiseen",
    lastName: "Chaiyod",
    age: 26,
  };

  const testObjectEntries = Object.entries(testObject);

  for (const [key, value] of testObjectEntries) {
    yield value;

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
});

export default component$(() => {
  const data = useSignal<string | number>("");

  return (
    <>
      <h3>This is Server$ [Stream]</h3>
      <p>{data.value}</p>

      <button
        onClick$={async () => {
          const streamingData = await serverStreaming();

          for await (const item of streamingData) {
            console.log("item:", item);
            data.value = item;
          }
        }}
      >
        Click
      </button>
    </>
  );
});
