import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <>
      <h3>This is Google Structured Data!</h3>
    </>
  );
});

//* เราสามารถใช้ script เพื่อเขียนข้อมูลในรูป Google Structured Data ได้ (ไปหาอ่านเองใน docs ของ Google)

export const head: DocumentHead = (documentHead) => {
  return {
    scripts: [
      {
        props: { type: "application/ld+json" },
        script: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
        }),
      },
    ],
  };
};
