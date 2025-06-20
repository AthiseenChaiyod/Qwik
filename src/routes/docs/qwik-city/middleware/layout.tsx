import { component$, Slot } from "@builder.io/qwik";
import {
  DocumentHead,
  DocumentHeadProps,
  RequestHandler,
} from "@builder.io/qwik-city";

//* next() จะเป็นการสั่งให้ handler (middleware) ตัวถัดไปทำงานทันทีและรอผลลัพธ์กลับด้วย
//* ดังนั้นเราเลยจะใช้ await เพื่อรอผลลัพธ์จาก next() กลับมา
//* จากนั้นจึงค่อยทำงานต่อตามปกติในตัวมันเอง
//* ยกเว้นแต่ไม่อยากจะให้ทำงานแล้ว ก็สามารถใส่ return ด้านหน้า await ได้เลย

export const onRequest: RequestHandler = async (requestEvent) => {
  console.log("This is layout onRequest middlware: start");
  await requestEvent.next();
  console.log("This is layout onRequest middlware: end");
};

export default component$(() => {
  return (
    <>
      <Slot />
    </>
  );
});

export const head: DocumentHead = (pageHead: DocumentHeadProps) => {
  return {
    title: pageHead.head.title + " - Layout",
  };
};
