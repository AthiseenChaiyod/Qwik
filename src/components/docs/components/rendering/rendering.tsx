import { component$, useSignal } from "@builder.io/qwik";

//* ในการทำ list rendering เราจะต้องใช้ JSX ร่วมกับ .map ในการ return HTML ที่เราอยากได้กลับไป
//* นอกจาก argument ตัวแรกที่แทนที่ value ตำแหน่งนั้น ๆ แล้วเราก็มี key ที่แทนที่ index ของตำแหน่งนั้น ๆ เหมือนกัน
//* สามารถเอามาเขียนแปลง key เอาเองได้ กันซ้ำ แล้วค่อยไปแปะเอาไว้บน key ของ element

export const ListRendering = component$(() => {
  const list = useSignal<string[]>(["Apple", "Banana", "Orange"]);
  return (
    <>
      {list.value.map((item, key) => {
        return (
          <p key={key}>
            {item} with uniqueId {key}
          </p>
        );
      })}
    </>
  );
});

//* ส่วนการทำ conditional rendering เราจะใช้ JSX syntax เหมือนกัน
//* มีสองวิธี ไม่ condition ? true : false ก็ condition && true

export const ConditionalRendering = component$(() => {
  const isTrue = useSignal(false);

  return (
    <>
      <button onClick$={() => (isTrue.value = !isTrue.value)}>Click</button>
      {isTrue.value ? <p>True</p> : <p>False</p>}
      {isTrue.value && <p>True</p>}
    </>
  );
});

//* การทำ binding นอกจาก bind:value={value} ก็ยังมี bind:checked={value} สำหรับผูกค่ากับ radio input
//* แต่ว่าการนำ signal true / false มาแสดงโดยตรงไม่สามารถทำได้ จะต้องแปลงเป็น string ก่อน
//* เพิ่มเติมเรื่อง event ก็คือ argument ตัวแรกจะเป็น event object ส่วนตัวที่สองจะเป็น element ที่ event trigger

export const Binding = component$(() => {
  const name = useSignal("");
  const isChecked = useSignal(false);

  return (
    <>
      <input
        type="text"
        bind:value={name}
        onInput$={(event, element) => {
          console.log(element.value);
        }}
      />
      <p>Name: {name.value}</p>

      <input
        type="radio"
        bind:checked={isChecked}
        onChange$={(event, element) => {
          console.log(element.value);
        }}
      />
      <p>IsChecked: {isChecked.value ? "True" : "False"}</p>
    </>
  );
});
