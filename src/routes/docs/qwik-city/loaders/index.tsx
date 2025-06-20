import { component$ } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$ } from "@builder.io/qwik-city";

//* ทุกครั้งที่เรา navigate มาที่ route ที่มี loader ตัว loader จะทำงานก่อนเสมอ
//* เหมาะกับการเอาไว้จัดการข้อมูลภายนอก อย่าง fetch ข้อมูลมาเตรียมเอาไว้
//* อย่างที่เราเขียนไปในบท pages เราสามารถเขียน loader ได้โดยการใช้ routeLoader$() assign ให้กับตัวแปร
//* ด้านใน () ของ loader จะเป็น async callback ที่จะสามารถส่ง requestEvent ไปเป็น argument ได้ (เหมือน useTask, etc.)
//* ส่วนตอนจะนำไปใช้งานก็สามารถนำไป assign ให้กับตัวแปรได้เลยโดยไม่ต้องประกาศ useSignal() (เป็น signal อยู่แล้ว)
//* โดยเวลาเอาไปใช้ให้มี () เอาไว้เป็น suffix ด้วยเสมอ
//* นิยมเขียนด้วย prefix use เพื่อให้เข้าใจว่าค่าที่ได้คือ signal นะ
//* และในหนึ่งไฟล์ เราสามารถเขียน loader กี่ตัวก็ได้
//* อย่าลืมเขียนแปะ generics เอาไว้เพื่อให้รู้ว่า loader ตัวนี้ส่งค่าอะไรกลับด้วย

export const useMessageLoader = routeLoader$<string>(async (requestEvent) => {
  const response = await fetch(
    "http://localhost:5173/docs/qwik-city/routing/endpoint"
  );
  const message = await response.json();

  return message.message as string;
});

export const useSameLoader = routeLoader$<string>(async (requestEvent) => {
  const response = await fetch(
    "http://localhost:5173/docs/qwik-city/routing/endpoint"
  );
  const message = await response.json();

  return message.message as string;
});

export default component$(() => {
  const message = useMessageLoader();
  const sameMessage = useSameLoader();

  return (
    <>
      <h3>
        This is routeLoader$() value: {message.value} and {sameMessage.value}
      </h3>
    </>
  );
});

export const head: DocumentHead = () => {
  return {
    title: "Qwik City: Loaders",
  };
};
