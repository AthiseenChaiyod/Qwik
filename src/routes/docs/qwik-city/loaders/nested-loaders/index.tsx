import { component$ } from "@builder.io/qwik";
import { DocumentHead, routeLoader$ } from "@builder.io/qwik-city";

//* เราสามารถ resolve ค่าของ loader ตัวอื่นก่อนที่มันจะทำงานก็ได้
//* ใช้ .resolveValue() ของ requestEvent หรือ document head เพื่อทำการ resolve loader นั้น ๆ
//* เราจะสามารถนำค่าที่ resolve มาใช้ได้ทันที
//* ข้อจำกัดคือ จะต้องเป็น loader ในไฟล์เดียวกันเท่านั้น เรียกจากไฟล์อื่นแล้วจะติด error

export const useLoadSomething = routeLoader$<string>(() => {
  return "hello";
});

export const useAnotherMessageLoader = routeLoader$<string>(
  async (requestEvent) => {
    const message = await requestEvent.resolveValue(useLoadSomething);

    return message;
  }
);

export default component$(() => {
  const message = useAnotherMessageLoader();
  return (
    <>
      <h3>This is nested loader!</h3>
      <p>Message: {message.value}</p>
    </>
  );
});

export const head: DocumentHead = () => {
  return {
    title: "Qwik City: Nested Loaders",
  };
};
