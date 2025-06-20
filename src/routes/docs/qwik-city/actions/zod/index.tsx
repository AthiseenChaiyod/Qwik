import { component$ } from "@builder.io/qwik";
import {
  type DocumentHead,
  routeAction$,
  z,
  zod$,
} from "@builder.io/qwik-city";

//* ใน Qwik จะมี zod$ เป็น built-in ให้ใช้เลย
//* ให้เราประกาศเอาไว้ด้านหลังของ callback
//* เช่น export const something = routeAction$(() => { ... }, zod$({ ... }))
//* zod$ จะรับค่า object ที่ assign value ให้ key ด้วย z.type() เพื่อนำมาเช็คว่า formData มี type ตรงกันไหม
//* หรือถ้าไม่อยากเขียนในรูป object ให้เราส่ง callback ไปแทนก็ได้ แต่ให้ return z.object({ ... }) กลับมาแทน
//* เช่น export const another = routeAction$(() => { ... }, zod$(() => { return z.object({ ... })}))

export const useZodValidation = routeAction$(
  async (formData, requestEvent) => {
    console.log("Action A activated!");

    return {
      success: true,
    };
  },

  zod$({
    firstName: z.string(),
    lastName: z.string(),
    age: z.number().min(0).max(120),
  })
);

export const useZodValidation2 = routeAction$(
  async (formData, requestEvent) => {
    console.log("Action B activated!");

    return {
      success: true,
    };
  },

  zod$(() => {
    return z.object({
      firstName: z.string(),
      lastName: z.string(),
      age: z.number().min(0).max(120),
    });
  })
);

export default component$(() => {
  const actionA = useZodValidation();
  const actionB = useZodValidation2();

  return (
    <>
      <button
        onClick$={() => {
          actionA.submit({ firstName: "John", lastName: "Doe", age: 20 });
        }}
      >
        Action A
      </button>

      <button
        onClick$={() => {
          actionB.submit({ firstName: "Jane", lastName: "Doe", age: 29 });
        }}
      >
        Action B
      </button>
    </>
  );
});

export const head: DocumentHead = () => {
  return {
    title: "Qwik City: Actions [Zod]",
  };
};
