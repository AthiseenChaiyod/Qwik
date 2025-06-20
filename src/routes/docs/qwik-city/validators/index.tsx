import { component$ } from "@builder.io/qwik";
import {
  type DocumentHead,
  Form,
  routeAction$,
  validator$,
  z,
} from "@builder.io/qwik-city";

//* นอกจาก zod$ แล้วเราก็ยังมีตัว validator$ ให้ใช้ด้วยเหมือนกัน โดยวิธีใช้งานให้ประกาศหลัง callback เหมือน zod$ เลย
//* ตัว argument ที่รับจะต่างกัน zod$ จะรับ z, requestEvent แต่ validator$ จะรับ requestEvent, formData
//* ยิ่งไปกว่านั้น formData ของ validator$ จะเป็น unknown ทำให้เรา . เพื่อเอาข้อมูลข้างในไม่ได้ด้วย
//* หลัก ๆ แล้ว validator$ จะเอามาใช้ทำ request validation มากกว่า เพราะ zod$ สามารถทำ form validation ได้
//* แต่ว่าก็ใช่ว่าเราจะทำ form validation ใน validator$ ไม่ได้
//* ให้เราเขียน z.object แล้วเอาไป parse กับ formData ของ validator$ เอาเอง
//* อย่างไรก็ตาม validator$ จะบังคับให้เราส่ง { success: true } กลับไปเสมอถ้าเราทำ validation สำเร็จ
//* ถ้าทำไม่สำเร็จก็ให้ส่ง { success: false, error: { message: '...' }} กลับไป
//* ซึ่ง validator$ จะทำงานก่อนที่ routeAction$ จะทำงาน
//* จะคล้ายกับ middleware ที่ถ้าเกิดทำงานสำเร็จ routeAction$ จึงจะทำงาน ถ้าไม่สำเร็จก็ข้าม routeAction$ ไปเลย
//* ข้อสังเกตอีกอย่างหนึ่งก็คือเวลาที่ validator$ ส่งค่ากลับ return type จะไม่ได้เป็นตามข้อมูลที่เราส่งกลับ
//* เช่น falsy return ของ validator$ จะเป็น { failed: boolean, message: string, data?: JSONObject; success?: boolean }
//* ทั้ง ๆ ที่เราส่ง { success: false, error: { message: 'Something went wrong?' }} กลับมาแท้ ๆ
//* หากเราคิดดูดี ๆ type ที่เราจะได้จาก validator$ จะมีอยู่สองแบบด้วยกัน
//* แบบแรก true เราจะได้ { success: boolean; data: JSONObject; }
//* แบบที่สอง false เราจะได้ { failed: boolean; message: string; }
//* หากเราลองนำ return type ของ true ไปวางไว้ตรง false โดยให้เป็น optional จะเห็นว่าเราได้ return type ตัวเดียวกันกับข้างบนเลย
//* แปลว่า return type ของตัวมันเองจะถูกนำไปเพิ่มให้กับ return type ของด้านตรงข้ามโดยให้เป็น optional
//* ถ้าเราลองใช้ value satisfies type ดูก็จะเห็นว่าไม่เกิด error แปลว่าที่เราคิดก็ถูกต้องแล้ว
//* แต่ว่า แล้วเราจะเอาค่าของ validator$ มาจากไหน? validator$ return ไปไว้ตรงไหนกันล่ะ?
//* คำตอบก็คือ action.value สำหรับใช้ใน context ที่นำ action ที่มี validator$ ไปใช้งาน
//* หากเราลอง console.log(action.value) ดูจะเห็นว่าเราได้ค่าออกมาบน console ของ browser เป็นสิ่งที่เราเขียนเอาไว้
//* สรุปก็คือ ค่าที่ได้จากการใช้ validator$ จะถูกนำมาใช้บน scope ที่นำมันไปใช้เป็นหลัก
//* หน้าที่ของ validator$ ก็แค่จะให้ผ่านไปหา routeAction$ หรือไม่ แค่นั้นเลย

export const useValidatorAction = routeAction$(
  async (formData, requestEvent) => {
    return {
      success: true,

      data: formData,
    };
  },

  validator$((requestEvent, formData) => {
    const schema = z.object({
      firstName: z.string().min(3),
      lastName: z.string().min(3),
    });

    const validatedData = schema.safeParse(formData);

    if (validatedData.success) {
      return {
        success: true,

        data: validatedData.data,
      };
    } else {
      return {
        success: false,

        error: {
          message: "Something went wrong",
        },
      };
    }
  })
);

export default component$(() => {
  const action = useValidatorAction();

  if (action.value) {
    if (action.value.failed) {
      action.value satisfies {
        failed: boolean;
        message: string;
        data?: any;
        success?: boolean;
      };
    } else {
      action.value satisfies {
        success: boolean;
        data: any;
        failed?: boolean;
        message?: string;
      };
    }
  }

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
    title: "Qwik City: Validators",
  };
};
