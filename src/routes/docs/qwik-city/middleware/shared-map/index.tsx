import { component$ } from "@builder.io/qwik";
import { DocumentHead, RequestHandler } from "@builder.io/qwik-city";

//* เราสามารถบันทึกข้อมูลเอาไว้ให้ handler ตัวอื่นเรียกใช้ได้ด้วย requestEvent.sharedMap.set(key, value)
//* สามารถใช้ได้กับทุก scope ที่มี requestEvent ใช้ ไม่จำเป็นจะต้องเป็น middleware เพียงอย่างเดียว
//* การเรียกข้อมูลก็แค่ .sharedMap.get(key)
//* แต่ให้ระวังตอน .set(), type ที่เราทำเอาไว้จะถูกนับเป็น any ไปเลย ต้องมานั่งทำ type narrowing เอาอีกทีหลัง .get()

export const onRequest: RequestHandler = async (requestEvent) => {
  requestEvent.sharedMap.set("user", {
    username: "Athiseen",
    password: "123456",
  });

  await requestEvent.next();
};

export const onGet: RequestHandler = async (requestEvent) => {
  const user = requestEvent.sharedMap.get("user");
  console.log("Shared Map [onGet]:", user);
};

export default component$(() => {
  return (
    <>
      <h3>This is Middleware [Shared Map]</h3>
    </>
  );
});

export const head: DocumentHead = () => {
  return {
    title: "Middleware [Shared Map]",
  };
};
