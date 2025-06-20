import { $, component$, useSignal } from "@builder.io/qwik";
import { RequestHandler } from "@builder.io/qwik-city";

//* ในการทำ caching เราจะใช้ requestEvent.cacheControl
//* cacheControl จะทำหน้าที่ตั้งค่า headers ของเราโดยไม่ต้องให้เรามาตั้งเอง
//* จะมี property ให้ใช้ทั้งหมด 4 ตัว
//* ตัวแรกคือ maxAge: number ที่จะให้ cache response นี้กี่วินาที
//* ตัวต่อมาคือ staleWhileRevalidate: number ที่จะสร้าง response ใหม่หลังจากที่ maxAge หมดเวลาแล้ว
//* การ request มาในช่วงของ staleWhileRevalidate จะได้ response เดิมกับที่ maxAge cache เอาไว้นั่นแหละ
//* เพียงแค่หาก staleWhileRevalidate ทำการสร้าง response ใหม่แล้วก็จะวนลูป cacheControl ใหม่แทน
//* ส่วน sMaxAge กับ public จะเกี่ยวข้องกันโดยตรง (share cache)
//* โดยเราจะต้องตั้ง public ก่อนเพื่อให้ sMaxAge ทำงานได้
//* public: boolean ก็คือ cache นี้จะใช้ร่วมกันกับทุก client ที่ request เข้ามาไหม หรือว่าจะ cache เฉพาะบุคคล
//* เช่น เรามีคอม 3 เครื่องส่ง request ไปที่ something.com ที่ทำ public cache เอาไว้
//* cache ที่ได้จะเป็นตัวเดียวกันทั้ง 3 เครื่อง
//* แต่ถ้าไม่ได้ทำ public cache บน something.com cache ที่แต่ละเครื่องได้ แต่ละเครื่องจะมี cache แยกกันเป็นของตัวเอง
//* เหมาะกับการทำ cache ที่ทุกคนก็จะใช้เหมือนกันหมด ไม่ได้ใช้เป็นรายบุคคล (หน้า home, หน้า sign in, etc.)
//* และ sMaxAge: number ก็คือระยะเวลาที่ share cache (public cache) จะเป็น fresh เหมือน maxAge
//* ทำงานร่วมกับ staleWhileRevalidate ตามปกติ

export const onRequest: RequestHandler = async (requestEvent) => {
  requestEvent.cacheControl({
    public: true,
    maxAge: 10,
    sMaxAge: 15,
    staleWhileRevalidate: 60,
  });
};

export default component$(() => {
  const counter = useSignal(0);
  const increment = $(() => {
    counter.value++;
  });

  return (
    <>
      <h3>This is value: {counter.value}</h3>
      <button onClick$={increment}>CLick</button>
    </>
  );
});
