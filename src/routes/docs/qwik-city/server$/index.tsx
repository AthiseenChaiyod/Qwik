import { $, component$, useSignal } from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";

//* การใช้งาน server$ ก็จะคล้าย ๆ กับ routeLoader$ ที่จะทำหน้าที่ดึงข้อมูลจากภายนอก
//* แต่ว่า routeLoader$ จะทำงานตอนเริ่ม route ทุกครั้ง แต่ server$ เราจะสามารถสั่งได้ว่าจะให้ทำงานตอนไหน
//* เราสามารถใช้ this เป็นการ refer ถึง requestEvent ได้เลยโดยไม่ต้องส่ง argument มาเหมือน routeLoader$
//* แต่ตอนเรียกใช้งาน เราจะต้องครอบ function เอาไว้ใน QRL เสมอ

export const serverUseServer = server$(async function () {
  const response = await fetch(
    "http://localhost:5173/docs/qwik-city/endpoints"
  );
  console.log(this.url.pathname);

  return response.json();
});

export default component$(() => {
  const data = useSignal("");
  const result = $(async () => {
    const dataFromServer = await serverUseServer();
    data.value = dataFromServer.message;

    console.log(data.value);
  });

  return (
    <>
      <h3>This is Server$</h3>
      <p>Message: {data.value}</p>

      <button onClick$={result}>Click</button>
    </>
  );
});
