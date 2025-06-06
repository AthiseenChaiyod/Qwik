import {
  component$,
  isBrowser,
  isServer,
  useSignal,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";

//* ใน Qwik จะมี lifecycle 3 ช่วง คือ useTask$() -> Render -> useVisibleTasks$()
//* ช่วง useTask$() จนถึง Render อาจจะอยู่ได้ทั้ง server / client side
//* แต่หลังจาก render เสร็จแล้ว การทำงานจะอยู่บน client side อย่างเดียว
//* เนื่องจากการทำงานแบ่งเป็น 2 ส่วน คือ server / client ทำให้เราจะต้องมี method สำหรับตรวจสอบว่าทำงานอยู่ที่ไหน
//* ให้ใช้ isServer / isBrowser สำหรับเช็คว่าทำงานบน server / client ตามลำดับ
//* ในครั้งแรก useTask$() จะทำงานบน Server ก่อน
//* โดย useTask$() จะ execute body ของตัวมันเอง และจะ execute cleanup เป็นอย่างสุดท้าย
//* เราสามารถส่ง track ไปเป็น argument ของ useTask$() ได้
//* สามารถใช้ track เพื่อติดตามการเปลี่ยนแปลงค่าของ reactive value ได้
//* หาก reactive value มีการเปลี่ยนแปลงค่าก็จะ re-execute ตัว useTask$() อีกครั้งหนึ่งบน client side
//* เวลา track ให้เราใส่ signal ไปใน () เลยโดยตรงจะดีกว่า ยกเว้นแต่ว่าจะ track หลาย ๆ ค่าพร้อมกันให้ใช้ callback แทน
//* อีกตัวนึงที่เราสามารถส่งเข้าไปได้ก็คือ cleanup
//* cleanup จะทำงานเมื่อ Task re-execute (re-execute ไม่ใช่ execute)
//* กล่าวคือ useTask จะต้องถูก execute บน browser ก่อนอย่างน้อยหนึ่งครั้ง cleanup จึงจะทำงานบน client ได้
//* ดังนั้น เวลาที่เราเปลี่ยนค่า reactive value ครั้งแรก track, body ของ useTask จะทำงาน
//* หลังจากครั้งแรกเป็นต้นไป cleanup จะทำงานก่อน track, body เนื่องจาก cleanup จะทำงานก่อนจะ re-execute เสมอ

export const UseTask = component$(() => {
  const counter = useSignal(0);

  useTask$(({ track, cleanup }) => {
    track(() => {
      console.log("track");
      return counter.value;
    });

    isServer ? console.log("Server") : console.log("Browser");

    cleanup(() => {
      isServer ? console.log("CU: Server") : console.log("CU: Browser");
    });
  });

  return (
    <>
      <button onClick$={() => counter.value++}>Click</button>
      <p>Counter: {counter.value}</p>
    </>
  );
});

//* useVisibleTask$() จะทำงานบน client side อย่างเดียวหลังจากที่ render เสร็จ (component โผล่บน viewport แล้ว)
//* ให้ใช้อย่างระมัดระวัง เพราะว่าขัดกับหลักการ resumability ของ Qwik
//* ให้ใช้เฉพาะกรณีที่ต้องจัดการกับ component หลัง render เสร็จจริง ๆ เช่น ทำ animation, etc.
//* วิธีการใช้งานก็เหมือนกับ useTask$() เลย ที่เราสามารถส่ง track / cleanup ไปเป็น argument ได้

export const UseVisibleTask = component$(() => {
  useVisibleTask$(() => {
    isBrowser ? console.log("Browser") : console.log("Server");
  });

  return (
    <>
      <div
        style={{ height: "100vh", width: "100vw", backgroundColor: "red" }}
      ></div>
    </>
  );
});

//* eagerness (strategy ใน useVisibleTask) เอาไว้ใช้เพื่อระบุ phase ในการทำงานของ useTask
//* ใน useVisibleTask จะมีให้เลือกใช้ 3 ตัว คือ document-idle, document-ready, และ intersection-observer
//* document-idle จะทำงานทันทีหลังจากที่ document โหลดเสร็จ (DOM Tree โหลดเสร็จก็ทำงานเลย CSS, JS, etc. อาจจะยังไม่เสร็จ)
//* document-ready จะทำงานทันทีหลังจากที่หน้าเว็บโหลดทรัพยากรทุกอย่างเสร็จสิ้นแล้วและไม่มีการทำงานใด ๆ (ว่าง)
//* intersection-observer จะทำงานทันทีหลังจากที่ component โผล่บน viewport แล้ว
//* ส่วน useTask จะมีให้ใช้ 3 ตัวเหมือนกัน คือ visible, idle, และ visible ซึ่งเหมือนกับ strategy ทุกอย่าง

export const Eagerness = component$(() => {
  useTask$(
    () => {
      console.log("useTask$");
    },

    { eagerness: "visible" }
  );

  useVisibleTask$(
    () => {
      console.log("useVisibleTask$");
    },

    { strategy: "intersection-observer" }
  );

  return (
    <>
      <h3>Console after seen this!</h3>
    </>
  );
});
