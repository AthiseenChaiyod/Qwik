import { component$ } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$ } from "@builder.io/qwik-city";

//* Route Loader เขียนเอาไว้เพื่อดึงข้อมูลไปใช้ใน document head ด้านล่าง
//* จะได้เจออีกครั้งในบทต่อ ๆ ไป

export const MessageLoader = routeLoader$(async (requestEvent) => {
  const param = requestEvent.params.dynamicHead;
  console.log(param);

  const response = await fetch(
    "http://localhost:5173/docs/qwik-city/routing/endpoint"
  );
  const message = await response.json();

  return message;
});

export default component$(() => {
  return (
    <>
      <h3>This is dynamic head page!</h3>
    </>
  );
});

//* เมื่อเรามี routeLoader$() แล้วก็จะต้องทำการ resolve เพื่อนำ value มาใช้
//* ถ้าเรา assign ค่าให้กับ document head ด้วย callback แทนการเขียน object ตรง ๆ เราจะสามารถส่ง argument เข้าไปได้
//* โดย argument ที่เราจะส่งไปก็คือ property ของ document head
//* ให้เราใช้ .resolveValue(routeLoader) เพื่อ resolve ค่าที่อยู่ใน routeLoader แล้วค่อยนำมาใช้งาน
//* เมื่อตอนนี้เรายังไม่ได้อ่านเรื่อง route loader ก็ให้รู้ไว้เฉย ๆ ว่าทำได้ก็พอ

export const head: DocumentHead = (documentHead) => {
  const message = documentHead.resolveValue(MessageLoader);

  return {
    title: `Qwik City: ${message.message}`,

    meta: [
      {
        name: "Qwik City: Dynamic Head name",
        content: "Qwik City: Dynamic Head content",
      },
      { property: "og:title", content: "Qwik City: Dynamic Head OG title" },
      {
        property: "og:description",
        content: "Qwik City: Dynamic Head OG description",
      },
    ],

    links: [
      {
        rel: "canonical",
        href: "http://localhost:5173/docs/qwik-city/pages/dynamic-head",
      },
    ],
  };
};
