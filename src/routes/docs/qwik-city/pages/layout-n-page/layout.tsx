import { component$, Slot } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <>
      <h3>This is layout.tsx!</h3>
      <Slot />
    </>
  );
});

//* เราจะนำ title ของ index.tsx มาใช้ใน layout ผ่าน props.head ใน document head ของ layout.tsx

export const head: DocumentHead = (documentHead) => {
  const title = documentHead.head;

  return {
    title: `Qwik City: nested ${title.title}`,
  };
};
