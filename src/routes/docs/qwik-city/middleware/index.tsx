import { component$ } from "@builder.io/qwik";
import { DocumentHead, RequestHandler } from "@builder.io/qwik-city";

//* เนื่องจาก endpoint เป็นการทำงานที่ server และทำงานก่อนที่จะเข้า page เราจึงสามารถนำ endpoint มาเขียนเป็น middleware ได้
//* ก็แค่เขียน logic ใน on... นั่นแหละ
//* แต่ถ้าอยากให้ครอบคลุม endpoint เป็นวงกว้าง (ไม่ใช่แค่ใน page บาง page) เราจะต้องใช้ layout แทน
//* เพราะ layout จะทำงานก่อน page และทำงานกับ sub directory ที่อยู่ภายในนั้นด้วย (แต่ภายนอกไม่มีผล)
//* อ่าน next() ได้ที่ ./layout.tsx เพราะว่าต้องเจอบ่อยในการสร้าง middleware

export const onRequest: RequestHandler = async (requestEvent) => {
  console.log("This is page onRequest middlware");
};

export default component$(() => {
  return (
    <>
      <h3>This is Middleware</h3>
    </>
  );
});

export const head: DocumentHead = () => {
  return {
    title: "Qwik City: Middleware",
  };
};
