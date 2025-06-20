import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <>
      <h3>This is index.tsx!</h3>
    </>
  );
});

//* เราสามารถนำ title ที่เขียนเอาไว้ใน document head ไปใช้ใน layout ได้

export const head: DocumentHead = (documentHead) => {
  return {
    title: "Qwik City: Layout & Page",
  };
};
