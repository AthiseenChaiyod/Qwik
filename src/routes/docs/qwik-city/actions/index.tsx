import { component$ } from "@builder.io/qwik";
import { DocumentHead, Form, routeAction$ } from "@builder.io/qwik-city";

//* นอกจาก routeLoader$ ที่เราเอาไว้จัดการกับข้อมูลเมื่อเข้า route มา เราก็ยังมี routeAction$ ที่เอาไว้จัดการกับ form
//* routeAction$ จะทำงานคล้ายกับ routeLoader$ ที่ทำงานตอนเรา navigate มาที่ route เหมือนกัน
//* แต่เราสามารถส่ง argument เพิ่มเติมนอกจาก requestEvent เข้าไปได้ argument ที่ว่านั้นก็คือ formData
//* formData คือข้อมูลที่เรารับมาจาก form ที่ trigger routeAction$
//* โดยเราสามารถส่ง formData เข้ามาได้สองวิธีด้วยกัน
//* วิธีแรกคือการใช้ <Form action={action} />
//* เราจะใช้วิธีการ resolve ค่าของ routeAction$ เหมือน routeLoader$ ก็คือการ assign ให้ตัวแปรเลย
//* เช่น const action = useActionLoader();
//* ต่อมาเราถึงจะนำตัวแปรไปใช้กับ action ของ Form ได้
//* โดย input element ของ Form จะต้องมี name="string" ที่จะระบุชื่อของ formData field นั้น ๆ ด้วย
//* เช่น <input type="text" name="firstName" />
//* ส่วนการ submit จะต้องใช้ attribute type="submit" ของ button ในการส่ง formData ไปยัง routeAction$
//* หลังจากนั้นใน routeAction$ เราจึงจะสามารถเข้าถึง formData.firstName ได้
//* ส่วนอีกวิธีคือการส่ง submit โดยตรง โดยใช้ action.submit({ ... })
//* เปลี่ยนจากการใช้ Form เป็นการใช้ event เพื่อ trigger action.submit() โดยตรง
//* เราสามารถส่ง argumetn เข้าไปใน action.submit() ได้ อยู่ที่ว่าเราอยากส่งอะไรเข้าไป จะเข้าถึงผ่าน formData ได้เหมือนเดิม
//* แต่ว่า action.submit() ให้เราแปะ await เอาไว้ด้วย (เป็น async operation)

//* นอกจากการใช้งานพื้นฐานแล้ว routeAction$ ยังมีการใช้งานอีกหลายอย่าง
//* เราสามารถแปะ spaReset เพื่อทำการ reset form หลัง submit ได้
//* data ที่เราส่งเข้ามาใน formData จะถูกเก็บเอาไว้ใน action.formData เราสามารถใช้ .get("") เพื่อเข้าถึง state ก่อนหน้าได้ด้วย
//* มี event onSubmitCompleted$={callback} ให้ใช้ด้วย เอาไว้สั่งว่าหลัง submit จะให้ทำอะไรต่อ
//* ในการทำงานที่ล้มเหลวของ routeAction$ ให้เราส่งค่า requestEvent.fail(status, { ... }) กลับไป

export const useActionLoader = routeAction$((formData, requestEvent) => {
  console.log(formData);

  if (!formData) {
    return requestEvent.fail(500, {
      message: "No form data",
    });
  }

  return {
    success: true,
  };
});

export default component$(() => {
  const action = useActionLoader();

  const previousFirstName = action.formData?.get("firstName");
  console.log(previousFirstName);

  return (
    <>
      <Form
        action={action}
        onSubmitCompleted$={() => {
          console.log("Submit completed!");
        }}
        spaReset
      >
        <input type="text" name="firstName" />
        <input type="text" name="lastName" />
        <button type="submit">Submit</button>
      </Form>

      <button
        onClick$={async () =>
          await action.submit({ firstName: "Athiseen", lastName: "Chaiyod" })
        }
      >
        Or FORCE SUBMIT
      </button>

      {action.value?.success && <p>Success</p>}
    </>
  );
});

export const head: DocumentHead = () => {
  return {
    title: "Qwik City: Actions",
  };
};
