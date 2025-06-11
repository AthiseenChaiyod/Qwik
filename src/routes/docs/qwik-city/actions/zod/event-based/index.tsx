import { component$ } from "@builder.io/qwik";
import { type DocumentHead, routeAction$, zod$ } from "@builder.io/qwik-city";

//* การเขียน zod$() แบบ callback เราสามารถส่ง argument เข้าไปได้ 2 ตัว
//* ตัวแรกคือ z ที่จะแทนตัว z ที่เอาไว้ใช้ทำ z.object, z.string, etc. นั่นแหละ ส่วนอีกตัวคือ requestEvent
//* ดังนั้น เราสามารถใช้ argument 2 ตัวนี้เพื่อทำการคำนวณก่อนส่งค่า z.object({ ... }) กลับก็ได้

export const useZodEventBased = routeAction$(
  () => {
    return {
      success: true,
    };
  },
  zod$((z, requestEvent) => {
    const isAthiseen =
      requestEvent.url.searchParams.get("firstName") === "Athiseen";
    console.log(isAthiseen);

    return z.object({
      firstName: z.string(),
    });
  })
);

export default component$(() => {
  const action = useZodEventBased();

  return (
    <>
      <button
        onClick$={() => {
          action.submit({ firstName: "Athiseen" });
        }}
      >
        Submit
      </button>
    </>
  );
});

export const head: DocumentHead = () => {
  return {
    title: "Qwik City: Actions [Zod Event-Based]",
  };
};
