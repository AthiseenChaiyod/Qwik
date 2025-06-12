import { component$ } from "@builder.io/qwik";
import {
  type DocumentHead,
  Form,
  routeAction$,
  validator$,
} from "@builder.io/qwik-city";

//* เราสามารถใช้งาน validator$ พร้อมกันกี่ตัวก็ได้ โดยให้คั่นด้วย ,
//* อย่างไรก็ตาม การประกาศ validator$ เอาไว้ที่เดียวกันหลาย ๆ ตัวจะทำให้โค้ดยุ่งเหยิง
//* ให้เรามาสร้างตัวแปรที่เก็บค่า validator$ เอาไว้แล้วค่อยไปประกาศทีเดียวโค้ดจะดูสวยกว่า

const validatorA = validator$(() => {
  console.log("validatorA");

  if (1 === 1) {
    return {
      success: true,
    };
  }

  return {
    success: false,

    error: {
      message: "1 !== 1",
    },
  };
});

const validatorB = validator$(() => {
  console.log("validatorB");

  if (2 === 2) {
    return {
      success: true,
    };
  }

  return {
    success: false,

    error: {
      message: "2 !== 2",
    },
  };
});

export const useMultipleValidatorsAction = routeAction$(
  async (formData, requestEvent) => {
    return {
      success: true,

      data: formData,
    };
  },

  validatorA,
  validatorB
);

export default component$(() => {
  const action = useMultipleValidatorsAction();

  return (
    <>
      <Form action={action} spaReset>
        <input type="text" name="name" />
        <button type="submit">Submit</button>
      </Form>
    </>
  );
});

export const head: DocumentHead = () => {
  return {
    title: "Qwik City: Validators [Multiple]",
  };
};
