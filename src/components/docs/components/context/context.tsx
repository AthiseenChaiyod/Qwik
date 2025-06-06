import {
  component$,
  createContextId,
  useContext,
  useContextProvider,
  useSignal,
  type Signal,
} from "@builder.io/qwik";

//* ปัญหาของ Qwik ก็คือ ถ้าเราจะส่ง state ของ parent ไปให้กับ child ที่อยู่ไกลเราจะต้องทำ prop drilling หลายครั้ง
//* ดังนั้น Qwik เลยมี built-in context สำหรับการส่ง state ไปให้ child เรียกใช้ได้ทันที
//* ให้เราทำการสร้าง context ด้วย useContextId<Signal<T>>(id: string) ก่อน
//* เช่น const SomeContext = createContextId<Signal<string>>("this.is-id");
//* พยายามใช้ชื่อ id ให้ไม่ซ้ำกัน ให้ใช้ prefix สร้างตามด้วย . จะเป็น best practice สำหรับการสร้าง context
//* จากโค้ดของ SomeContext เราจะได้ว่า "สร้าง context ชื่อ docs.this-is-id ที่จะเป็น type Signal<string>"
//* ต่อมา ให้เรานำ context ไปประกาศเอาไว้บน parent เพื่อให้ child เรียกใช้ได้
//* ใช้ useContextProvider(context, value) เพื่อผูก context จาก createContextId กับ value ที่เราต้องการ
//* สมมติว่าเรามี const name = useSignal("John Doe") เราก็จะผูกโดยการใช้ useContextProvider(SomeContext, name)
//* พอเราผูก context เข้ากับ value เสร็จแล้ว ทีนี้ child ก็จะสามารถเรียกใช้ context เราได้เลย ไม่ว่าจะอยู่ลึกแค่ไหนก็ตาม
//* ให้เรียกใช้ด้วย useContext(context) เพื่อดึงค่าจาก context ที่ระบุเอาไว้ด้วย useContextProvider()
//* เช่น const name = useContext(SomeContext)
//* แค่นี้เราก็ไม่ต้องทำ prop drilling แล้ว

interface UserProps {
  username: string;
  password: string;
}

export const UserContext =
  createContextId<Signal<UserProps>>("docs.user-context");

export const UserParent = component$(() => {
  const user = useSignal<UserProps>({
    username: "Athiseen",
    password: "123456",
  });
  useContextProvider(UserContext, user);

  return (
    <>
      <UserChild />
    </>
  );
});

export const UserChild = component$(() => {
  const user = useContext(UserContext);

  return (
    <>
      <h3>
        Hello, {user.value.username}! Your pass is: {user.value.password}
      </h3>
    </>
  );
});
