import { $, component$, Slot, useSignal } from "@builder.io/qwik";

//* slots มีเอาไว้สำหรับ project child content ที่เราระบุเอาไว้ภายใน component เวลาเรียกใช้
//* จะเป็น Component อะไรก็ได้ ถ้าถูกระบุเอาไว้ภายใน tag ก็จะ render ทั้งหมด

export const Slots = component$(() => {
  return (
    <>
      <Slot />
    </>
  );
});

export const SlotsUsage = component$(() => {
  return (
    <>
      <Slots>
        <p>This is slots!</p>
      </Slots>
    </>
  );
});

//* แต่บางครั้งเราก็ต้องการจำกัดแค่บาง element เท่านั้น ไม่ใช่ทุก element ที่จะนำมา projec
//* ให้เราใช้ attribute name="value" เพื่อระบุว่า child ที่มี q:slot="value" ตรงกันเท่านั้นถึงจะถูก render ภายในนี้
//* เช่น <Parent name="child-component" /> เวลาแปะ child ก็ <Parent><Child q:slot="child-component" /></Parent>

export const NamedSlot = component$(() => {
  return (
    <>
      <Slot name="named-slot" />
    </>
  );
});

export const NamedSlotUsage = component$(() => {
  return (
    <>
      <NamedSlot>
        <p q:slot="named-slot">This is named-slot!</p>
      </NamedSlot>
    </>
  );
});

//* กรณีที่เราทำ conditional rendering, component ที่ถูก project จะถูกซ่อนเอาไว้แทน (ไม่ได้ถูกลบ element ออก)
//* และอีกส่วนสำคัญคือ <Slot /> ไม่ได้สนใจ element ที่อยู่ภายใน child ของมันอีกที
//* กล่าวคือ Slot จะมองดูแค่ element ภายในตัวมันเองเท่านั้น ไม่ได้มองลึกลงไปกว่านั้นแล้วจับมา render

export const UnprojectedSlot = component$(() => {
  const isHidden = useSignal(false);
  const changeIsHiddenValue = $(() => {
    isHidden.value = !isHidden.value;
  });

  return (
    <>
      <button onClick$={changeIsHiddenValue}>Click</button>
      {isHidden.value && <Slot name="unprojected-slot" />}
    </>
  );
});

export const UnprojectedSlotUsage = component$(() => {
  return (
    <>
      <UnprojectedSlot>
        <p q:slot="unprojected-slot">This is unprojected-slot!</p>

        <div>
          <p q:slot="unprojected-slot">This will not be projected!</p>
        </div>
      </UnprojectedSlot>
    </>
  );
});
