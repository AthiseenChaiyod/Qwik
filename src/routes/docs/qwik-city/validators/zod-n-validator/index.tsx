import { component$ } from "@builder.io/qwik";
import {
  type DocumentHead,
  Form,
  routeAction$,
  validator$,
  zod$,
} from "@builder.io/qwik-city";

//* แต่ว่าเราสามารถใช้ validator$ ร่วมกับ zod$ ได้ โดยจะต้องให้ zod$ เป็น argument ต่อจาก callback เท่านั้น
//* โดยการทำงานจะไล่จากล่างขึ้นบนเหมือนกับการประกาศ validators หลายตัวก่อนหน้า
//* ถ้าเกิด zod$ validate ไม่ผ่านก็จะไม่เข้าไป routeAction$ เหมือน validator$

export const useZodAndValidatorAction = routeAction$(
  async (formData, requestEvent) => {
    console.log("action operation");

    return {
      success: true,
    };
  },

  zod$((z, requestEvent) => {
    console.log("zod operation");

    return z.object({
      firstName: z.string().min(3),
      lastName: z.string().min(3),
    });
  }),

  validator$((requestEvent, formData) => {
    if (requestEvent.url.host === "localhost:5173") {
      console.log("validate success!");

      return {
        success: true,
      };
    } else {
      console.log("validate failed!");

      return {
        success: false,

        error: {
          message: "Wrong host",
        },
      };
    }
  })
);

export default component$(() => {
  const action = useZodAndValidatorAction();

  return (
    <>
      <Form action={action} spaReset>
        <input type="text" name="firstName" />
        <input type="text" name="lastName" />
        <button type="submit">Submit</button>
      </Form>
    </>
  );
});

export const head: DocumentHead = () => {
  return {
    title: "Qwik City: Validators [Zod & Validator]",
  };
};
